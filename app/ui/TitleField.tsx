"use client";

import Image from "next/image";
import editSvg from "@/public/edit-pencil.svg";
import { Dispatch, useEffect, useRef, useState } from "react";

export default function TitleField({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (title: string) => void;
}) {
  // const titleRef = useRef<HTMLInputElement | null>(null);
  const measureTitleRef = useRef<HTMLSpanElement | null>(null);

  // base width for "New Prompt" to avoid initial resizing issues on refresh
  const [titleWidth, setTitleWidth] = useState<string>("121px");
  useEffect(() => {
    if (
      measureTitleRef.current &&
      measureTitleRef.current.offsetWidth + 8 >= 121
    ) {
      setTitleWidth(`${measureTitleRef.current.offsetWidth + 8}px`); // small padding for caret
    }
  }, [title]);

  // make enter key press to move focus to next input
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submission
      const form = e.currentTarget.form; // the enclosing form element
      if (!form) return;

      const index = Array.prototype.indexOf.call(
        form.elements,
        e.currentTarget,
      );
      const next = form.elements[index + 1] as HTMLElement | undefined;
      if (next) {
        next.focus(); // move focus to next input/button/etc
      }
    }
  }
  return (
    <label htmlFor="title" className={"flex items-center gap-2 w-fit h-fit"}>
      <div style={{ width: "20px", height: "20px" }} />
      <div className={"relative inline-block"}>
        <span
          ref={measureTitleRef}
          className="absolute invisible whitespace-pre text-xl font-semibold"
        >
          {title || " "}
        </span>
        <input
          id="title"
          value={title}
          // ref={titleRef}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: titleWidth }}
          className="text-xl font-semibold bg-transparent border-none focus:border-b"
          onKeyDown={handleKeyDown}
          maxLength={50}
          // onKeyPress={(e) =>
          //   e.key === "Enter" && titleRef.current?.blur()
          // }
        />
      </div>
      <Image
        src={editSvg}
        alt="Edit icon."
        height={20}
        width={20}
        // onClick={() => titleRef.current?.focus()}
        className="cursor-pointer"
      />
    </label>
  );
}
