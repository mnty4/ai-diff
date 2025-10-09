import clsx from "clsx";
import {
  ChangeEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

export default function TweakModal({
  setShowTweakModal,
  handleSubmit,
  value,
  onChange,
  tweakButtonRef,
}: {
  setShowTweakModal: (showTweakModal: boolean) => void;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: () => void;
  tweakButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const focusTextarea = useCallback(() => {
    const el = textAreaRef.current;
    if (!el) return;
    el.focus();
    const len = value.length;
    el.setSelectionRange(len, len);
  }, [value.length]);

  useEffect(() => {
    focusTextarea();
  }, [focusTextarea]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        tweakButtonRef?.current &&
        !tweakButtonRef.current.contains(target)
      ) {
        setShowTweakModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowTweakModal, tweakButtonRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd (Mac) or Ctrl (Windows) + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      data-testid="tweak-modal"
      ref={modalRef}
      className={clsx([
        "absolute bottom-full left-1/2 -translate-x-1/2 ",
        "mb-6 bg-black rounded-xl w-96 h-64 p-4",
        "transition-opacity duration-150 ease-in",
        "flex flex-col gap-4",
      ])}
    >
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0
                      border-l-16 border-r-16 border-t-16 border-l-transparent border-r-transparent border-t-black"
      />

      <textarea
        data-testid="tweak-modal-textarea"
        ref={textAreaRef}
        className={
          "flex-grow border-none outline-none resize-none bg-transparent"
        }
        onChange={onChange}
        value={value}
        onKeyDown={handleKeyDown}
        placeholder={"Make it shorter..."}
      />
      <button
        data-testid="tweak-submit-btn"
        className={
          "self-center text-sm bg-purple-600 rounded-lg px-4 py-2 text-white flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
        }
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowTweakModal(false);
          handleSubmit();
        }}
      >
        Submit
      </button>
    </div>
  );
}
