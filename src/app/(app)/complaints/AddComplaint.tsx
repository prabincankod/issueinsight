import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useMutation } from "@tanstack/react-query";
import { Loader, PlusCircle } from "lucide-react";

import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/trpc/api";
import { trpc } from "@/lib/trpc/client";

const AddCategoryFormSchema = z.object({
  name: z.string(),

  submittedTo: z.string(),
});
export type Category = z.infer<typeof AddCategoryFormSchema>;
interface IProps {
  onSuccessFulSubmit: () => void;
}
const AddCategoryForm = async ({ onSuccessFulSubmit }: IProps) => {
  const form = useForm<z.infer<typeof AddCategoryFormSchema>>({
    resolver: zodResolver(AddCategoryFormSchema),
  });

  const mutateComplaint = trpc.computers.createComplaint.useMutation();

  function onSubmit(values: z.infer<typeof AddCategoryFormSchema>) {
    console.log("from submit", values);
    mutateComplaint.mutate(values, {
      onSuccess(data, variables, context) {
        onSuccessFulSubmit();
      },
    });
  }

  const users = trpc.computers.getUsers.useQuery();
  return (
    <Form {...form}>
      <form>
        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complaint Name</FormLabel>
                <FormControl>
                  <Input placeholder="*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
          <FormField
            control={form.control}
            name="createdBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Created By</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Creator" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.data?.map((user) => (
                        <SelectItem key={user.id} value={`${user.id}`}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <FormField
          control={form.control}
          name="submittedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submitted To</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Submitted to" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.data?.map((user) => (
                      <SelectItem key={user.id} value={`${user.id}`}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="my-2" onClick={form.handleSubmit(onSubmit)}>
          {/* {mutateAddCategory.isPending ? (
            <Loader className="animate-spin" />
          ) : (
            <PlusCircle />
          )} */}
          Add Complaint
        </Button>
      </form>
    </Form>
  );
};

export default AddCategoryForm;
