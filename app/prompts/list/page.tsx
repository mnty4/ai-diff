import Header from "@/app/ui/header";
import { PromptListItem } from "@/app/lib/definitions";
import { fetchPromptsFromDB } from "@/app/lib/actions";
import PromptList from "@/app/ui/prompt-list";

export default async function PromptListPage() {
  return (
    <main className={"h-full w-full flex flex-col gap-4 items-center"}>
      <div className={"flex justify-center items-center p-4"}>
        <Header />
      </div>
      <div
        className={
          "flex flex-col gap-4 items-center overflow-y-scroll md:w-2/3 p-8 md:p-12"
        }
      >
        <PromptList />
      </div>
    </main>
  );
}
