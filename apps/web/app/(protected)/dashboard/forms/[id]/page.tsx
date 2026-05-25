"use client";

import { useParams } from "next/navigation";
import { useGetFormWorkspace } from "~/hooks/api/form/form.hook";
import { Spinner } from "~/components/ui/spinner";
import { FormBuilderProvider } from "./workspace/context";
import { Header } from "~/components/header";
import { BuilderDndContext } from "~/components/builder-dnd-context";
import { Toolbox } from "~/components/toolbox";
import { Canvas } from "~/components/canvas";
import { PropertiesPanel } from "~/components/properties-panel";

export default function FormWorkspacePage() {
  const { id } = useParams() as { id: string };
  const { data: workspace, isLoading, isError } = useGetFormWorkspace(id);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background flex-col gap-4">
        <h2 className="text-2xl font-bold">Error loading workspace</h2>
        <p className="text-muted-foreground">Form might not exist or you don't have permission.</p>
      </div>
    );
  }

  return (
    <FormBuilderProvider
      formId={workspace.id}
      initialFields={workspace.fields as any[]}
    >
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <Header
          formName={workspace.title}
          initialStatus={workspace.status?.status || "draft"}
          initialVisibility={workspace.status?.visibility || "public"}
        />

        <BuilderDndContext>
          <div className="flex flex-1 overflow-hidden">
            <Toolbox />
            <Canvas />
            <PropertiesPanel />
          </div>
        </BuilderDndContext>
      </div>
    </FormBuilderProvider>
  );
}
