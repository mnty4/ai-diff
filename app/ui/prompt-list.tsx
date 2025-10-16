import Header from "@/app/ui/header";
import { PromptListItem } from "@/app/lib/definitions";
import Link from "next/link";
import clsx from "clsx";
import { truncate } from "@/app/lib/utils";
import PromptDeleteButton from "@/app/ui/prompt-delete-button";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

export default async function PromptList({
  prompts,
}: {
  prompts: PromptListItem[];
}) {
  return (
    <AnimatePresence>
      {prompts
        .sort((a, b) => {
          if (a.updatedAt < b.updatedAt) {
            return 1;
          }
          if (a.updatedAt > b.updatedAt) {
            return -1;
          }
          return 0;
        })
        .map((prompt) => (
          <motion.div
            key={prompt.id}
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
                <span className={"text-sm"}>
                  {truncate(prompt.prompt, 200)}
                </span>
              </div>
              <PromptDeleteButton id={prompt.id} />
            </Link>
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
