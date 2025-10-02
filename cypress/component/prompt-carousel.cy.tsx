import PromptCarousel from "@/app/ui/PromptCarousel";

describe("prompt-carousel", () => {
  it("render carousel slides", () => {
    const prompt = {
      id: crypto.randomUUID(),
      title: "New Prompt",
      prompt: "prompt",
      versions: [
        { id: "1", text: "Hello" },
        { id: "2", text: "World" },
      ],
    };
    cy.mount(<PromptCarousel prompt={prompt} />);
    cy.get(".embla__slide").should("have.length", 4);
  });
  /* TODO:
   *  - When slides are empty
   *  - when left/right buttons are pressed
   *  - doesn't show left button at start/right button at end
   *  - show tweak button when viewing tweaks on the carousel
   */
});
