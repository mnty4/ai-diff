import Link from "next/link";
import clsx from "clsx";
import { truncate } from "@/app/lib/utils";
import PromptDeleteButton from "@/app/ui/prompt-delete-button";
import * as motion from "motion/react-client";
import { PromptListItem } from "@/app/lib/definitions";

export default function PromptListItemCard({
  prompt,
  ref,
}: {
  prompt: PromptListItem;
  ref?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <motion.div
      ref={ref}
      // key={prompt.id}
      className="w-full"
      layout
      transition={{ duration: 0.25 }}
    >
      <Link
        className={clsx([
          "flex justify-between items-center bg-gray-900 p-4 rounded-lg text-white",
          "hover:scale-110 duration-200 ease-in-out",
        ])}
        href={`/prompts/${prompt.id}?mode=edit`}
      >
        <div className={"flex flex-col gap-2"}>
          <h2 className={"text-xl"}>{truncate(prompt.title, 50)}</h2>
          <span className={"text-sm"}>{truncate(prompt.prompt, 200)}</span>
        </div>
        <PromptDeleteButton id={prompt.id} />
      </Link>
    </motion.div>
  );
}
