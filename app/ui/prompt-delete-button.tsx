"use client";
import trashCanIcon from "@/public/trash-can.svg";
import Image from "next/image";
import clsx from "clsx";
import { deletePromptFromDB } from "@/app/lib/actions";
import { startTransition, useActionState } from "react";
import { Loader2 } from "lucide-react";

export default function PromptDeleteButton({ id }: { id: string }) {
  const [_, action, pending] = useActionState(
    deletePromptFromDB.bind(null, id),
    null,
  );
  return (
    <button
      className={"flex-shrink-0 cursor-pointer"}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(action);
      }}
    >
      {pending ? (
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      ) : (
        <div
          className={clsx([
            "p-2 rounded-full bg-red-500",
            "hover:scale-110 duration-200 ease-in-out",
          ])}
        >
          <Image
            src={trashCanIcon}
            alt={"Delete Icon."}
            width={24}
            height={24}
          />
        </div>
      )}
    </button>
  );
}
