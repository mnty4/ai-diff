import PromptCarousel from "@/app/ui/PromptCarousel";

describe("Prompt Form Component", () => {
  it("should show generate button when selected slide is prompt slide", () => {
    const prompt = {
      id: crypto.randomUUID(),
      title: "New Prompt",
      prompt: "prompt",
      tweaks: [
        { id: "1", text: "Hello" },
        { id: "2", text: "World" },
      ],
    };
    cy.mount(<PromptCarousel prompt={prompt} />);
    cy.get("generate-btn").should("be.visible");
    cy.get("tweak-btn").should("not.be.visible");
    cy.get(".embla__slide");
  });
  it("should show tweak button when selected slide is tweak slide", () => {
    const prompt = {
      id: crypto.randomUUID(),
      title: "New Prompt",
      prompt: "prompt",
      tweaks: [
        { id: "1", text: "Hello" },
        { id: "2", text: "World" },
      ],
    };
    cy.mount(<PromptCarousel prompt={prompt} />);

    cy.get("generate-btn").should("not.be.visible");
    cy.get("tweak-btn").should("be.visible");
    cy.get(".embla__slide");
  });
});
