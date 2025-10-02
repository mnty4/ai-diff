"use client";

import TitleField from "@/app/ui/TitleField";
import PromptCarousel from "@/app/ui/PromptCarousel";
import { Prompt, PromptDataAction, Version } from "@/app/lib/definitions";
import { useReducer, useState } from "react";
import { generate } from "@/app/lib/actions";
import TweakWrapper from "@/app/ui/tweak-wrapper";

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
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const isPromptSelected = selectedPromptIndex === 0;

  // the branch key keeps track of the most recent branch operation (delete all slides after current
  // and adds new prompt output). Necessary to refresh the hook for scrolling to end of prompt slides
  const [branchKey, setBranchKey] = useState<string>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleGenerate = async () => {
    const dummyTweak: Version = {
      id: crypto.randomUUID(),
      status: "loading",
    };
    dispatch({
      type: "branch",
      index: selectedPromptIndex,
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
      const res = await generate(state.prompt);
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

  const handleTweak = async () => {
    const dummyTweak: Version = {
      id: crypto.randomUUID(),
      status: "loading",
    };
    dispatch({
      type: "branch",
      index: selectedPromptIndex,
      payload: dummyTweak,
    });
    setBranchKey(crypto.randomUUID());
    const version = state.versions[selectedPromptIndex - 1].text || "";
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
        onRetry={() => {}}
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
        <TweakWrapper
          tweak={state.tweak || ""}
          onChange={(e) =>
            dispatch({ type: "updateTweak", payload: e.target.value })
          }
          handleSubmit={handleTweak}
        />
      )}
    </form>
  );
}
