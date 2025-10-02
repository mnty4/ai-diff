export type Prompt = {
  id: string;
  title: string;
  prompt: string;
  versions: Version[];
  tweak?: string;
};
export type Version = {
  id: string;
  text?: string;
  status?: "ready" | "loading" | "error";
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
