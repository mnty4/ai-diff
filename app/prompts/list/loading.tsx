import Header from "@/app/ui/header";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

function PromptListItemSkeleton() {
  return (
    <motion.div
      className="w-full bg-gray-800 rounded-lg p-4 animate-pulse"
      layout
      transition={{ duration: 0.25 }}
    >
      <div className="h-7 bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-5 bg-gray-600 rounded w-full"></div>
    </motion.div>
  );
}

export default function Loading() {
  // Number of skeleton items to render
  const skeletons = Array.from({ length: 5 });

  return (
    <main className="h-full w-full flex flex-col gap-4 items-center">
      {/* Header */}
      <div className="flex justify-center items-center p-4">
        <Header />
      </div>

      {/* Skeleton list */}
      <div className="flex flex-col gap-4 items-center overflow-y-scroll md:w-2/3 p-8 md:p-12">
        <AnimatePresence>
          {skeletons.map((_, i) => (
            <PromptListItemSkeleton key={i} />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
