export type Prompt = {
  id: string;
  title: string;
  prompt: string;
  versions: Version[];
  tweak: string;
  isDirty: boolean;
  deletedVersionIds: string[];
};
export type Version = {
  id: string;
  text: string;
  status: "ready" | "loading" | "error";
  errorMsg?: string;
  isDirty?: boolean;
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
      return { ...state, title: action.payload, isDirty: true };
    case "updatePrompt":
      return { ...state, prompt: action.payload, isDirty: true };
    case "setVersions":
      return { ...state, versions: action.payload };
    case "updateVersion":
      console.log("update version: ", {
        ...state,
        versions: state.versions.map((t) =>
          t.id === action.payload.id
            ? { ...t, ...{ ...action.payload, isDirty: true } }
            : t,
        ),
      });
      return {
        ...state,
        versions: state.versions.map((t) =>
          t.id === action.payload.id
            ? { ...t, ...{ ...action.payload, isDirty: true } }
            : t,
        ),
      };
    case "addVersion":
      return {
        ...state,
        versions: [...state.versions, { ...action.payload, isDirty: true }],
      };
    case "removeVersion":
      return {
        ...state,
        versions: state.versions.filter((t) => t.id !== action.id),
        deletedVersionIds: [...state.deletedVersionIds, action.id],
      };
    case "updateTweak":
      return {
        ...state,
        tweak: action.payload,
        isDirty: true,
      };
    case "branch":
      return {
        ...state,
        deletedVersionIds: [
          ...state.deletedVersionIds,
          ...state.versions
            .filter((_, i) => i > action.index - 1)
            .map((t) => t.id),
        ],
        versions: [
          ...state.versions.filter((t, i) => i <= action.index - 1),
          { ...action.payload, isDirty: true },
        ],
      };
    case "markSaved":
      return {
        ...state,
        isDirty: false,
        versions: state.versions.map((v) => ({ ...v, isDirty: false })),
        deletedVersionIds: [],
      };
    default:
      return state;
  }
}
