import PromptCarousel from "@/app/ui/PromptCarousel";

describe("prompt-carousel", () => {
  it("render carousel slides", () => {
    const prompts = [
      { id: "1", text: "Hello" },
      { id: "2", text: "World" },
    ];
    cy.mount(<PromptCarousel prompts={prompts} />);
    cy.get(".embla__slide").should("have.length", 4);
  });
  it("should show generate button when slide progress is on prompt slide", () => {
    const prompt = { text: "hello" };
    const tweaks = [
      { id: "1", text: "Hello" },
      { id: "2", text: "World" },
    ];
    cy.mount(<PromptCarousel prompt={prompt} />);
    cy.get(".embla__slide");
  });
  it("should show tweak button when slide progress is on prompt slide");
  /* TODO:
   *  - When slides are empty
   *  - when left/right buttons are pressed
   *  - doesn't show left button at start/right button at end
   *  - show tweak button when viewing tweaks on the carousel
   */
});
