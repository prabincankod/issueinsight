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
import { useEffect } from "react";

const AddCategoryFormSchema = z.object({
  name: z.string(),
  createdBy: z.string(),
  submittedTo: z.string(),
  status: z.string(),
});
export type Category = z.infer<typeof AddCategoryFormSchema>;
interface IProps {
  onSuccessFulSubmit: () => void;
  id: string;
}
const EditCategoryForm = async ({ onSuccessFulSubmit, id }: IProps) => {
  const complaint = trpc.computers.getCompalintById.useQuery({ id });

  const form = useForm<z.infer<typeof AddCategoryFormSchema>>({
    resolver: zodResolver(AddCategoryFormSchema),
  });

  useEffect(() => {
    if (complaint.data) {
      form.reset({
        createdBy: complaint.data.userId,
        name: complaint.data.name,
        status: String(complaint.data.status),
        submittedTo: complaint.data.targetId,
      });
    }
  }, [complaint.data, form]);

  const mutateComplaint = trpc.computers.editComplaint.useMutation();

  function onSubmit(values: z.infer<typeof AddCategoryFormSchema>) {
    console.log("from submit", values);
    mutateComplaint.mutate(
      {
        // createdBy: values.createdBy,
        id: id,
        name: values.name,
        status: values.status,
        submittedTo: values.submittedTo,
      },
      {
        onSuccess(data, variables, context) {
          onSuccessFulSubmit();
        },
      }
    );
  }

  const users = trpc.computers.getUsers.useQuery();

  if (complaint.isLoading || users.isLoading) return <>Loading...</>;

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
        
        <FormField
          control={form.control}
          name="submittedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submitted To</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || complaint.data?.targetId}
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value|| complaint.data?.status}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SENT">SENT</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="DONE">DONE</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /></div>

        <Button className="my-2" onClick={form.handleSubmit(onSubmit)}>
          {/* {mutateAddCategory.isPending ? (
            <Loader className="animate-spin" />
          ) : (
            <PlusCircle />
          )} */}
          Edit Complaint
        </Button>
      </form>
    </Form>
  );
};

export default EditCategoryForm;
