"use client";

import { useEffect, useRef } from "react";
import { useFormBuilder } from "../app/(protected)/dashboard/forms/[id]/workspace/context";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useUpdateFormField } from "~/hooks/api/form/form.hook";
import { toast } from "sonner";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";

function SortableOption({ opt, idx, updateOption, removeOption }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opt.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 opacity-50 hover:opacity-100">
        <IconGripVertical className="size-4" />
      </div>
      <Input
        value={opt.label}
        onChange={(e) => updateOption(idx, "label", e.target.value)}
        className="h-8 flex-1"
        placeholder="Label"
      />
      <Input
        value={opt.value}
        onChange={(e) => updateOption(idx, "value", e.target.value)}
        className="h-8 flex-1"
        placeholder="Value"
      />
      <Button variant="ghost" size="icon" onClick={() => removeOption(idx)} className="h-8 w-8 text-destructive">
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
}

export function PropertiesPanel() {
  const { fields, selectedFieldId, updateField, formId } = useFormBuilder();
  const { updateFieldAsync } = useUpdateFormField();

  const selectedField = fields.find(f => f.id === selectedFieldId);
  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!selectedField) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (!selectedField.id) return;
      try {
        await updateFieldAsync({ ...selectedField, id: selectedField.id, formId });
      } catch (error) {
        toast.error("Failed to sync field properties");
      }
    }, 600);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [selectedField, updateFieldAsync, formId]);

  if (!selectedField) {
    return (
      <div className="w-80 border-l bg-background/50 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <p>Select a field on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleUpdate = (key: string, value: any) => {
    updateField(selectedField.id!, { [key]: value });
  };

  const hasOptions = ["dropdown", "radio", "checkbox"].includes(selectedField.type);

  const addOption = () => {
    const currentOptions = selectedField.options || [];
    const maxOrder = currentOptions.length > 0 ? Math.max(...currentOptions.map(o => o.orderIndex)) : -1;
    const newOption = {
      id: crypto.randomUUID(),
      label: `Option ${currentOptions.length + 1}`,
      value: `option_${currentOptions.length + 1}`,
      orderIndex: maxOrder + 1,
    };
    handleUpdate("options", [...currentOptions, newOption]);
  };

  const updateOption = (index: number, key: "label" | "value", value: string) => {
    if (!selectedField.options) return;
    const newOptions = [...selectedField.options];
    const oldOption = newOptions[index];
    if (!oldOption) return;
    newOptions[index] = {
      ...oldOption,
      label: key === "label" ? value : oldOption.label,
      value: key === "value" ? value : oldOption.value,
    };
    handleUpdate("options", newOptions);
  };

  const removeOption = (index: number) => {
    if (!selectedField.options) return;
    const newOptions = [...selectedField.options];
    newOptions.splice(index, 1);
    handleUpdate("options", newOptions);
  };

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedField.options) return;

    const oldIndex = selectedField.options.findIndex((o) => o.id === active.id);
    const newIndex = selectedField.options.findIndex((o) => o.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOptions = [...selectedField.options];
    const [movedOption] = newOptions.splice(oldIndex, 1);
    if (!movedOption) return;

    newOptions.splice(newIndex, 0, movedOption);

    const prevOption = newOptions[newIndex - 1];
    const nextOption = newOptions[newIndex + 1];

    let newOrderIndex = 0;
    if (prevOption && nextOption) {
      newOrderIndex = (prevOption.orderIndex + nextOption.orderIndex) / 2;
    } else if (prevOption) {
      newOrderIndex = prevOption.orderIndex + 1;
    } else if (nextOption) {
      newOrderIndex = nextOption.orderIndex - 1;
    }

    newOptions[newIndex] = { ...movedOption, orderIndex: newOrderIndex };
    handleUpdate("options", newOptions);
  };

  return (
    <div className="w-80 border-l bg-background/50 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b bg-card">
        <h3 className="font-semibold">Field Properties</h3>
        <p className="text-xs text-muted-foreground mt-1 capitalize">{selectedField.type.replace("_", " ")}</p>
      </div>

      <div className="p-4 space-y-6 flex-1">
        <div className="space-y-2">
          <Label htmlFor="prop-label">Label</Label>
          <Input id="prop-label" value={selectedField.label} onChange={(e) => handleUpdate("label", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prop-key">Label Key (Internal)</Label>
          <Input id="prop-key" value={selectedField.labelKey} onChange={(e) => handleUpdate("labelKey", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prop-placeholder">Placeholder</Label>
          <Input id="prop-placeholder" value={selectedField.placeHolder || ""} onChange={(e) => handleUpdate("placeHolder", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prop-description">Description / Helper Text</Label>
          <Textarea id="prop-description" value={selectedField.description || ""} onChange={(e) => handleUpdate("description", e.target.value)} className="resize-y" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="prop-required">Required Field</Label>
          <Switch id="prop-required" checked={selectedField.isRequired} onCheckedChange={(c) => handleUpdate("isRequired", c)} />
        </div>

        {hasOptions && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button variant="outline" size="sm" onClick={addOption} className="h-7 text-xs gap-1">
                <IconPlus className="size-3" /> Add
              </Button>
            </div>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOptionDragEnd}>
              <SortableContext items={(selectedField.options || []).map(o => o.id!)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {selectedField.options?.map((opt, idx) => (
                    <SortableOption key={opt.id} opt={opt} idx={idx} updateOption={updateOption} removeOption={removeOption} />
                  ))}
                  {(!selectedField.options || selectedField.options.length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-2 border border-dashed rounded">No options added yet</p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}
