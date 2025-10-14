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

export function truncate(str: string, maxLength: number) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}
