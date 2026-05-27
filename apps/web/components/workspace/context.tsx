"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FormFieldType } from "@repo/services/form/model";

interface FormBuilderContextType {
  fields: FormFieldType[];
  setFields: React.Dispatch<React.SetStateAction<FormFieldType[]>>;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  addField: (field: FormFieldType) => void;
  updateField: (id: string, updates: Partial<FormFieldType>) => void;
  deleteField: (id: string) => void;
  reorderFields: (activeId: string, overId: string) => number | null;
  formId: string;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export const FormBuilderProvider = ({ 
  children, 
  initialFields = [],
  formId
}: { 
  children: ReactNode; 
  initialFields?: FormFieldType[];
  formId: string;
}) => {
  const [fields, setFields] = useState<FormFieldType[]>(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const addField = (field: FormFieldType) => {
    setFields((prev) => [...prev, field]);
    setSelectedFieldId(field.id || null);
  };

  const updateField = (id: string, updates: Partial<FormFieldType>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const reorderFields = (activeId: string, overId: string): number | null => {
    const oldIndex = fields.findIndex((f) => f.id === activeId);
    const newIndex = fields.findIndex((f) => f.id === overId);
    
    if (oldIndex === -1 || newIndex === -1) return null;

    const newFields = [...fields];
    const [movedItem] = newFields.splice(oldIndex, 1);
    
    if (!movedItem) return null;

    newFields.splice(newIndex, 0, movedItem);

    const prevItem = newFields[newIndex - 1];
    const nextItem = newFields[newIndex + 1];

    let newOrderIndex = 0;
    if (prevItem && nextItem) {
      newOrderIndex = (prevItem.orderIndex + nextItem.orderIndex) / 2;
    } else if (prevItem) {
      newOrderIndex = prevItem.orderIndex + 1;
    } else if (nextItem) {
      newOrderIndex = nextItem.orderIndex - 1;
    }

    newFields[newIndex] = { ...movedItem, orderIndex: newOrderIndex };
    setFields(newFields);

    return newOrderIndex;
  };

  return (
    <FormBuilderContext.Provider
      value={{
        fields,
        setFields,
        selectedFieldId,
        setSelectedFieldId,
        addField,
        updateField,
        deleteField,
        reorderFields,
        formId
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};
