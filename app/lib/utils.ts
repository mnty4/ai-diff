export function formatTweakPrompt(
  prompt: string,
  version: string,
  tweak: string,
) {
  return `Adjust the current version of the text based on the users tweak instruction. Only include the updated text in the response.
  
This is the users original prompt: [
  ${prompt}
]
This is the current version: [
  ${version}
]
This is the users instruction for tweaking the current version of the text: [
  ${tweak}
].`;
}

export function formatTweakSelection(
  prompt: string,
  version: string,
  selection: string,
  tweak: string,
) {
  return `Adjust the current version of the text based on the users tweak instruction. 
  Only modify the selection string while leaving the unselected parts of the text the same as in the previous version. 
  In the response, provide only the new version.
  
This is the users original prompt: [
  ${prompt}
]
This is the current version: [
  ${version}
]
This is the text selection: [
  ${selection}
]
This is the users instruction for tweaking the current version of the text: [
  ${tweak}
].`;
}

export function truncate(str: string, maxLength: number) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}
