import PromptCarousel from "@/app/ui/PromptCarousel";

describe("prompt-carousel", () => {
  it("render carousel slides", () => {
    const prompts = [
      { id: "1", text: "Hello" },
      { id: "2", text: "World" },
    ];
    cy.mount(<PromptCarousel prompts={prompts} />);
    cy.get(".embla__slide").should("have.length", 5);
  });
  /* TODO:
   *  - When slides are empty
   *  - when left/right buttons are pressed
   *  - doesn't show left button at start/right button at end
   */
});
