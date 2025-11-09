"use client";

import TitleField from "@/app/ui/title-field";
import PromptCarousel from "@/app/ui/prompt-carousel";
import { Prompt, promptDataReducer, Version } from "@/app/lib/definitions";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import TweakWrapper from "@/app/ui/tweak-wrapper";
import clsx from "clsx";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { formatTweakPrompt, formatTweakSelection } from "@/app/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch, useAppSelector, useAppStore } from "@/app/lib/store";
import {
  branch,
  markSaved,
  setActivePrompt,
  setTitle,
  updatePromptString,
  updateTweak,
  updateVersion,
} from "@/app/lib/slices/PromptSlice";

export default function PromptForm({
  initialPrompt = {
    id: crypto.randomUUID(),
    title: "New Prompt",
    prompt: "",
    tweak: "",
    versions: [],
    isDirty: false,
  },
  generateAction,
  savePromptToDBAction,
}: {
  initialPrompt?: Prompt;
  generateAction: (text: string) => Promise<string>;
  savePromptToDBAction: (prompt: Prompt) => Promise<void>;
}) {
  // const [state, dispatch] = useReducer(promptDataReducer, initialPrompt);
  const prompt = useAppSelector((state) => state.activePrompt.entity);
  const state = prompt ?? initialPrompt;
  const dispatch = useAppDispatch();
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const isPromptSelected = selectedSlideIndex === 0;
  const [showTweakModal, setShowTweakModal] = useState(false);

  // the branch key keeps track of the most recent branch operation (delete all slides after current
  // and adds new prompt output). Necessary to refresh the hook for scrolling to end of prompt slides
  const [branchKey, setBranchKey] = useState<string>();

  const [isSaving, setIsSaving] = useState(false);
  const lastVersionId = useRef(0);

  const savePromptToDbDebounced = useDebouncedCallback(
    async (versionId: number, state: Prompt) => {
      try {
        await savePromptToDBAction(state);
      } finally {
        if (lastVersionId.current === versionId) {
          setIsSaving(false);
          dispatch(markSaved());
        }
      }
    },
    800,
  );

  useEffect(() => {
    if (!prompt || initialPrompt.id !== prompt.id) {
      dispatch(setActivePrompt(initialPrompt));
    }
  }, [dispatch, initialPrompt, prompt]);

  useEffect(() => {
    if (state.isDirty) {
      setIsSaving(true);
      const versionId = lastVersionId.current + 1;
      lastVersionId.current = versionId;
      savePromptToDbDebounced(versionId, { ...state });
    }
  }, [state, savePromptToDbDebounced]);

  const handleGenerate = useCallback(async () => {
    const dummyTweak: Version = {
      id: crypto.randomUUID(),
      text: "",
      status: "loading",
    };
    dispatch(branch({ index: 0, version: dummyTweak }));
    setBranchKey(crypto.randomUUID());
    if (!state.prompt) {
      dispatch(
        updateVersion({
          id: dummyTweak.id,
          updates: {
            ...dummyTweak,
            status: "error",
            errorMsg: "Prompt must be provided.",
          },
        }),
      );
      return;
    }
    try {
      const res = await generateAction(state.prompt);
      dispatch(
        updateVersion({
          id: dummyTweak.id,
          updates: {
            ...dummyTweak,
            status: "ready",
          },
        }),
      );
    } catch (e) {
      dispatch(
        updateVersion({
          id: dummyTweak.id,
          updates: {
            ...dummyTweak,
            status: "error",
          },
        }),
      );
    }
  }, [dispatch, generateAction, state.prompt]);

  useEffect(() => {
    const handleGlobalKeyDown = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (isPromptSelected) {
          await handleGenerate();
        } else {
          setShowTweakModal((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleGenerate, isPromptSelected, setShowTweakModal]);

  const handleTweak = useCallback(
    async (providedIndex?: number) => {
      const index = providedIndex || selectedSlideIndex;
      const dummyTweak: Version = {
        id: crypto.randomUUID(),
        text: "",
        status: "loading",
      };
      dispatch(
        branch({
          index,
          version: dummyTweak,
        }),
      );
      setBranchKey(crypto.randomUUID());
      const version = state.versions[index - 1];
      const tweak = state.tweak || "";
      const prompt = state.prompt;
      if (!version || !prompt || !tweak) {
        dispatch(
          updateVersion({
            id: dummyTweak.id,
            updates: {
              ...dummyTweak,
              status: "error",
              errorMsg: "Prompt must be provided.",
            },
          }),
        );
        return;
      }
      let formatted: string;
      if (version.selectionActive && version.selection) {
        formatted = formatTweakSelection(
          prompt,
          version.text,
          version.selection,
          tweak,
        );
      } else {
        formatted = formatTweakPrompt(prompt, version.text, tweak);
      }

      try {
        const res = await generateAction(formatted);
        dispatch(
          updateVersion({
            id: dummyTweak.id,
            updates: {
              ...dummyTweak,
              text: res,
              status: "ready",
            },
          }),
        );
      } catch (e) {
        dispatch(
          updateVersion({
            id: dummyTweak.id,
            updates: {
              ...dummyTweak,
              status: "error",
            },
          }),
        );
      }
    },
    [
      dispatch,
      generateAction,
      selectedSlideIndex,
      state.prompt,
      state.tweak,
      state.versions,
    ],
  );

  const handleRetry = useCallback(
    (index: number) => {
      if (index === 0) {
        handleGenerate();
      } else {
        handleTweak(index);
      }
    },
    [handleGenerate, handleTweak],
  );

  return (
    <form className={"flex flex-col justify-center items-center gap-4"}>
      <TitleField
        title={state.title}
        setTitle={(title) => dispatch(setTitle(title))}
      />
      <PromptCarousel
        prompt={state}
        onSelectSlide={(index) => setSelectedSlideIndex(index)}
        branchKey={branchKey}
        onRetry={(index) => handleRetry(index)}
      />
      <AnimatePresence mode="wait">
        {isPromptSelected && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              data-testid="generate-btn"
              className={clsx([
                "bg-white rounded-lg px-4 py-2 text-black flex items-center gap-2",
                "hover:scale-110 transition duration-200 ease-in cursor-pointer",
              ])}
              type="button"
              onClick={handleGenerate}
            >
              Generate
            </button>
          </motion.div>
        )}

        {!isPromptSelected &&
          state.versions[selectedSlideIndex - 1]?.status === "ready" && (
            <motion.div
              key="tweak"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TweakWrapper
                tweak={state.tweak || ""}
                onChange={(e) => dispatch(updateTweak(e.target.value))}
                handleSubmit={() => handleTweak()}
                setShowTweakModal={setShowTweakModal}
                showTweakModal={showTweakModal}
              />
            </motion.div>
          )}
      </AnimatePresence>
      <span
        data-testid="prompt-saving-indicator"
        className="text-white absolute right-0 bottom-0 py-2 px-4"
      >
        {isSaving ? "Saving..." : "Saved"}
      </span>
    </form>
  );
}
