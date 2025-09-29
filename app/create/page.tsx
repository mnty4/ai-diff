"use client";

import Header from "@/app/ui/Header";
import TitleField from "@/app/ui/TitleField";
import PromptCarousel from "@/app/ui/PromptCarousel";
import { useReducer, useState } from "react";
import { PromptData, PromptDataAction } from "@/app/lib/definitions";

function promptDataReducer(
  state: PromptData,
  action: PromptDataAction,
): PromptData {
  switch (action.type) {
    case "setTitle":
      return { ...state, title: action.payload };
    case "setPrompts":
      return { ...state, prompts: action.payload };
    case "updatePrompt":
      return {
        ...state,
        prompts: state.prompts.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };
    case "addPrompt":
      return { ...state, prompts: [...state.prompts, action.payload] };
    case "removePrompt":
      return {
        ...state,
        prompts: state.prompts.filter((p) => p.id !== action.id),
      };
    case "branch":
      return {
        ...state,
        prompts: [
          ...state.prompts.filter((p, i) => i <= action.index),
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
    prompts: [
      { id: "1", text: "Hello" },
      { id: "2", text: "World" },
    ],
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
    await new Promise((resolve) => {
      setTimeout(() => resolve(null), 5000);
    });
    dispatch({
      type: "updatePrompt",
      payload: {
        ...dummyPrompt,
        text: "New prompt - " + dummyPrompt.id,
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
          prompts={state.prompts}
          onUpdatePrompt={(value) =>
            dispatch({ type: "updatePrompt", payload: value })
          }
          onSelectSlide={(index) => setSelectedPromptIndex(index)}
          branchKey={branchKey}
        />
        <button
          className={
            "bg-white rounded-lg px-4 py-2 text-black flex items-center gap-2 hover:scale-110 transition duration-200 ease-in cursor-pointer"
          }
          type="submit"
        >
          <span>Generate</span>
        </button>
      </form>
    </main>
  );
}
