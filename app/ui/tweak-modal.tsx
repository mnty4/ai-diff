import clsx from "clsx";
import {
  ChangeEventHandler,
  MouseEventHandler,
  RefObject,
  useEffect,
  useRef,
} from "react";

export default function TweakModal({
  showTweakModal,
  setShowTweakModal,
  handleSubmit,
  value,
  onChange,
  tweakButtonRef,
}: {
  showTweakModal: boolean;
  setShowTweakModal: (showTweakModal: boolean) => void;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
  tweakButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
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
  return (
    <div
      ref={modalRef}
      className={clsx([
        "absolute bottom-full left-1/2 -translate-x-1/2 ",
        "mb-6 bg-black rounded-xl w-96 h-64 p-4",
        "transition-opacity duration-150 ease-in",
        "flex flex-col gap-4",
        showTweakModal ? "" : "opacity-0 pointer-events-none",
      ])}
    >
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0
                      border-l-16 border-r-16 border-t-16 border-l-transparent border-r-transparent border-t-black"
      />

      <textarea
        className={
          "flex-grow border-none outline-none resize-none bg-transparent"
        }
        onChange={onChange}
        value={value}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit}
      />
      <button
        id="tweak-submit-btn"
        className={
          "self-center text-sm bg-purple-600 rounded-lg px-4 py-2 text-white flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
        }
        type="button"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
