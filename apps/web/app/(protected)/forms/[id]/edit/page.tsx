"use client";

import { useGetFormById } from "~/hooks/api/form/form.hook";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Field, FieldLabel } from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UpdateFormInputType } from "@repo/services/form/model";
import { toast } from "sonner";
import { trpc } from "~/trpc/client";
import { useEffect } from "react";

export default function EditFormPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const utils = trpc.useUtils();
  
  const { data: form, isLoading: isFetching } = useGetFormById(id);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateFormInputType>();

  useEffect(() => {
    if (form) {
      reset({
        id: form.id,
        title: form.title,
        description: form.description || undefined,
      });
    }
  }, [form, reset]);

  const onSubmit = async (data: UpdateFormInputType) => {
    try {
      toast.success("Form updated successfully!");
      utils.form.getForms.invalidate();
      utils.form.getFormById.invalidate({ id });
      router.push("/forms");
    } catch (e) {
      toast.error("Failed to update form");
    }
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/forms">
              <Button variant="outline" size="icon" className="rounded-full">
                <IconArrowLeft className="size-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Form</h1>
              <p className="text-muted-foreground mt-1">Update your form's details.</p>
            </div>
          </div>

          {isFetching ? (
            <div className="flex justify-center py-24">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : !form ? (
            <div className="text-center py-24 text-muted-foreground">
              Form not found or you don't have permission to access it.
            </div>
          ) : (
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl dark:bg-black/40 shadow-2xl">
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Update the title or description.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  <Field className="space-y-2">
                    <FieldLabel htmlFor="title" className="text-sm font-medium">Form Title <span className="text-red-500">*</span></FieldLabel>
                    <Input 
                      id="title"
                      placeholder="e.g., Customer Feedback Survey"
                      className="h-12 bg-background/50"
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                  </Field>

                  <Field className="space-y-2">
                    <FieldLabel htmlFor="description" className="text-sm font-medium">Description</FieldLabel>
                    <Textarea 
                      id="description"
                      placeholder="Briefly describe what this form is for..."
                      className="min-h-[120px] bg-background/50 resize-y"
                      {...register("description")}
                    />
                  </Field>

                </form>
              </CardContent>
            </Card>
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
