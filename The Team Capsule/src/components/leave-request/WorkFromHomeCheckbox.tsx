import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface WorkFromHomeCheckboxProps {
  form: UseFormReturn<FormValues>;
  isEnabled: boolean;
  leaveType: string;
}

export const WorkFromHomeCheckbox = ({ form, isEnabled, leaveType }: WorkFromHomeCheckboxProps) => {
  if (leaveType === "wfh" || !isEnabled) return null;
  
  return (
    <FormField
      control={form.control}
      name="isWorkFromHome"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Work From Home</FormLabel>
            <FormDescription>
              I confirm that I have the necessary equipment and connectivity to work from home effectively.
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};
