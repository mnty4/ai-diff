import Header from "@/app/ui/Header";
import PromptForm from "@/app/ui/prompt-form";
import { fetchPromptFromDb } from "@/app/lib/actions";

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  let prompt = await fetchPromptFromDb(id);
  if (!prompt) {
    prompt = {
      id,
      title: "New Prompt",
      prompt: "",
      versions: [],
      tweak: "",
      isDirty: false,
      deletedVersionIds: [],
    };
  }
  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center h-16"}>
        <Header />
      </div>
      <PromptForm initialPrompt={prompt} />
    </main>
  );
}
