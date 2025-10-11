"use client";

import TitleField from "@/app/ui/title-field";
import PromptCarousel from "@/app/ui/prompt-carousel";
import { Prompt, promptDataReducer, Version } from "@/app/lib/definitions";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import TweakWrapper from "@/app/ui/tweak-wrapper";
import clsx from "clsx";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { formatTweakPrompt } from "@/app/lib/utils";
import { useDebouncedCallback } from "use-debounce";

export default function PromptForm({
  initialPrompt = {
    id: crypto.randomUUID(),
    title: "New Prompt",
    prompt: "",
    tweak: "",
    versions: [],
  },
  generateAction,
  savePromptToDBAction,
}: {
  initialPrompt?: Prompt;
  generateAction: (text: string) => Promise<string>;
  savePromptToDBAction: (prompt: Prompt) => Promise<void>;
}) {
  const [state, dispatch] = useReducer(promptDataReducer, initialPrompt);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const isPromptSelected = selectedPromptIndex === 0;
  const [showTweakModal, setShowTweakModal] = useState(false);

  // the branch key keeps track of the most recent branch operation (delete all slides after current
  // and adds new prompt output). Necessary to refresh the hook for scrolling to end of prompt slides
  const [branchKey, setBranchKey] = useState<string>();

  const [isSaving, setIsSaving] = useState(false);
  const lastVersionId = useRef(1);

  const savePromptToDbDebounced = useDebouncedCallback(
    async (versionId: number, state: Prompt) => {
      console.log("saving: versionId =", versionId);
      try {
        await savePromptToDBAction(state);
      } finally {
        console.log(
          "saved: versionId =",
          versionId,
          "lastVersionId.current =",
          lastVersionId.current,
        );
        if (lastVersionId.current === versionId) {
          setIsSaving(false);
        }
      }
    },
    800,
  );

  useEffect(() => {
    console.log(`state useEffect triggered...`);
    console.log("begin debouncing...");
    setIsSaving(true);
    const versionId = lastVersionId.current + 1;
    lastVersionId.current = versionId;
    savePromptToDbDebounced(versionId, { ...state });
  }, [state, savePromptToDbDebounced]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleGenerate = useCallback(async () => {
    const dummyTweak: Version = {
      id: crypto.randomUUID(),
      text: "",
      status: "loading",
    };
    dispatch({
      type: "branch",
      index: 0,
      payload: dummyTweak,
    });
    console.log("branching...");
    setBranchKey(crypto.randomUUID());
    if (!state.prompt) {
      dispatch({
        type: "updateVersion",
        payload: {
          ...dummyTweak,
          status: "error",
          errorMsg: "Prompt must be provided.",
        },
      });
      return;
    }
    try {
      const res = await generateAction(state.prompt);
      dispatch({
        type: "updateVersion",
        payload: {
          ...dummyTweak,
          text: res,
          status: "ready",
        },
      });
    } catch (e) {
      dispatch({
        type: "updateVersion",
        payload: {
          ...dummyTweak,
          status: "error",
        },
      });
    }
  }, [generateAction, state.prompt]);

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

  const handleTweak = async (providedIndex?: number) => {
    const index = providedIndex || selectedPromptIndex;
    const dummyTweak: Version = {
      id: crypto.randomUUID(),
      text: "",
      status: "loading",
    };
    dispatch({
      type: "branch",
      index: index,
      payload: dummyTweak,
    });
    setBranchKey(crypto.randomUUID());
    const version = state.versions[index - 1].text || "";
    const tweak = state.tweak || "";
    const prompt = state.prompt;
    if (!version || !prompt || !tweak) {
      dispatch({
        type: "updateVersion",
        payload: {
          ...dummyTweak,
          status: "error",
          errorMsg: "Prompt must be provided.",
        },
      });
      return;
    }
    const formatted = formatTweakPrompt(prompt, version, tweak);

    try {
      const res = await generateAction(formatted);
      console.log(res);
      dispatch({
        type: "updateVersion",
        payload: {
          ...dummyTweak,
          text: res,
          status: "ready",
        },
      });
    } catch (e) {
      dispatch({
        type: "updateVersion",
        payload: {
          ...dummyTweak,
          status: "error",
        },
      });
    }
  };
  const handleRetry = (index: number) => {
    console.log(index);
    if (index === 0) {
      handleGenerate();
    } else {
      handleTweak(index);
    }
  };

  return (
    <form
      className={"flex flex-col justify-center items-center gap-4"}
      onSubmit={handleSubmit}
    >
      <TitleField
        title={state.title}
        setTitle={(title) => dispatch({ type: "setTitle", payload: title })}
      />
      <PromptCarousel
        prompt={state}
        onUpdateVersion={(value) =>
          dispatch({ type: "updateVersion", payload: value })
        }
        onUpdatePrompt={(value) =>
          dispatch({ type: "updatePrompt", payload: value })
        }
        onSelectSlide={(index) => setSelectedPromptIndex(index)}
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
          state.versions[selectedPromptIndex - 1]?.status === "ready" && (
            <motion.div
              key="tweak"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TweakWrapper
                tweak={state.tweak || ""}
                onChange={(e) =>
                  dispatch({ type: "updateTweak", payload: e.target.value })
                }
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
