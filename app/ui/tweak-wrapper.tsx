import TweakModal from "@/app/ui/tweak-modal";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";

export default function TweakWrapper({
  tweak,
  onChange,
  handleSubmit,
  showTweakModal,
  setShowTweakModal,
}: {
  tweak: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: () => void;
  showTweakModal: boolean;
  setShowTweakModal: Dispatch<SetStateAction<boolean>>;
}) {
  const tweakButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {showTweakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TweakModal
              setShowTweakModal={setShowTweakModal}
              value={tweak}
              onChange={onChange}
              handleSubmit={handleSubmit}
              tweakButtonRef={tweakButtonRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={tweakButtonRef}
        id="tweak-btn"
        className={clsx([
          "rounded-lg px-4 py-2 flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer",
          showTweakModal ? "bg-white text-black" : "bg-purple-600 text-white",
        ])}
        type="button"
        onClick={() => {
          setShowTweakModal(!showTweakModal);
        }}
      >
        Tweak
      </button>
    </div>
  );
}
