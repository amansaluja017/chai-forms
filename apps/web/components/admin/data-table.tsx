"use client"

import * as React from "react"
import { trpc } from "~/trpc/client"
import { toast } from "sonner"
import {
  IconSearch,
  IconFilter,
  IconTrash,
  IconLoader,
  IconEye,
  IconChartBar,
} from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

export function AdminDataTable() {
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "draft">("all")
  const [sortFilter, setSortFilter] = React.useState<"latest" | "oldest">("latest")

  // For delete dialog
  const [deleteFormId, setDeleteFormId] = React.useState<string | null>(null)
  const [deleteReason, setDeleteReason] = React.useState("")

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  const utils = trpc.useUtils()
  const { data: forms, isLoading } = trpc.admin.getFormsList.useQuery({
    search: debouncedSearch,
    statusFilter,
    sortFilter,
  })

  const { mutateAsync: deleteForm, isPending: isDeleting } = trpc.admin.deleteFormAsAdmin.useMutation()

  const handleDelete = async () => {
    if (!deleteFormId || deleteReason.length < 10) {
      toast.error("Please provide a valid reason (min 10 chars)")
      return
    }

    try {
      await deleteForm({ formId: deleteFormId, reason: deleteReason })
      toast.success("Form deleted and user notified")
      setDeleteFormId(null)
      setDeleteReason("")
      utils.admin.getFormsList.invalidate()
      utils.admin.getDashboardStats.invalidate()
    } catch (e) {
      toast.error("Failed to delete form")
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search forms..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-[130px]">
              <IconFilter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortFilter} onValueChange={(v: any) => setSortFilter(v)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <IconLoader className="h-4 w-4 animate-spin" /> Loading forms...
                  </div>
                </TableCell>
              </TableRow>
            ) : forms && forms.length > 0 ? (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{form.creatorName}</span>
                      <span className="text-xs text-muted-foreground">{form.creatorEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={form.status === "published" ? "default" : "secondary"}>
                      {form.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{form.responsesCount}</TableCell>
                  <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/forms/${form.id}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View Public Form">
                          <IconEye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/forms/${form.id}/results`}>
                        <Button variant="ghost" size="icon" title="View Results & Download Responses">
                          <IconChartBar className="h-4 w-4 text-blue-500" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => setDeleteFormId(form.id)}
                        title="Delete Form"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No forms found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteFormId} onOpenChange={(o) => !o && setDeleteFormId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogDescription>
              This action will delete the form and send an email notification to the creator.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for deletion <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Please explain why this form is being deleted..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters. This reason will be included in the email.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFormId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
