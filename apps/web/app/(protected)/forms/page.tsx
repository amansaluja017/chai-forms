"use client";

import { useGetForms } from "~/hooks/api/form/form.hook";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import FormCard from "~/components/form-card";
import { GetUserFormsOutputType } from "@repo/services/form/model";

export default function FormsPage() {
  const { data: forms, isLoading, refetch } = useGetForms() as { data: GetUserFormsOutputType; isLoading: boolean; refetch: () => void };
  
  const activeForms = forms?.filter((f) => f.status !== "archived") || [] as GetUserFormsOutputType;
  const archivedForms = forms?.filter((f) => f.status === "archived") || [] as GetUserFormsOutputType;

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
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Forms</h1>
              <p className="text-muted-foreground mt-1">Manage, edit, or delete your existing forms.</p>
            </div>
            <Link href="/forms/create">
              <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                <IconPlus className="size-5" />
                Create Form
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : forms?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-2xl bg-card/30 border-dashed">
              <h2 className="text-xl font-semibold mb-2">No forms found</h2>
              <p className="text-muted-foreground mb-6">You haven't created any forms yet.</p>
              <Link href="/forms/create">
                <Button variant="outline" className="gap-2">
                  <IconPlus className="size-4" /> Create your first form
                </Button>
              </Link>
            </div>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Forms ({activeForms.length})</TabsTrigger>
                <TabsTrigger value="archived">Archived ({archivedForms.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-0">
                {activeForms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-card/30 border-dashed">
                    <p className="text-muted-foreground">You don't have any active forms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeForms.map((form) => (
                      <FormCard
                        key={form.id} form={form} isArchived={false}
                        refetch={refetch}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="archived" className="mt-0">
                {archivedForms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-card/30 border-dashed">
                    <p className="text-muted-foreground">You don't have any archived forms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                    {archivedForms.map((form) => (
                      <FormCard
                        key={form.id} form={form} isArchived={true}
                        refetch={refetch}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
