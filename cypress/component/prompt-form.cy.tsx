import PromptCarousel from "@/app/ui/PromptCarousel";
import * as actions from "@/app/lib/actions";
import PromptForm from "@/app/ui/prompt-form";
import { Prompt } from "@/app/lib/definitions";

describe("Prompt Form Component", () => {
  it("should render", () => {
    const prompt: Prompt = {
      id: crypto.randomUUID(),
      title: "New Prompt",
      prompt: "prompt",
      versions: [
        { id: "1", text: "Hello", status: "ready" },
        { id: "2", text: "World", status: "ready" },
      ],
    };
    cy.stub(actions, "generate").resolves("Mock generated text");
    cy.mount(<PromptForm initialPrompt={prompt} />);
    cy.contains("New Prompt");
    cy.contains("prompt");
    cy.contains("Hello");
    cy.contains("World");
  });
  it("should show generate button", () => {
    const prompt: Prompt = {
      id: crypto.randomUUID(),
      title: "New Prompt",
      prompt: "prompt",
      versions: [
        { id: "1", text: "Hello", status: "ready" },
        { id: "2", text: "World", status: "ready" },
      ],
    };
    cy.stub(actions, "generate").resolves("Mock generated text");
    cy.mount(<PromptForm initialPrompt={prompt} />);
    cy.get("[data-testid='generate-btn']").should("exist");
    cy.get("[data-testid='tweak-btn']").should("not.exist");
  });
  it("should show tweak button after clicking generate button", () => {
    const prompt: Prompt = {
      id: crypto.randomUUID(),
      title: "New Prompt",
      prompt: "prompt",
      versions: [
        { id: "1", text: "Hello", status: "ready" },
        { id: "2", text: "World", status: "ready" },
      ],
    };
    cy.mount(
      <PromptForm
        initialPrompt={prompt}
        generateAction={cy.stub().resolves("generated text")}
      />,
    );
    cy.get("[data-testid='generate-btn']").click();
    cy.contains("generated text");
    cy.get("[data-testid='generate-btn']").should("not.exist");
    cy.get("[data-testid='tweak-btn']").should("exist");
  });
});

/* TODO:
- prompt, tweaks and title are stored in local storage.
- load from local storage on reload
 */
