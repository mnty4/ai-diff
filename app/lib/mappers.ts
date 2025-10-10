import { PromptDTO } from "@/app/lib/definitions";
import { Prompt } from "@/app/lib/definitions";

export function mapPromptDTOToPrompt(promptDTO: PromptDTO): Prompt {
  return {
    id: promptDTO.id,
    title: promptDTO.title,
    prompt: promptDTO.prompt,
    tweak: promptDTO.tweak,
    versions: promptDTO.versions.map((v) => ({
      id: v.id,
      text: v.text,
      status: "ready",
    })),
    isDirty: false,
    deletedVersionIds: [],
  };
}
