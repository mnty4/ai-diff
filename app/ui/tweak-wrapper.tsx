import TweakModal from "@/app/ui/tweak-modal";
import clsx from "clsx";
import { ChangeEventHandler, MouseEventHandler, useRef, useState } from "react";

export default function TweakWrapper({
  tweak,
  onChange,
  handleSubmit,
}: {
  tweak: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: () => void;
}) {
  const [showTweakModal, setShowTweakModal] = useState(false);
  const tweakButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative inline-block">
      <TweakModal
        setShowTweakModal={setShowTweakModal}
        showTweakModal={showTweakModal}
        value={tweak}
        onChange={onChange}
        handleSubmit={() => {
          setShowTweakModal(false);
          handleSubmit();
        }}
        tweakButtonRef={tweakButtonRef}
      />

      <button
        ref={tweakButtonRef}
        id="tweak-btn"
        className={clsx([
          "rounded-lg px-4 py-2 flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer",
          showTweakModal ? "bg-white text-black" : "bg-purple-600 text-white",
        ])}
        type="button"
        onClick={() => setShowTweakModal(!showTweakModal)}
      >
        Tweak
      </button>
    </div>
  );
}
