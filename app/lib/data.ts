import {
  Prompt,
  PromptDTO,
  PromptListItem,
  VersionDTO,
} from "@/app/lib/definitions";
import postgres from "postgres";
import { mapPromptDTOToPrompt } from "@/app/lib/mappers";

const sql = postgres(process.env.POSTGRES_URL!, {});

export const fetchPromptsFromDB = async (): Promise<PromptListItem[]> => {
  console.log("Fetching prompts");
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
  const rows =
    await sql`SELECT id, title, prompt FROM prompts ORDER BY updated_at DESC`;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    prompt: row.prompt,
  }));
};

export async function fetchPromptFromDB(id: string): Promise<Prompt | null> {
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
    return mapPromptDTOToPrompt(promptDTO);
  } catch (e) {
    console.error(e);
    return null;
  }
}
