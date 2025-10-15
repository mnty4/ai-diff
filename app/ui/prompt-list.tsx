"use client";

import { PromptListItem } from "@/app/lib/definitions";
import { fetchPromptsFromDB } from "@/app/lib/actions";
import { AnimatePresence } from "motion/react";
import PromptListItemCard from "@/app/ui/prompt-list-item-card";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";

export default function PromptList() {
  // const prompts: PromptListItem[] = await fetchPromptsFromDB(30);

  const [prompts, setPrompts] = useState<PromptListItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageSize = 10;

  const loadPrompts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const promptListItems = await fetchPromptsFromDB(pageSize, page);
    setPrompts((prev) => [...prev, ...promptListItems]);
    setHasMore(promptListItems.length === pageSize);
    setLoading(false);
  }, [hasMore, loading, page]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // await new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 6000);
  // });
  return (
    <AnimatePresence>
      {prompts.map((prompt, i) => {
        if (i === prompts.length - 1) {
          return (
            <PromptListItemCard
              ref={lastItemRef}
              prompt={prompt}
              key={prompt.id}
            />
          );
        }
        return <PromptListItemCard prompt={prompt} key={prompt.id} />;
      })}
    </AnimatePresence>
  );
}
