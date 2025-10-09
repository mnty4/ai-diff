import Header from "@/app/ui/Header";
import PromptForm from "@/app/ui/prompt-form";

export default async function CreatePage() {
  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center h-16"}>
        <Header />
      </div>
      <PromptForm />
    </main>
  );
}
