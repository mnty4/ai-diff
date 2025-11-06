export type Prompt = {
  id: string;
  title: string;
  prompt: string;
  versions: Version[];
  tweak: string;
  isDirty: boolean;
};
export type Version = {
  id: string;
  text: string;
  status: "ready" | "loading" | "error";
  selection?: string;
  selectionActive?: boolean;
  errorMsg?: string;
};
export type PromptDTO = {
  id: string;
  title: string;
  prompt: string;
  tweak: string;
  versions: VersionDTO[];
};
export type PromptListItem = {
  id: string;
  title: string;
  prompt: string;
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
  | {
      type: "updateVersion";
      id: string;
      payload: Version | ((prev: Version) => Version);
    }
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
      return { ...state, title: action.payload, isDirty: true };
    case "updatePrompt":
      return { ...state, prompt: action.payload, isDirty: true };
    case "setVersions":
      return { ...state, versions: action.payload, isDirty: true };
    case "updateVersion":
      const version = state.versions.find(
        (version) => version.id === action.id,
      );
      if (!version) {
        throw new Error("Unknown version " + action.id);
      }
      if (typeof action.payload === "function") {
        action.payload = action.payload(version);
      }
      return {
        ...state,
        isDirty: true,
        versions: state.versions.map((t) =>
          t.id === action.id ? { ...t, ...action.payload } : t,
        ),
      };
    case "addVersion":
      return {
        ...state,
        isDirty: true,
        versions: [...state.versions, action.payload],
      };
    case "removeVersion":
      return {
        ...state,
        isDirty: true,
        versions: state.versions.filter((t) => t.id !== action.id),
      };
    case "updateTweak":
      return {
        ...state,
        isDirty: true,
        tweak: action.payload,
      };
    case "branch":
      return {
        ...state,
        isDirty: true,
        versions: [
          ...state.versions.filter((t, i) => i <= action.index - 1),
          action.payload,
        ],
      };
    case "markSaved":
      return { ...state, isDirty: false };
    default:
      return state;
  }
}
