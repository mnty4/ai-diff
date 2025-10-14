"use client";

import Header from "@/app/ui/header";
import PromptFieldSkeleton from "@/app/ui/prompt-field-skeleton";

export default function Loading() {
  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center p-4"}>
        <Header />
      </div>
      <form className={"flex flex-col justify-center items-center gap-4"}>
        {/* Title skeleton */}
        <div className="h-7 bg-gray-800 w-48 rounded-lg animate-pulse" />

        {/* Prompt field skeleton */}
        <div className={"w-4/5 "}>
          <div className="mx-6 flex flex-col justify-center items-center">
            <div className="h-[60vh] w-full md:w-1/2">
              <PromptFieldSkeleton />
            </div>
          </div>
        </div>
        {/* Generate button skeleton */}
        <div className="w-32 h-10 bg-gray-800 rounded-lg animate-pulse" />
      </form>
    </main>
  );
}
