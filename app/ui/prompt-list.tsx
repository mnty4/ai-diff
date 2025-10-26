"use client";

import { PromptListItem } from "@/app/lib/definitions";
import Link from "next/link";
import clsx from "clsx";
import { truncate } from "@/app/lib/utils";
import PromptDeleteButton from "@/app/ui/prompt-delete-button";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import Pagination from "@/app/ui/Pagination";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

const PAGE_SIZE = 20;

export default function PromptList({
  initialPrompts,
}: {
  initialPrompts: PromptListItem[];
}) {
  const fetchPage = async (page: number) => {
    const res = await fetch(`/api/prompts?page=${page}&pageSize=${PAGE_SIZE}`);
    return res.json() as Promise<PromptListItem[]>;
  };
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={
        "flex flex-col gap-4 items-center overflow-y-scroll md:w-2/3 p-8 md:p-12"
      }
    >
      <AnimatePresence>
        <Pagination<PromptListItem>
          scrollContainerRef={ref}
          fetchPage={fetchPage}
          pageSize={PAGE_SIZE}
          initialItems={initialPrompts}
          loader={<Loader2 className="h-6 w-6 animate-spin text-white" />}
          renderItem={(prompt: PromptListItem) => (
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
          )}
        />
      </AnimatePresence>
    </div>
  );
}
