export type PromptData = {
  title: string;
  prompts: Prompt[];
};
export type Prompt = {
  id: string;
  text?: string;
  isLoading?: boolean;
};
export type PromptDataAction =
  | { type: "setTitle"; payload: string }
  | { type: "setPrompts"; payload: Prompt[] }
  | { type: "addPrompt"; payload: Prompt }
  | { type: "updatePrompt"; payload: Prompt }
  | { type: "removePrompt"; id: string }
  | { type: "branch"; index: number; payload: Prompt };
