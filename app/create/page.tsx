import Header from "@/app/ui/Header";
import PromptForm from "@/app/ui/prompt-form";

export default async function CreatePage() {
  const prompt = {
    id: crypto.randomUUID(),
    title: "New Prompt",
    prompt: "",
    versions: [],
  };
  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center h-16"}>
        <Header />
      </div>
      <PromptForm initialPrompt={prompt} />
    </main>
  );
}
