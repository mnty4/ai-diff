"use client";

import Header from "@/app/ui/Header";
import TitleField from "@/app/ui/TitleField";
import PromptCarousel from "@/app/ui/PromptCarousel";
import { useReducer, useState } from "react";
import { Prompt, PromptDataAction } from "@/app/lib/definitions";
import { generate } from "@/app/lib/actions";

function promptDataReducer(state: Prompt, action: PromptDataAction): Prompt {
  switch (action.type) {
    case "setTitle":
      return { ...state, title: action.payload };
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
          ...state.tweaks.filter((t, i) => i <= action.index),
          action.payload,
        ],
      };
    default:
      return state;
  }
}

export default function CreatePage() {
  const [state, dispatch] = useReducer(promptDataReducer, {
    title: "New Prompt",
    prompt: "",
    tweaks: [],
  });
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  // the branch key keeps track of the most recent branch operation (delete all slides after current
  // and adds new prompt output). Necessary to refresh the hook for scrolling to end of prompt slides
  const [branchKey, setBranchKey] = useState<string>();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dummyPrompt = {
      id: crypto.randomUUID(),
      isLoading: true,
    };
    dispatch({
      type: "branch",
      index: selectedPromptIndex,
      payload: dummyPrompt,
    });
    setBranchKey(crypto.randomUUID());
    const prompt = state.tweaks[selectedPromptIndex].text;
    if (!prompt) {
      return;
    }
    const responseText = await generate(prompt);
    dispatch({
      type: "updateTweak",
      payload: {
        ...dummyPrompt,
        text: responseText,
        isLoading: false,
      },
    });
  };

  return (
    <main className={"h-full w-full flex flex-col gap-4"}>
      <div className={"flex justify-center items-center h-16"}>
        <Header />
      </div>
      <form
        className={"flex flex-col justify-center items-center gap-4"}
        onSubmit={handleSubmit}
      >
        <TitleField />
        <PromptCarousel
          tweaks={state.tweaks}
          onUpdateTweak={(value) =>
            dispatch({ type: "updateTweak", payload: value })
          }
          onSelectSlide={(index) => setSelectedPromptIndex(index)}
          branchKey={branchKey}
        />
        <button
          id="generate-btn"
          className={
            "bg-white rounded-lg px-4 py-2 text-black flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
          }
          type="submit"
        >
          Generate
        </button>
      </form>
    </main>
  );
}
