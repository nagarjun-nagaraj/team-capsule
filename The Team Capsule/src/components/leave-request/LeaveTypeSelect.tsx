
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface LeaveTypeSelectProps {
  form: UseFormReturn<FormValues>;
}

export const LeaveTypeSelect = ({ form }: LeaveTypeSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="leaveType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Request Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="personal">Personal Leave</SelectItem>
              <SelectItem value="wfh">Work From Home</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
