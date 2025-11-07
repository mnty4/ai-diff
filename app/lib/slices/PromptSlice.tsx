import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Prompt, Version } from "@/app/lib/definitions";

interface PromptState {
  entity: Prompt | null;
}

export const promptSlice = createSlice({
  name: "prompt",
  initialState: {
    entity: null,
  } as PromptState,
  reducers: {
    setActivePrompt: (state, action: PayloadAction<Prompt>) => {
      state.entity = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      if (state.entity) {
        state.entity.title = action.payload;
        state.entity.isDirty = true;
      }
    },
    updatePromptString: (state, action: PayloadAction<string>) => {
      if (state.entity) {
        state.entity.prompt = action.payload;
        state.entity.isDirty = true;
      }
    },
    setVersions: (state, action: PayloadAction<Version[]>) => {
      if (state.entity) {
        state.entity.versions = action.payload;
        state.entity.isDirty = true;
      }
    },
    updateVersion: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Version> }>,
    ) => {
      if (state.entity) {
        state.entity.versions = state.entity.versions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t,
        );
        state.entity.isDirty = true;
      }
    },
    addVersion: (state, action: PayloadAction<Version>) => {
      if (state.entity) {
        state.entity.versions.push(action.payload);
        state.entity.isDirty = true;
      }
    },
    removeVersion: (state, action: PayloadAction<string>) => {
      if (state.entity) {
        state.entity.versions.filter((t) => t.id !== action.payload);
        state.entity.isDirty = true;
      }
    },
    updateTweak: (state, action: PayloadAction<string>) => {
      if (state.entity) {
        state.entity.tweak = action.payload;
        state.entity.isDirty = true;
      }
    },
    branch: (
      state,
      action: PayloadAction<{ index: number; version: Version }>,
    ) => {
      if (state.entity) {
        state.entity.versions = [
          ...state.entity.versions.filter(
            (t, i) => i <= action.payload.index - 1,
          ),
          action.payload.version,
        ];
        state.entity.isDirty = true;
      }
    },
    markSaved: (state) => {
      if (state.entity) {
        state.entity.isDirty = false;
      }
    },
  },
});

export const {
  setTitle,
  setVersions,
  addVersion,
  removeVersion,
  updateVersion,
  updatePromptString,
  updateTweak,
  markSaved,
  branch,
  setActivePrompt,
} = promptSlice.actions;

export default promptSlice.reducer;
