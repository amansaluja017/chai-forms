"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetPublicFormWorkspace } from "~/hooks/api/form/form.hook";
import { FormWizard } from "../../../components/form-wizard";
import { IconLoader2, IconLock, IconArrowRight } from "@tabler/icons-react";
import { FormWorkspaceOutputType } from "@repo/services/form/model";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;
  const [passwordInput, setPasswordInput] = useState("");
  const [submittedPassword, setSubmittedPassword] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useGetPublicFormWorkspace(formId, submittedPassword);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPassword(passwordInput);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Form not available</h1>
          <p className="text-muted-foreground">This form may have been deleted or is no longer accepting responses.</p>
        </div>
      </div>
    );
  }

  if (data.isProtected && !data.form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-3xl animate-in fade-in zoom-in-95">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 shadow-inner">
              <IconLock className="size-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Protected Form</h1>
              <p className="text-muted-foreground text-sm">
                This form requires a password to view and submit.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="w-full space-y-4 mt-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full text-center ${data.isPasswordInvalid ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  autoFocus
                />
                {data.isPasswordInvalid && (
                  <p className="text-destructive text-sm font-medium animate-in slide-in-from-top-1">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
              
              <Button type="submit" className="w-full gap-2 rounded-xl h-11" disabled={!passwordInput || isLoading}>
                {isLoading ? <IconLoader2 className="size-4 animate-spin" /> : (
                  <>Unlock Form <IconArrowRight className="size-4" /></>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-muted/20">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{data.form?.title}</h1>
          {data.form?.description && (
            <p className="text-muted-foreground">{data.form.description}</p>
          )}
        </div>

        <FormWizard form={data.form as FormWorkspaceOutputType} />
      </div>
    </div>
  );
}
