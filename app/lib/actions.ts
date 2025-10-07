"use server";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | undefined;

if (typeof window === "undefined") {
  ai = new GoogleGenAI({});
}

export async function generate(prompt: string) {
  if (!ai) {
    throw new Error("Server-only code");
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "text/plain",
    },
  });

  return response.text || "";
}
