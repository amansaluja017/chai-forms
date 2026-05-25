"use client";

import { useParams } from "next/navigation";
import { useGetFormWorkspace } from "~/hooks/api/form/form.hook";
import { Spinner } from "~/components/ui/spinner";
import { FormBuilderProvider } from "../../../../../components/workspace/context";
import { Header } from "~/components/header";
import { BuilderDndContext } from "~/components/builder-dnd-context";
import { Toolbox } from "~/components/toolbox";
import { Canvas } from "~/components/canvas";
import { PropertiesPanel } from "~/components/properties-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";

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
      <div className="relative flex flex-col h-screen overflow-hidden bg-background">
        {/* Subtle dot grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60"></div>

        <div className="relative z-10 flex flex-col h-full">
          <Header
            formName={workspace.title}
            initialStatus={workspace.status?.status || "draft"}
            initialVisibility={workspace.status?.visibility || "public"}
          />

          <BuilderDndContext>
            <div className="flex-1 p-4 overflow-hidden h-full w-full">
              <ResizablePanelGroup orientation="horizontal" className="w-full h-full">
                <ResizablePanel defaultSize={15} minSize={100} maxSize={500}>
                  <Toolbox />
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-transparent relative z-50 transition-all hover:bg-primary/20 w-2" />

                <ResizablePanel defaultSize={60} minSize={40}>
                  <Canvas />
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-transparent relative z-50 transition-all hover:bg-primary/20 w-2" />

                <ResizablePanel defaultSize={15} minSize={15} maxSize={500}>
                  <PropertiesPanel />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </BuilderDndContext>
        </div>
      </div>
    </FormBuilderProvider>
  );
}
