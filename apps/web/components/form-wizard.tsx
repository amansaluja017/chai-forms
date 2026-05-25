"use client";

import { useState } from "react";
import { FormWorkspaceOutputType } from "@repo/services/form/model";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useSubmitFormResponse } from "~/hooks/api/form/form.hook";
import { toast } from "sonner";
import { IconCheck, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

export function FormWizard({ form, isPreview = false }: { form: FormWorkspaceOutputType, isPreview?: boolean }) {
  const fields = form.fields || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMockSubmitting, setIsMockSubmitting] = useState(false);
  
  const { submitResponseAsync, isPending } = useSubmitFormResponse();

  const isFormPending = isPending || isMockSubmitting;

  if (fields.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          This form has no fields.
        </CardContent>
      </Card>
    );
  }

  const currentField = fields[currentStep];
  if (!currentField) return null;

  const isLastStep = currentStep === fields.length - 1;
  const progress = ((currentStep) / fields.length) * 100;

  const handleNext = async () => {
    // Validate current field
    if (currentField.isRequired && !responses[currentField.id!]) {
      toast.error("This field is required");
      return;
    }

    if (isLastStep) {
      if (isPreview) {
        setIsMockSubmitting(true);
        setTimeout(() => {
          setIsMockSubmitting(false);
          setIsSubmitted(true);
        }, 1000);
        return;
      }

      // Submit
      try {
        const payload = Object.entries(responses).map(([formFieldId, value]) => ({
          formFieldId,
          value
        }));

        await submitResponseAsync({
          formId: form.id,
          response: payload
        });
        
        setIsSubmitted(true);
      } catch (error) {
        toast.error("Failed to submit response. Please try again.");
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const setResponse = (val: string) => {
    setResponses(prev => ({ ...prev, [currentField.id!]: val }));
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
        <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
            <IconCheck className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Thank You!</h2>
          <p className="text-green-600/80 dark:text-green-400/80">Your response has been recorded successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentStep + 1} of {fields.length}</span>
          <span>{Math.round(progress)}% completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg border-muted">
        <CardContent className="pt-8 pb-8 px-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-medium">
              {currentField.label} {currentField.isRequired && <span className="text-red-500">*</span>}
            </h2>
            {currentField.description && (
              <p className="text-muted-foreground text-sm">{currentField.description}</p>
            )}
          </div>

          <div className="pt-4">
            {renderFieldInput(currentField, responses[currentField.id!] || "", setResponse)}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={currentStep === 0 || isFormPending}
          className="gap-2"
        >
          <IconChevronLeft className="size-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isFormPending}
          className="gap-2"
        >
          {isLastStep ? "Submit" : "Next"}
          {!isLastStep && <IconChevronRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

function renderFieldInput(field: any, value: string, onChange: (val: string) => void) {
  switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "number":
    case "date":
    case "time":
      return (
        <Input
          type={field.type === "text" ? "text" : field.type}
          placeholder={field.placeHolder || "Your answer..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-lg py-6"
        />
      );
    
    case "address":
      return (
        <Textarea
          placeholder={field.placeHolder || "Your address..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-lg min-h-[100px]"
        />
      );

    case "radio":
      return (
        <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
          {field.options?.map((opt: any) => (
            <div key={opt.id} className="flex items-center space-x-3">
              <RadioGroupItem value={opt.value} id={`opt-${opt.id}`} className="h-5 w-5" />
              <Label htmlFor={`opt-${opt.id}`} className="text-base cursor-pointer font-normal">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    
    case "checkbox":
      // For simple single checkbox we'll just store "true"/"false"
      // If it's multiple options, we need a different approach. The current schema has options for checkbox.
      if (field.options && field.options.length > 0) {
        const currentVals = value ? value.split(",") : [];
        return (
          <div className="space-y-3">
            {field.options.map((opt: any) => {
              const isChecked = currentVals.includes(opt.value);
              return (
                <div key={opt.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`opt-${opt.id}`} 
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange([...currentVals, opt.value].join(","));
                      } else {
                        onChange(currentVals.filter(v => v !== opt.value).join(","));
                      }
                    }}
                    className="h-5 w-5"
                  />
                  <Label htmlFor={`opt-${opt.id}`} className="text-base cursor-pointer font-normal">
                    {opt.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      }
      return (
        <div className="flex items-center space-x-3">
          <Checkbox 
            id={`chk-${field.id}`} 
            checked={value === "true"}
            onCheckedChange={(c) => onChange(c ? "true" : "false")}
            className="h-5 w-5"
          />
          <Label htmlFor={`chk-${field.id}`} className="text-base cursor-pointer font-normal">
            Yes
          </Label>
        </div>
      );

    case "dropdown":
      return (
        <select 
          className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>Select an option...</option>
          {field.options?.map((opt: any) => (
            <option key={opt.id} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    default:
      return <p className="text-sm text-red-500 text-center py-4">Unsupported field type: {field.type}</p>;
  }
}
