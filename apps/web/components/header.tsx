"use client";

import { useFormBuilder } from "../app/(protected)/dashboard/forms/[id]/workspace/context";
import { Button } from "~/components/ui/button";
import { IconArrowLeft, IconDeviceFloppy, IconWorldUpload, IconEyeOff, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { useUpdateFormStatus } from "~/hooks/api/form/form.hook";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { IconShare } from "@tabler/icons-react";
import { Input } from "~/components/ui/input";

import { FormWizard } from "./form-wizard";

export function Header({ formName, initialStatus, initialVisibility }: { formName: string, initialStatus: string, initialVisibility: string }) {
  const { fields, formId } = useFormBuilder();
  const { updateStatusAsync, isPending: isPublishing } = useUpdateFormStatus();

  const [status, setStatus] = useState<"draft" | "published" | "archived" | "deleted">(initialStatus as any);
  const [visibility, setVisibility] = useState<"public" | "unlisted">(initialVisibility as any);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/f/${formId}` : "";

  const handlePublishToggle = async () => {
    const newStatus = status === "published" ? "draft" : "published";
    try {
      await updateStatusAsync({ formId, status: newStatus, visibility });
      setStatus(newStatus);
      toast.success(`Form is now ${newStatus}`);
      if (newStatus === "published") {
        setIsShareModalOpen(true);
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleVisibilityToggle = async (newVisibility: "public" | "unlisted") => {
    try {
      await updateStatusAsync({ formId, status, visibility: newVisibility });
      setVisibility(newVisibility);
      toast.success(`Visibility set to ${newVisibility}`);
    } catch (e) {
      toast.error("Failed to update visibility");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
        <Link href="/dashboard/forms">
          <Button variant="ghost" size="icon" className="rounded-full">
            <IconArrowLeft className="size-5" />
          </Button>
        </Link>

        <div className="flex-1">
          <h1 className="font-semibold text-lg">{formName}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsPreviewModalOpen(true)}>
            <IconEye className="size-4" />
            Preview
          </Button>

          {status === "published" && (
            <Button variant="secondary" size="sm" className="gap-2" onClick={() => setIsShareModalOpen(true)}>
              <IconShare className="size-4" />
              Share
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {visibility === "public" ? <IconEye className="size-4" /> : <IconEyeOff className="size-4" />}
                <span className="capitalize">{visibility}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Visibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleVisibilityToggle("public")}>
                Public (Anyone with link)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVisibilityToggle("unlisted")}>
                Unlisted (Hidden from directories)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={status === "published" ? "destructive" : "default"}
            size="sm"
            className="gap-2"
            onClick={handlePublishToggle}
            disabled={isPublishing}
          >
            <IconWorldUpload className="size-4" />
            {status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </header>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
            <DialogDescription>
              Anyone with this link will be able to view and submit this form.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <QRCodeSVG value={publicUrl} size={200} />
            </div>

            <div className="flex w-full items-center space-x-2">
              <Input
                readOnly
                value={publicUrl}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={copyLink}>
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Preview</DialogTitle>
            <DialogDescription>
              This is how your form will look to responders. Submissions here are simulated and will not be saved.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 p-4 sm:p-8 bg-muted/20 rounded-xl">
            <FormWizard
              form={{
                id: formId,
                title: formName,
                description: "",
                fields: fields as any,
                status: null,
                createdBy: "",
                createdAt: null,
                updatedAt: null
              } as any}
              isPreview={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
