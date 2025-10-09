"use server";
import { GoogleGenAI } from "@google/genai";
import { Prompt } from "@/app/lib/definitions";
import process from "node:process";
import postgres from "postgres";

let ai: GoogleGenAI | undefined;

const sql = postgres(process.env.POSTGRES_URL!);

async function testConnection() {
  try {
    const result = await sql`SELECT 1 as connected`;
    console.log("✅ Database connection successful:", result[0]);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  } finally {
    await sql.end({ timeout: 1 });
  }
}

testConnection();

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
