"use client";

import { useGetForms, useDeleteForm } from "~/hooks/api/form/form.hook";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { IconPlus, IconEdit, IconTrash, IconChartBar } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";

export default function FormsPage() {
  const { data: forms, isLoading, refetch } = useGetForms();
  const { deleteFormAsync, isPending: isDeleting } = useDeleteForm();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      try {
        await deleteFormAsync({ id });
        toast.success("Form deleted successfully");
        refetch();
      } catch (e) {
        toast.error("Failed to delete form");
      }
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
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Forms</h1>
              <p className="text-muted-foreground mt-1">Manage, edit, or delete your existing forms.</p>
            </div>
            <Link href="/dashboard/forms/create">
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
              <Link href="/dashboard/forms/create">
                <Button variant="outline" className="gap-2">
                  <IconPlus className="size-4" /> Create your first form
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms?.map((form) => (
                <Card key={form.id} className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl dark:bg-black/40 hover:bg-white/10 dark:hover:bg-black/60 transition-colors">
                  <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold truncate">{form.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 h-10">
                      {form.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Created {form.createdAt ? format(new Date(form.createdAt), "MMM d, yyyy") : "Unknown"}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4 border-t border-border/50 flex flex-wrap gap-2 justify-between bg-black/10">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <Button variant="secondary" size="sm" className="gap-2 hover:bg-secondary/80">
                          <IconEdit className="size-4" /> Open
                        </Button>
                      </Link>
                      <Link href={`/dashboard/forms/${form.id}/results`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <IconChartBar className="size-4" /> Results
                        </Button>
                      </Link>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(form.id)}
                      disabled={isDeleting}
                      title="Delete form"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
