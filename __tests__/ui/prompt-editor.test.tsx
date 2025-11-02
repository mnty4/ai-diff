import VersionEditor from "@/app/ui/version-editor";
import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { Version } from "@/app/lib/definitions";

const selectText = (
  element: HTMLElement,
  startOffset: number,
  endOffset: number,
) => {
  // We need to find the inner-most text node to apply the selection range.
  const textNode = element.firstChild?.firstChild;

  if (textNode instanceof Text) {
    const range = document.createRange();
    range.setStart(textNode, startOffset);
    range.setEnd(textNode, endOffset);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

describe("Prompt Editor", () => {
  it("renders the initial text", async () => {
    const version: Version = {
      id: crypto.randomUUID(),
      text: "initial text",
      status: "ready",
    };
    await render(
      <VersionEditor version={version} onUpdateVersion={() => {}} />,
    );
    await expect.element(page.getByText("initial text")).toBeInTheDocument();
  });
  it("updates selected text after selection", async () => {
    const version: Version = {
      id: crypto.randomUUID(),
      text: "initial text",
      status: "ready",
    };
    const onUpdateVersion = vi.fn();
    await render(
      <VersionEditor version={version} onUpdateVersion={onUpdateVersion} />,
    );
    // const editable = page.getByText("initial text");
    const editable = page.getByRole("textbox");
    // const startIndex = 0;
    // const endIndex = editable.length;
    //
    // selectText(editable, startIndex, endIndex);

    // 3. Fire a selection event to notify the editor (required for its onSelect to run)
    // fireEvent.select(editable);
    await editable.click();
    await userEvent.keyboard("{Meta>}a{/Meta}");
    // _.isEqual(onUpdateVersion.mock.calls[0][0], {
    //   ...version,
    //   selection: "initial text",
    // });

    // console.log(window.getSelection());
    // await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    // console.log("here");
    await vi.waitFor(
      () => {
        expect(onUpdateVersion).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
    expect(onUpdateVersion).toBeCalledWith({
      ...version,
      selection: "initial text",
    });
    console.log(window.getSelection());
    // assert that selection is updated.
  });
});
