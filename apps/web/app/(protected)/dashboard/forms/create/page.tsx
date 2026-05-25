"use client";

import { useCreateForm } from "~/hooks/api/form/form.hook";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Field, FieldLabel } from "~/components/ui/field";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CreateFormInputType } from "@repo/services/form/model";
import { toast } from "sonner";
import { trpc } from "~/trpc/client";

export default function CreateFormPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { createFormAsync, isPending } = useCreateForm();
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateFormInputType>();

  const onSubmit = async (data: CreateFormInputType) => {
    try {
      await createFormAsync(data);
      toast.success("Form created successfully!");
      utils.form.getForms.invalidate();
      router.push("/dashboard/forms");
    } catch (e) {
      toast.error("Failed to create form");
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
              <h1 className="text-3xl font-bold tracking-tight">Create New Form</h1>
              <p className="text-muted-foreground mt-1">Set up the basic details for your new form.</p>
            </div>
          </div>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl dark:bg-black/40 shadow-2xl">
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
              <CardDescription>Give your form a title and an optional description.</CardDescription>
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

                <div className="pt-4 flex justify-end border-t border-border/50">
                  <Button type="submit" disabled={isPending} className="gap-2 px-8 h-12 shadow-lg">
                    {isPending ? "Creating..." : (
                      <>
                        <IconCheck className="size-5" /> Create Form
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
