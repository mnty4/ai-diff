function generatePrompt() {
  cy.get("[data-testid='prompt-textarea']")
    .should("be.visible")
    .type("Write 'Hello world!'");
  cy.get("[data-testid='tweak-btn']").should("not.exist");
  cy.get("[data-testid='generate-btn']").should("exist").click();
}
function tweakPrompt() {
  cy.get("[data-testid='tweak-btn']").should("exist").click();
  cy.get("[data-testid='tweak-modal']").should("exist");
  cy.get("[data-testid='tweak-modal-textarea']")
    .should("be.visible")
    .type("Change the exclamation mark to a question mark");
  cy.get("[data-testid='tweak-submit-btn']").should("exist").click();

  cy.get("[data-testid='prompt-saving-indicator']")
    .should("be.visible")
    .should("have.text", "Saving...");

  cy.get("[data-testid='prompt-saving-indicator']").should(
    "have.text",
    "Saved",
  );
}

describe("create prompt", () => {
  beforeEach(() => {
    // cy.url().then((url) => cy.intercept(url).as("generate-prompt"));
    cy.visit("/");
    cy.url().should("include", "/prompt");
  });
  it("allows a user to generate a prompt", () => {
    // next and prev buttons hidden
    cy.get("[data-testid='prompt-carousel-next-btn']").should("not.exist");
    cy.get("[data-testid='prompt-carousel-prev-btn']").should("not.exist");

    generatePrompt();

    cy.get("[data-testid='tweak-textarea']")
      .should("exist")
      .contains("Hello world!");

    cy.get("[data-testid='prompt-carousel-next-btn']").should("not.exist");
    cy.get("[data-testid='prompt-carousel-prev-btn']").should("exist").click();

    cy.get("[data-testid='prompt-carousel-prev-btn']").should("not.exist");
    cy.get("[data-testid='prompt-carousel-next-btn']").should("exist");
  });
  it("allows a user to tweak the output", () => {
    generatePrompt();
    tweakPrompt();
    cy.get("[data-testid='tweak-textarea']").contains("Hello world?");
    cy.get("[data-testid='tweak-modal']").should("not.exist");

    // test back and forward buttons
    cy.get("[data-testid='prompt-carousel-next-btn']").should("not.exist");
    cy.get("[data-testid='prompt-carousel-prev-btn']").should("exist").click();

    cy.get("[data-testid='prompt-carousel-next-btn']").should("exist");
    cy.get("[data-testid='prompt-carousel-prev-btn']").should("exist");
  });
  it("loads a previously created prompt", () => {
    generatePrompt();
    tweakPrompt();
    cy.wait(2000);
    cy.reload();

    cy.get("[data-testid='tweak-textarea']").contains("Hello world?");
    cy.get("[data-testid='tweak-modal']").should("not.exist");

    cy.get("[data-testid='prompt-carousel-prev-btn']").should("exist").click();

    cy.get("[data-testid='prompt-textarea']").contains("Write 'Hello world!'");
  });
});
