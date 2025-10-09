export function formatTweakPrompt(
  prompt: string,
  version: string,
  tweak: string,
) {
  return `Adjust the current version of the text based on the users tweak instruction.
  
This is the users original prompt: [
  ${prompt}
]
This is the current version: [
  ${version}
]
This is the users instruction for tweaking the current version: [
  ${tweak}
].`;
}
