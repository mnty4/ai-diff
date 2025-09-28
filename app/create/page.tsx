"use client";

import Header from "@/app/ui/Header";
import TitleField from "@/app/ui/TitleField";
import PromptCarousel from "@/app/ui/PromptCarousel";

type FormState = {
  title: string;
  prompts: string[];
};

export default function CreatePage() {
  const prompts = ["Hello", "World", "This is a prompt.", "beep boop."];
  // const prompts = ["hello", "asf"];

  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center h-16"}>
        <Header />
      </div>
      <form
        className={"flex flex-col justify-center items-center gap-4"}
        onSubmit={(e) => e.preventDefault()}
      >
        <TitleField />
        {/*<div className={"flex gap-4 px-4 w-full overflow-x-auto"}>*/}
        <PromptCarousel prompts={prompts} />
        {/*</div>*/}
        <button
          className={
            "bg-white rounded-lg px-4 py-2 text-black flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
          }
          type="submit"
        >
          <span>Generate</span>
        </button>
        {/*<Image src={rightArrow} alt={"Right arrow."} width={64} height={64} />*/}
      </form>
    </main>
  );
}
