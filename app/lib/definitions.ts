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
export type PromptDTO = {
  id: string;
  title: string;
  prompt: string;
  tweak: string;
  versions: VersionDTO[];
};
export type VersionDTO = {
  id: string;
  text: string;
};

export type PromptDataAction =
  | { type: "setTitle"; payload: string }
  | { type: "updatePrompt"; payload: string }
  | { type: "setVersions"; payload: Version[] }
  | { type: "addVersion"; payload: Version }
  | { type: "updateVersion"; payload: Version }
  | { type: "removeVersion"; id: string }
  | { type: "updateTweak"; payload: string }
  | { type: "branch"; index: number; payload: Version }
  | { type: "markSaved" };

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
      const versions = state.versions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t,
      );
      console.log(
        "update version: ",
        {
          ...state,
          versions,
        },
        ...versions,
      );
      return {
        ...state,
        versions: state.versions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t,
        ),
      };
    case "addVersion":
      return {
        ...state,
        versions: [...state.versions, action.payload],
      };
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
