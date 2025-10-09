"use client";

import TitleField from "@/app/ui/TitleField";
import PromptCarousel from "@/app/ui/PromptCarousel";
import { Prompt, promptDataReducer, Version } from "@/app/lib/definitions";
import { useCallback, useEffect, useReducer, useState } from "react";
import { generate } from "@/app/lib/actions";
import TweakWrapper from "@/app/ui/tweak-wrapper";
import clsx from "clsx";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { formatTweakPrompt } from "@/app/lib/utils";

export default function PromptForm({
  initialPrompt = {
    id: "draft",
    title: "New Prompt",
    prompt: "",
    tweak: "",
    versions: [],
  },
  generateAction = generate,
}: {
  initialPrompt?: Prompt;
  generateAction?: (text: string) => Promise<string>;
}) {
  const [state, dispatch] = useReducer(promptDataReducer, initialPrompt);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const isPromptSelected = selectedPromptIndex === 0;
  const [showTweakModal, setShowTweakModal] = useState(false);

  // the branch key keeps track of the most recent branch operation (delete all slides after current
  // and adds new prompt output). Necessary to refresh the hook for scrolling to end of prompt slides
  const [branchKey, setBranchKey] = useState<string>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleGenerate = useCallback(async () => {
    debugger;
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
      const res = await generate(formatted);
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
    </form>
  );
}
