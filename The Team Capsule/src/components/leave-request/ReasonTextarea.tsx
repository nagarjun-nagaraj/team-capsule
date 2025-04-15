
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface ReasonTextareaProps {
  form: UseFormReturn<FormValues>;
}

export const ReasonTextarea = ({ form }: ReasonTextareaProps) => {
  return (
    <FormField
      control={form.control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Reason</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Provide details about your request"
              {...field}
              rows={3}
            />
          </FormControl>
          <FormDescription>
            Keep it brief but informative.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
