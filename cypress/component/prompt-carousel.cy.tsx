import PromptCarousel from "@/app/ui/prompt-carousel";
import { Prompt } from "@/app/lib/definitions";

describe("prompt-carousel", () => {
  it("render carousel slides", () => {
    const prompt: Prompt = {
      id: crypto.randomUUID(),
      title: "New Prompt",
      prompt: "prompt",
      versions: [
        { id: "1", text: "Hello", status: "ready" },
        { id: "2", text: "World", status: "ready" },
      ],
      tweak: "",
      isDirty: false,
    };
    cy.mount(<PromptCarousel prompt={prompt} />);
    cy.get(".embla__slide").should("have.length", 3);
  });
  /* TODO:
   *  - When slides are empty
   *  - when left/right buttons are pressed
   *  - doesn't show left button at start/right button at end
   *  - show tweak button when viewing tweaks on the carousel
   */
});
