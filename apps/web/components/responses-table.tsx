"use client";

import { useState } from "react";
import { useGetFormResponses } from "~/hooks/api/form/form.hook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { IconSearch, IconDownload, IconEye } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";

export function ResponsesTable({ formId }: { formId: string }) {
  const { data, isLoading } = useGetFormResponses(formId);
  const [search, setSearch] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="py-12 flex justify-center items-center">
          <Spinner className="size-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.responses.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="py-12 text-center text-muted-foreground">
          No responses have been submitted yet.
        </CardContent>
      </Card>
    );
  }

  const { fields, responses } = data;

  // Filter responses based on search term
  const filteredResponses = responses.filter((res) => {
    if (!search) return true;
    const term = search.toLowerCase();
    // Search across all string values in the response
    return res.response.some((ans) => ans.value.toLowerCase().includes(term));
  });

  // Prepare data for export
  const prepareExportData = () => {
    return filteredResponses.map((res) => {
      const row: any = {
        "Submitted At": res.createdAt ? format(new Date(res.createdAt), "MMM d, yyyy HH:mm:ss") : "Unknown",
        "Time To Complete (sec)": res.timeToComplete,
      };
      
      // Map field IDs to their labels
      fields.forEach((field) => {
        const answer = res.response.find((ans) => ans.formFieldId === field.id);
        row[field.label] = answer ? answer.value : "";
      });
      
      return row;
    });
  };

  const exportCSV = () => {
    const exportData = prepareExportData();
    if (exportData.length === 0) return;
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `form_responses_${formId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportXLSX = () => {
    const exportData = prepareExportData();
    if (exportData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, `form_responses_${formId}.xlsx`);
  };

  return (
    <>
      <Card className="mt-8">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <CardTitle>Raw Responses</CardTitle>
            <CardDescription>View all detailed submissions for this form.</CardDescription>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search responses..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Button variant="outline" onClick={exportCSV} className="gap-2 shrink-0">
              <IconDownload className="size-4" /> CSV
            </Button>
            <Button variant="outline" onClick={exportXLSX} className="gap-2 shrink-0">
              <IconDownload className="size-4" /> XLSX
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Submitted At</th>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">Time (sec)</th>
                  {/* Show up to 3 fields as columns for preview */}
                  {fields.slice(0, 3).map((f) => (
                    <th key={f.id} className="px-6 py-3 font-medium truncate max-w-[150px]">
                      {f.label}
                    </th>
                  ))}
                  {fields.length > 3 && <th className="px-6 py-3 font-medium">...</th>}
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredResponses.length > 0 ? (
                  filteredResponses.map((res) => (
                    <tr key={res.id} className="bg-card hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {res.createdAt ? format(new Date(res.createdAt), "MMM d, yyyy HH:mm") : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {res.timeToComplete}s
                      </td>
                      {fields.slice(0, 3).map((f) => {
                        const ans = res.response.find(a => a.formFieldId === f.id);
                        return (
                          <td key={f.id} className="px-6 py-4 truncate max-w-[150px]">
                            {ans ? ans.value : "-"}
                          </td>
                        );
                      })}
                      {fields.length > 3 && <td className="px-6 py-4 text-muted-foreground italic">more fields</td>}
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedResponse(res)}>
                          <IconEye className="size-4" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No matching responses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedResponse?.createdAt ? format(new Date(selectedResponse.createdAt), "MMM d, yyyy HH:mm") : "Unknown"} 
              <span className="mx-2">•</span> 
              Completed in {selectedResponse?.timeToComplete} seconds
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {fields.map((field) => {
              const answer = selectedResponse?.response.find((a: any) => a.formFieldId === field.id);
              return (
                <div key={field.id} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                  <div className="p-3 bg-muted/50 rounded-md border text-sm">
                    {answer && answer.value ? answer.value : <span className="italic text-muted-foreground">No answer provided</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
