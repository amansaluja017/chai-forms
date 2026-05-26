"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useFormBuilder } from "./workspace/context";
import { FormFieldType } from "@repo/services/form/model";
import { IconTypography, IconNumber123, IconMail, IconPhone, IconMapPin, IconCheckbox, IconCircleDot, IconUpload, IconToggleLeft, IconCalendar, IconClock, IconForms } from "@tabler/icons-react";
import { useCreateFormField, useReorderFormFields } from "~/hooks/api/form/form.hook";
import { toast } from "sonner";

const getIconForType = (type: string) => {
  // ... existing getIconForType ...
  switch (type) {
    case "text": return IconTypography;
    case "number": return IconNumber123;
    case "email": return IconMail;
    case "phone": return IconPhone;
    case "address": return IconMapPin;
    case "checkbox": return IconCheckbox;
    case "radio": return IconCircleDot;
    case "file": return IconUpload;
    case "yes_no": return IconToggleLeft;
    case "date": return IconCalendar;
    case "time": return IconClock;
    case "dropdown": return IconForms;
    default: return IconTypography;
  }
};

export function BuilderDndContext({ children }: { children: React.ReactNode }) {
  const { fields, addField, reorderFields, formId } = useFormBuilder();
  const { createFieldAsync } = useCreateFormField();
  const { reorderFieldsAsync } = useReorderFormFields();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"ToolboxItem" | "Field" | null>(null);
  const [activeItemData, setActiveItemData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveType(event.active.data.current?.type);
    setActiveItemData(event.active.data.current);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    setActiveItemData(null);

    if (!over) return;

    if (active.data.current?.type === "ToolboxItem") {
      if (over.id === "canvas" || fields.find(f => f.id === over.id)) {
        const fieldType = active.data.current?.fieldType as FormFieldType["type"];

        let newOrderIndex = 0;
        if (fields.length > 0) {
          const overIndex = fields.findIndex(f => f.id === over.id);
          if (overIndex !== -1) {
            const overItem = fields[overIndex]!;
            const nextItem = fields[overIndex + 1];
            if (nextItem) {
              newOrderIndex = (overItem.orderIndex + nextItem.orderIndex) / 2;
            } else {
              newOrderIndex = overItem.orderIndex + 1;
            }
          } else {
            newOrderIndex = Math.max(...fields.map(f => f.orderIndex)) + 1;
          }
        }

        const newField: FormFieldType = {
          id: crypto.randomUUID(), // Add temporary ID so dnd-kit doesn't get stuck
          formId,
          label: `New ${fieldType}`,
          type: fieldType,
          isRequired: false,
          orderIndex: newOrderIndex,
          labelKey: `field_${Date.now()}`
        };

        // Optimistic UI update
        addField(newField);

        try {
          await createFieldAsync(newField);
        } catch (error) {
          toast.error("Failed to save new field to database.");
        }
      }
    } else if (active.data.current?.type === "Field") {
      if (active.id !== over.id) {
        // Optimistic local reorder with fractional indexing
        const newOrderIndex = reorderFields(active.id as string, over.id as string);

        if (newOrderIndex !== null) {
          try {
            // O(1) DB update
            await reorderFieldsAsync({
              formId,
              orders: [{ id: active.id as string, orderIndex: newOrderIndex }]
            });
          } catch (error) {
            toast.error("Failed to sync field order.");
          }
        }
      }
    }
  };

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.4",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeId ? (
          activeType === "ToolboxItem" ? (
            <div className="flex items-center gap-3 p-3 rounded-md border bg-card shadow-xl opacity-80 scale-105">
              {React.createElement(getIconForType(activeItemData?.fieldType), { className: "size-5 text-muted-foreground" })}
              <span className="text-sm font-medium">New Field</span>
            </div>
          ) : (
            <div className="p-4 border rounded-lg bg-card shadow-2xl opacity-90 scale-105 ring-2 ring-primary">
              <span className="font-semibold">{activeItemData?.field?.label}</span>
            </div>
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
