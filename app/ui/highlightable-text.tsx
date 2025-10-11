import { Dispatch, SetStateAction } from "react";

export type TextSelection = {
  start: number; // index in string
  end: number; // index in string
  text: string;
};

export default function HighlightableText({
  text,
  selection,
  setSelection,
}: {
  text: string;
  selection: TextSelection | null;
  setSelection: Dispatch<SetStateAction<TextSelection | null>>;
}) {
  const adjustSelection = (side: "left" | "right", e: React.DragEvent) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    // compute character position from mouse X
    const ratio = (e.clientX - rect.left) / rect.width;
    const charIndex = Math.round(ratio * text.length);

    setSelection((prev) =>
      prev
        ? {
            ...prev,
            start:
              side === "left" ? Math.min(charIndex, prev.end - 1) : prev.start,
            end:
              side === "right" ? Math.max(charIndex, prev.start + 1) : prev.end,
            text: text.slice(
              side === "left" ? Math.min(charIndex, prev.end - 1) : prev.start,
              side === "right" ? Math.max(charIndex, prev.start + 1) : prev.end,
            ),
          }
        : prev,
    );
  };

  if (!selection) return <span>{text}</span>;

  return (
    <>
      <span>{text.slice(0, selection.start)}</span>
      <span className="bg-yellow-300 relative">
        {text.slice(selection.start, selection.end)}
        {/* draggable handles */}
        <span
          className="absolute left-0 top-0 w-2 h-full bg-blue-500 cursor-ew-resize"
          draggable
          onDrag={(e) => adjustSelection("left", e)}
        />
        <span
          className="absolute right-0 top-0 w-2 h-full bg-blue-500 cursor-ew-resize"
          draggable
          onDrag={(e) => adjustSelection("right", e)}
        />
      </span>
      <span>{text.slice(selection.end)}</span>
    </>
  );
}
