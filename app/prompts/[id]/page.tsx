import Header from "@/app/ui/header";
import PromptForm from "@/app/ui/prompt-form";
import { generate, savePromptToDB } from "@/app/lib/actions";
import { Prompt } from "@/app/lib/definitions";
import { fetchPromptFromDB } from "@/app/lib/data";

export default async function PromptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const id = (await params).id;
  const mode = (await searchParams).mode;
  let prompt: Prompt = {
    id,
    title: "New Prompt",
    prompt: "",
    versions: [],
    tweak: "",
    isDirty: false,
  };
  if (mode === "edit") {
    const fetchedPrompt = await fetchPromptFromDB(id);
    if (fetchedPrompt) {
      prompt = fetchedPrompt;
    }
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 6000);
    });
  }

  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center p-4"}>
        <Header />
      </div>
      <PromptForm
        initialPrompt={prompt}
        generateAction={generate}
        savePromptToDBAction={savePromptToDB}
      />
    </main>
  );
}
