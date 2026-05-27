import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


export async function generateFormFieldsSchema(prompt: string, existingContext?: string) {
  const systemPrompt = `You are an expert form builder AI. Your task is to process a user prompt and generate or modify form fields and details.
You must return a structured JSON object containing the form modifications.

The JSON object MUST exactly match this structure:
{
  "title": "string (The updated form title, if applicable)",
  "description": "string (The updated form description, if applicable)",
  "fieldsToCreate": [
    {
      "label": "string",
      "type": "text" | "number" | "email" | "phone" | "address" | "checkbox" | "radio" | "file" | "yes_no" | "date" | "datetime" | "time" | "dropdown",
      "isRequired": boolean,
      "description": "string",
      "placeHolder": "string",
      "options": [ { "label": "string", "value": "string" } ]
    }
  ],
  "fieldsToUpdate": [
    {
      "id": "string (Must be the exact ID of the existing field)",
      "label": "string",
      "type": "text" | "number" | "email" | "phone" | "address" | "checkbox" | "radio" | "file" | "yes_no" | "date" | "datetime" | "time" | "dropdown",
      "isRequired": boolean,
      "description": "string",
      "placeHolder": "string",
      "options": [ { "label": "string", "value": "string" } ]
    }
  ],
  "fieldsToDelete": [
    "string (The ID of the field to delete)"
  ]
}

If you are modifying an existing form, the existing form state will be provided in the Existing Context.
Use the existing context to determine the IDs of fields you want to update or delete.
If you only need to add fields, put them in fieldsToCreate and leave others empty.
If the prompt implies a brand new form generation, just use fieldsToCreate and update the title and description.

Ensure the output is a valid JSON object. Do not wrap in \`\`\`json or \`\`\`.`;

  const contents = existingContext 
    ? `${systemPrompt}\n\nExisting Context:\n${existingContext}\n\nUser Prompt:\n${prompt}`
    : `${systemPrompt}\n\nUser Prompt:\n${prompt}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate form schema");
  }

  return JSON.parse(response.text);
}
