import Header from "@/app/ui/header";
import PromptForm from "@/app/ui/prompt-form";
import { fetchPromptFromDB, generate, savePromptToDB } from "@/app/lib/actions";

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  let prompt = await fetchPromptFromDB(id);
  if (!prompt) {
    prompt = {
      id,
      title: "New Prompt",
      prompt: "",
      versions: [],
      tweak: "",
      isDirty: false,
    };
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
