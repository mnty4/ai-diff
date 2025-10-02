"use server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export type response = {
  html: string;
  plainText: string;
};

export async function generate(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "text/plain",
    },
  });

  return response.text || "";
}
