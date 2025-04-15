
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { UseFormReturn, UseFormWatch } from "react-hook-form";
import { FormValues } from "./types";

interface DatePickerProps {
  form: UseFormReturn<FormValues>;
  name: "startDate" | "endDate";
  label: string;
  watch?: UseFormWatch<FormValues>;
}

export const DatePicker = ({ form, name, label, watch }: DatePickerProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => {
                  if (name === "startDate") {
                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                  } else if (name === "endDate" && watch) {
                    const startDate = watch("startDate");
                    return (
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      (startDate && date < startDate)
                    );
                  }
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
