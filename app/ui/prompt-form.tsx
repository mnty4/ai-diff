"use client";

import TitleField from "@/app/ui/TitleField";
import PromptCarousel from "@/app/ui/PromptCarousel";
import { Prompt, PromptDataAction } from "@/app/lib/definitions";
import { useReducer, useState } from "react";
import { generate } from "@/app/lib/actions";
import clsx from "clsx";

function promptDataReducer(state: Prompt, action: PromptDataAction): Prompt {
  switch (action.type) {
    case "setTitle":
      return { ...state, title: action.payload };
    case "updatePrompt":
      return { ...state, prompt: action.payload };
    case "setVersions":
      return { ...state, versions: action.payload };
    case "updateVersion":
      return {
        ...state,
        versions: state.versions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "addVersion":
      return { ...state, versions: [...state.versions, action.payload] };
    case "removeVersion":
      return {
        ...state,
        versions: state.versions.filter((t) => t.id !== action.id),
      };
    case "updateTweak":
      return {
        ...state,
        tweak: action.payload,
      };
    case "branch":
      return {
        ...state,
        versions: [
          ...state.versions.filter((t, i) => i <= action.index - 1),
          action.payload,
        ],
      };
    default:
      return state;
  }
}

function formatTweakPrompt(prompt: string, version: string, tweak: string) {
  return `Adjust the current version of the text based on the users tweak instruction.
  
This is the users original prompt: [
  ${prompt}
]
This is the current version: [
  ${version}
]
This is the users instruction for tweaking the current version: [
  ${tweak}
].`;
}

export default function PromptForm({
  initialPrompt,
}: {
  initialPrompt: Prompt;
}) {
  const [state, dispatch] = useReducer(promptDataReducer, initialPrompt);
  const [showTweakModal, setShowTweakModal] = useState(false);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const isPromptSelected = selectedPromptIndex === 0;

  // the branch key keeps track of the most recent branch operation (delete all slides after current
  // and adds new prompt output). Necessary to refresh the hook for scrolling to end of prompt slides
  const [branchKey, setBranchKey] = useState<string>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleGenerate = async () => {
    const dummyTweak = {
      id: crypto.randomUUID(),
      isLoading: true,
    };
    dispatch({
      type: "branch",
      index: selectedPromptIndex,
      payload: dummyTweak,
    });
    setBranchKey(crypto.randomUUID());
    // if (!state.prompt) {
    //   return;
    // }
    console.log(state.prompt);
    const res = await generate(state.prompt);
    dispatch({
      type: "updateVersion",
      payload: {
        ...dummyTweak,
        text: res,
        isLoading: false,
      },
    });
  };

  const handleTweak = async () => {
    const dummyTweak = {
      id: crypto.randomUUID(),
      isLoading: true,
    };
    dispatch({
      type: "branch",
      index: selectedPromptIndex,
      payload: dummyTweak,
    });
    setBranchKey(crypto.randomUUID());
    setShowTweakModal(false);
    const version = state.versions[selectedPromptIndex - 1].text || "";
    const tweak = state.tweak || "";
    const prompt = state.prompt;
    // if (!version || !prompt || !tweak) {
    //   return;
    // }
    const formatted = formatTweakPrompt(prompt, version, tweak);

    const res = await generate(formatted);
    dispatch({
      type: "updateVersion",
      payload: {
        ...dummyTweak,
        text: res,
        isLoading: false,
      },
    });
  };

  return (
    <form
      className={"flex flex-col justify-center items-center gap-4"}
      onSubmit={handleSubmit}
    >
      <TitleField />
      <PromptCarousel
        prompt={state}
        onUpdateTweak={(value) =>
          dispatch({ type: "updateVersion", payload: value })
        }
        onUpdatePrompt={(value) =>
          dispatch({ type: "updatePrompt", payload: value })
        }
        onSelectSlide={(index) => setSelectedPromptIndex(index)}
        branchKey={branchKey}
      />

      {isPromptSelected ? (
        <button
          id="generate-btn"
          className={
            "bg-white rounded-lg px-4 py-2 text-black flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
          }
          type="button"
          onClick={handleGenerate}
        >
          Generate
        </button>
      ) : (
        <div className="relative inline-block">
          <div
            className={clsx([
              "absolute bottom-full left-1/2 -translate-x-1/2 ",
              "mb-6 bg-black rounded-xl w-96 h-32 p-4",
              "transition-opacity duration-150 ease-in",
              showTweakModal ? "" : "opacity-0 pointer-events-none",
            ])}
          >
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0
                      border-l-16 border-r-16 border-t-16 border-l-transparent border-r-transparent border-t-black"
            />

            <textarea
              className={
                "h-full w-full border-none outline-none resize-none bg-transparent"
              }
              onChange={(e) =>
                dispatch({ type: "updateTweak", payload: e.target.value })
              }
              value={state.tweak}
              onKeyDown={(e) => e.key === "Enter" && handleTweak()}
            />
          </div>

          <button
            id="tweak-btn"
            className={
              "bg-purple-600 rounded-lg px-4 py-2 text-white flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
            }
            type="button"
            onClick={() => setShowTweakModal(!showTweakModal)}
          >
            Tweak
          </button>
        </div>
      )}
    </form>
  );
}
