"use server";
import "server-only";
import { GoogleGenAI } from "@google/genai";
import { Prompt, PromptDTO, VersionDTO } from "@/app/lib/definitions";
import process from "node:process";
import postgres from "postgres";
import { mapPromptDTOToPrompt } from "@/app/lib/mappers";

let ai: GoogleGenAI | undefined;

const sql = postgres(process.env.POSTGRES_URL!, { debug: true, max: 10 });

async function testConnection() {
  try {
    const result = await sql`SELECT 1 as connected`;
    console.log("✅ Database connection successful:", result[0]);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
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

export async function fetchPromptFromDb(id: string): Promise<Prompt | null> {
  console.log("executing fetchPromptFromDb...");
  try {
    const promptRows =
      await sql`SELECT p.title, p.prompt, p.tweak FROM prompts p WHERE p.id=${id}`;

    if (promptRows.length === 0) {
      return null;
    }
    const promptRow = promptRows[0];
    const versionRows =
      await sql`SELECT v.id, v.text FROM versions v WHERE v.prompt_id=${id}`;

    const versions: VersionDTO[] = versionRows.map((v) => ({
      id: v.id,
      text: v.text,
    }));

    const promptDTO: PromptDTO = {
      id,
      title: promptRow.title,
      prompt: promptRow.prompt,
      tweak: promptRow.tweak,
      versions: versions,
    };
    console.log(promptDTO);
    return mapPromptDTOToPrompt(promptDTO);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function savePromptToDb(prompt: Prompt) {
  console.log(prompt);
  try {
    const now = new Date();
    await sql.begin(async (tx) => {
      if (prompt.isDirty) {
        await tx`
          INSERT INTO prompts (id, title, prompt, tweak, created_at, updated_at) 
          VALUES (${prompt.id}, ${prompt.title}, ${prompt.prompt}, ${prompt.tweak}, ${now}, ${now})
          ON CONFLICT (id) DO UPDATE 
          SET title = EXCLUDED.title,
              prompt = EXCLUDED.prompt,
              tweak = EXCLUDED.tweak,
              updated_at = EXCLUDED.updated_at`;
      }

      const versionValues = prompt.versions
        .filter((v) => v.isDirty && v.status === "ready")
        .map((v) => ({
          id: v.id,
          text: v.text,
          prompt_id: prompt.id,
          created_at: now,
          updated_at: now,
        }));
      if (versionValues.length > 0) {
        await tx`
          INSERT INTO versions ${sql(versionValues, "id", "prompt_id", "text", "updated_at", "created_at")}
          ON CONFLICT (id) DO UPDATE
          SET text = EXCLUDED.text,
              updated_at = EXCLUDED.updated_at
      `;
      }

      //       await tx`
      //     INSERT INTO versions (id, prompt_id, text, updated_at)
      //     VALUES ${sql.join(versionValues, `, `)}
      //     ON CONFLICT (id) DO UPDATE
      //     SET text = EXCLUDED.text,
      //         updated_at = EXCLUDED.updated_at
      // `;
    });
    console.log("markSaved...");
  } catch (err) {
    console.error(err);
  }
}
