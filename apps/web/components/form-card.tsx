"use client";

import { IconEdit, IconChartBar, IconArchive, IconRestore, IconTrash, IconPencil } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { useDeleteForm, useUpdateFormStatus, useUpdateForm } from "~/hooks/api/form/form.hook";
import { GetUserFormsOutputType } from "@repo/services/form/model";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useState } from "react";

export default function FormCard({ form, isArchived, refetch }: { form: GetUserFormsOutputType[number]; isArchived: boolean, refetch: () => void }) {
    const { updateStatusAsync, isPending: isUpdating } = useUpdateFormStatus();
    const { deleteFormAsync, isPending: isDeleting } = useDeleteForm();
    const { updateFormAsync, isPending: isSaving } = useUpdateForm();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(form.title);
    const [editDescription, setEditDescription] = useState(form.description || "");

    const handleSaveEdit = async () => {
        try {
            await updateFormAsync({ id: form.id, title: editTitle, description: editDescription });
            toast.success("Form updated successfully");
            setIsEditModalOpen(false);
            refetch();
        } catch (e) {
            toast.error("Failed to update form");
        }
    };

    const handleRestore = async (id: string, currentVisibility: string = "unlisted") => {
        try {
            await updateStatusAsync({ formId: id, status: "draft", visibility: currentVisibility as any });
            toast.success("Form restored to draft");
            refetch();
        } catch (e) {
            toast.error("Failed to restore form");
        }
    };

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

    const handleArchive = async (id: string, currentVisibility: string = "unlisted") => {
        try {
            await updateStatusAsync({ formId: id, status: "archived", visibility: currentVisibility as any });
            toast.success("Form archived successfully");
            refetch();
        } catch (e) {
            toast.error("Failed to archive form");
        }
    };


    return (
        <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl dark:bg-black/40 hover:bg-white/10 dark:hover:bg-black/60 transition-colors">
            <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 overflow-hidden pr-4">
                        <CardTitle className="text-xl font-bold truncate">{form.title}</CardTitle>
                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0">
                                    <IconPencil className="size-3.5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Form Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSaveEdit} disabled={isSaving || !editTitle.trim()}>
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Badge variant={form.status === "published" ? "default" : "secondary"} className="capitalize shrink-0">
                        {form.status}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2 h-10">
                    {form.description || "No description provided."}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${form.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    Created {form.createdAt ? format(new Date(form.createdAt), "MMM d, yyyy") : "Unknown"}
                </div>
            </CardContent>

            <CardFooter className="pt-4 border-t border-border/50 flex flex-wrap gap-2 justify-between bg-black/10">
                <div className="flex gap-2">
                    <Link href={`/forms/${form.id}`}>
                        <Button variant="secondary" size="sm" className="gap-2 hover:bg-secondary/80">
                            <IconEdit className="size-4" /> Open
                        </Button>
                    </Link>
                    <Link href={`/forms/${form.id}/results`}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <IconChartBar className="size-4" /> Results
                        </Button>
                    </Link>
                </div>
                <div className="flex gap-2">
                    {isArchived ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                            onClick={() => handleRestore(form.id)}
                            disabled={isUpdating}
                            title="Restore to Draft"
                        >
                            <IconRestore className="size-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                            onClick={() => handleArchive(form.id)}
                            disabled={isUpdating}
                            title="Archive form"
                        >
                            <IconArchive className="size-4" />
                        </Button>
                    )}
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
                </div>
            </CardFooter>
        </Card>
    );
};
