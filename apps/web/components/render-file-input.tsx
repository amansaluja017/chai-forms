import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export default function renderFieldInput(field: any, value: string, onChange: (val: string) => void) {
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

    case "yes_no":
      return (
        <RadioGroup value={value} onValueChange={onChange} className="flex space-x-6 mt-2">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="true" id={`yes-${field.id}`} className="h-5 w-5" />
            <Label htmlFor={`yes-${field.id}`} className="text-base cursor-pointer font-normal">
              True
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="false" id={`no-${field.id}`} className="h-5 w-5" />
            <Label htmlFor={`no-${field.id}`} className="text-base cursor-pointer font-normal">
              False
            </Label>
          </div>
        </RadioGroup>
      );

    case "file":
      return (
        <div className="relative">
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // In a real app this would upload to S3 and save the URL. 
                // For now, we save the filename to satisfy the required field check.
                onChange(file.name);
              } else {
                onChange("");
              }
            }}
            className="text-lg py-3 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>
      );

    default:
      return <p className="text-sm text-red-500 text-center py-4">Unsupported field type: {field.type}</p>;
  }
}
