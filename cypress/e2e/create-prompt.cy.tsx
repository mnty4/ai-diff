function generatePrompt() {
  cy.url().should("include", "/create");
  cy.get("[data-testid='prompt-textarea']")
    .should("be.visible")
    .type("Write 'Hello world!'");
  cy.get("[data-testid='tweak-btn']").should("not.exist");
  cy.get("[data-testid='generate-btn']").should("exist").click();
  cy.wait("@create-prompt");
}
function tweakPrompt() {
  cy.get("[data-testid='tweak-btn']").should("exist").click();
  cy.get("[data-testid='tweak-modal']").should("exist");
  cy.get("[data-testid='tweak-modal-textarea']")
    .should("be.visible")
    .type("Change the exclamation mark to a question mark");
  cy.get("[data-testid='tweak-submit-btn']").should("exist").click();

  cy.wait("@create-prompt");
}

describe("create prompt", () => {
  beforeEach(() => {
    cy.intercept("/create").as("create-prompt");
    cy.visit("/");
  });
  it("allows a user to generate a prompt", () => {
    generatePrompt();
    cy.get("@create-prompt")
      .its("request.body")
      .then((body) => {
        const parsed = JSON.parse(body);
        expect(parsed[0]).to.equal("Write 'Hello world!'");
      });
    cy.get("[data-testid='tweak-textarea']")
      .should("exist")
      .contains("Hello world!");
  });
  it("allows a user to tweak the output", () => {
    generatePrompt();
    tweakPrompt();
    cy.get("[data-testid='tweak-textarea']").contains("Hello world?");
    cy.get("[data-testid='tweak-modal']").should("not.exist");
  });
});
