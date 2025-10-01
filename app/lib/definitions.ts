export type Prompt = {
  title: string;
  prompt: string;
  tweaks: Tweak[];
};
export type Tweak = {
  id: string;
  text?: string;
  isLoading?: boolean;
};
export type PromptDataAction =
  | { type: "setTitle"; payload: string }
  | { type: "setTweaks"; payload: Tweak[] }
  | { type: "addTweak"; payload: Tweak }
  | { type: "updateTweak"; payload: Tweak }
  | { type: "removeTweak"; id: string }
  | { type: "branch"; index: number; payload: Tweak };
