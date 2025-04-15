
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { addLeaveRequest } from "@/services/leaveRequestService";
import { useAuth } from "@/contexts/AuthContext";
import { LeaveTypeSelect } from "./leave-request/LeaveTypeSelect";
import { WorkFromHomeCheckbox } from "./leave-request/WorkFromHomeCheckbox";
import { DatePicker } from "./leave-request/DatePicker";
import { ReasonTextarea } from "./leave-request/ReasonTextarea";
import { FormValues, getLeaveTypeDisplay } from "./leave-request/types";
import { useNavigate } from "react-router-dom";

const LeaveRequestForm = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    defaultValues: {
      leaveType: "",
      reason: "",
      isWorkFromHome: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a request.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the request to our service
      addLeaveRequest({
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Unknown User',
        userEmail: currentUser.email || 'unknown@example.com',
        type: getLeaveTypeDisplay(data.leaveType),
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        status: "pending",
        isWorkFromHome: data.leaveType === "wfh" || data.isWorkFromHome,
      });
      
      toast({
        title: data.isWorkFromHome || data.leaveType === "wfh" ? "Work From Home Request Submitted" : "Leave Request Submitted",
        description: "Your request has been submitted successfully and is pending approval.",
      });
      
      form.reset();
      
      // Navigate to leave requests page after submission for better user experience
      setTimeout(() => {
        navigate("/leave-requests");
      }, 1500);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchLeaveType = form.watch("leaveType");
  const isWfhEnabled = watchLeaveType === "other";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Time Off</CardTitle>
        <CardDescription>
          Submit a new leave or work from home request. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LeaveTypeSelect form={form} />
            <WorkFromHomeCheckbox form={form} isEnabled={isWfhEnabled} leaveType={watchLeaveType} />
            <DatePicker 
              form={form} 
              name="startDate" 
              label="Start Date" 
            />
            <DatePicker 
              form={form} 
              name="endDate" 
              label="End Date" 
              watch={form.watch} 
            />
            <ReasonTextarea form={form} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestForm;
