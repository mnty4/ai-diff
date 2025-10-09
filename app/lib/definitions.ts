export type Prompt = {
  id: string;
  title: string;
  prompt: string;
  versions: Version[];
  tweak: string;
};
export type Version = {
  id: string;
  text: string;
  status: "ready" | "loading" | "error";
  errorMsg?: string;
};
export type PromptDataAction =
  | { type: "setTitle"; payload: string }
  | { type: "updatePrompt"; payload: string }
  | { type: "setVersions"; payload: Version[] }
  | { type: "addVersion"; payload: Version }
  | { type: "updateVersion"; payload: Version }
  | { type: "removeVersion"; id: string }
  | { type: "updateTweak"; payload: string }
  | { type: "branch"; index: number; payload: Version };

export function promptDataReducer(
  state: Prompt,
  action: PromptDataAction,
): Prompt {
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
          t.id === action.payload.id ? { ...t, ...action.payload } : t,
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
