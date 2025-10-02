"use client";

import TitleField from "@/app/ui/TitleField";
import PromptCarousel from "@/app/ui/PromptCarousel";
import { Prompt, PromptDataAction } from "@/app/lib/definitions";
import { useReducer, useState } from "react";
import { generate } from "@/app/lib/actions";

function promptDataReducer(state: Prompt, action: PromptDataAction): Prompt {
  switch (action.type) {
    case "setTitle":
      return { ...state, title: action.payload };
    case "updatePrompt":
      return { ...state, prompt: action.payload };
    case "setTweaks":
      return { ...state, tweaks: action.payload };
    case "updateTweak":
      return {
        ...state,
        tweaks: state.tweaks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "addTweak":
      return { ...state, tweaks: [...state.tweaks, action.payload] };
    case "removeTweak":
      return {
        ...state,
        tweaks: state.tweaks.filter((t) => t.id !== action.id),
      };
    case "branch":
      return {
        ...state,
        tweaks: [
          ...state.tweaks.filter((t, i) => i <= action.index - 1),
          action.payload,
        ],
      };
    default:
      return state;
  }
}

function formatTweak(prompt: string, version: string, tweak: string) {
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
  //   console.log("here");
  //   const formData = new FormData(e.currentTarget);
  //   console.log(formData);
  //   console.log(formData.get("action"));
  //   const action = formData.get("action");
  //   if (action === "generate") handleGenerate(e);
  //   if (action === "tweak") handleTweak(e);
  // };

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
    if (!state.prompt) {
      return;
    }
    console.log(state.prompt);
    const responseText = await generate(state.prompt);
    dispatch({
      type: "updateTweak",
      payload: {
        ...dummyTweak,
        text: responseText,
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
    const tweak = state.tweaks[selectedPromptIndex - 1].text;
    const prompt = state.prompt;
    if (!tweak || !prompt) {
      return;
    }
    const responseText = await generate(tweak);
    dispatch({
      type: "updateTweak",
      payload: {
        ...dummyTweak,
        text: responseText,
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
          dispatch({ type: "updateTweak", payload: value })
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
        <button
          id="tweak-btn"
          className={
            "bg-purple-600 rounded-lg px-4 py-2 text-white flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
          }
          type="button"
          onClick={handleTweak}
        >
          Tweak
        </button>
      )}
    </form>
  );
}
