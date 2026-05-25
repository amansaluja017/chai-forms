"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormBuilder } from "./workspace/context";
import { FormFieldType } from "@repo/services/form/model";
import { IconGripVertical, IconTrash, IconUpload } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { useDeleteFormField } from "~/hooks/api/form/form.hook";
import { toast } from "sonner";

function SortableField({ field }: { field: FormFieldType }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id!,
    data: {
      type: "Field",
      field,
    }
  });

  const { selectedFieldId, setSelectedFieldId, deleteField, formId } = useFormBuilder();
  const { deleteFieldAsync } = useDeleteFormField();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedFieldId === field.id;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic local delete
    deleteField(field.id!);
    try {
      await deleteFieldAsync({ id: field.id!, formId });
    } catch (error) {
      toast.error("Failed to delete field from database.");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-5 mb-4 border rounded-xl bg-card transition-all duration-300 cursor-pointer group
        ${isSelected ? "border-primary ring-1 ring-primary shadow-md shadow-primary/10 translate-x-1" : "border-border/50 hover:border-primary/50 hover:shadow-md shadow-sm"}
        ${isDragging ? "opacity-50 scale-[1.02] shadow-xl rotate-1 z-50" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedFieldId(field.id!);
      }}
    >
      {/* Decorative left accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-colors ${isSelected ? "bg-primary" : "bg-transparent group-hover:bg-primary/20"}`} />
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1" {...attributes} {...listeners}>
        <IconGripVertical className="size-4 text-muted-foreground" />
      </div>

      <div className="pl-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-semibold text-[15px]">{field.label}</span>
            {field.isRequired && <span className="text-destructive ml-1.5 font-bold">*</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
            onClick={handleDelete}
          >
            <IconTrash className="size-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1 capitalize">{field.type.replace("_", " ")}</div>

        {/* Simple preview of the field */}
        <div className="mt-4 opacity-80 pointer-events-none">
          {["text", "email", "number", "phone"].includes(field.type) && (
            <div className="h-11 w-full border border-border/60 rounded-lg bg-background flex items-center px-4 text-muted-foreground text-sm shadow-inner">
              {field.placeHolder || "..."}
            </div>
          )}
          {field.type === "dropdown" && (
            <div className="h-11 w-full border border-border/60 rounded-lg bg-background flex items-center justify-between px-4 text-muted-foreground text-sm shadow-inner">
              <span>{field.placeHolder || "Select an option..."}</span>
              <span className="text-xs">▼</span>
            </div>
          )}
          {field.type === "yes_no" && (
            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-5 bg-border/60 rounded-full p-0.5 flex items-center shadow-inner">
                <div className="w-4 h-4 bg-background rounded-full shadow-sm" />
              </div>
              <span className="text-sm text-muted-foreground">Off</span>
            </div>
          )}
          {field.type === "file" && (
            <div className="h-24 w-full border-2 border-dashed border-border/60 rounded-lg bg-background/30 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2 transition-colors">
              <IconUpload className="size-5 opacity-50" />
              <span>Click to upload or drag and drop</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SortableField;