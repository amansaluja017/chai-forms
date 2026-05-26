"use client";

import { useParams } from "next/navigation";
import { useGetPublicFormWorkspace } from "~/hooks/api/form/form.hook";
import { FormWizard } from "../../../components/form-wizard";
import { IconLoader2 } from "@tabler/icons-react";
import { FormWorkspaceOutputType } from "@repo/services/form/model";

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;

  const { data: form, isLoading, isError } = useGetPublicFormWorkspace(formId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Form not available</h1>
          <p className="text-muted-foreground">This form may have been deleted or is no longer accepting responses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-muted/20">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{form.title}</h1>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
        </div>

        <FormWizard form={form as FormWorkspaceOutputType} />
      </div>
    </div>
  );
}
