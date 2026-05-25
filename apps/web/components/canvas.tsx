"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormBuilder } from "../app/(protected)/dashboard/forms/[id]/workspace/context";
import { FormFieldType } from "@repo/services/form/model";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
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
      className={`relative p-4 mb-3 border rounded-lg bg-card shadow-sm transition-colors cursor-pointer group
        ${isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"}
        ${isDragging ? "opacity-50" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedFieldId(field.id!);
      }}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1" {...attributes} {...listeners}>
        <IconGripVertical className="size-4 text-muted-foreground" />
      </div>

      <div className="pl-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-semibold">{field.label}</span>
            {field.isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <IconTrash className="size-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1 capitalize">{field.type.replace("_", " ")}</div>

        {/* Simple preview of the field */}
        <div className="mt-3 opacity-70 pointer-events-none">
          {["text", "email", "number", "phone"].includes(field.type) && (
            <div className="h-10 w-full border rounded-md bg-background/50 flex items-center px-3 text-muted-foreground text-sm">
              {field.placeHolder || "..."}
            </div>
          )}
          {field.type === "dropdown" && (
            <div className="h-10 w-full border rounded-md bg-background/50 flex items-center justify-between px-3 text-muted-foreground text-sm">
              <span>{field.placeHolder || "Select an option..."}</span>
              <span className="text-xs">▼</span>
            </div>
          )}
          {/* Add more previews if needed */}
        </div>
      </div>
    </div>
  );
}

export function Canvas() {
  const { fields, setSelectedFieldId } = useFormBuilder();
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
    data: {
      type: "Canvas",
    }
  });

  const fieldIds = fields.map((f) => f.id!);

  return (
    <div
      className="flex-1 overflow-y-auto bg-muted/20 p-8 flex justify-center"
      onClick={() => setSelectedFieldId(null)}
    >
      <div
        ref={setNodeRef}
        className={`w-full max-w-2xl min-h-[600px] border-2 border-dashed rounded-xl p-6 transition-colors
          ${isOver ? "border-primary bg-primary/5" : "border-border bg-background/50"}
          ${fields.length === 0 ? "flex items-center justify-center flex-col text-muted-foreground" : ""}
        `}
      >
        {fields.length === 0 ? (
          <>
            <IconGripVertical className="size-12 mb-4 opacity-20" />
            <p>Drag and drop fields here to start building your form</p>
          </>
        ) : (
          <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
            {fields.map((field) => (
              <SortableField key={field.id} field={field} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
