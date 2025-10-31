import { useCallback, useState } from "react";
import { Editable, RenderElementProps, Slate, withReact } from "slate-react";
import { createEditor, Editor, Element, Range, Transforms } from "slate";

import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type ParagraphElement = { type: "paragraph"; children: CustomText[] };
type SelectionElement = { type: "selection"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ParagraphElement | SelectionElement;
    Text: CustomText;
  }
}

export default function PromptEditor({
  prompt,
  onUpdatePrompt,
}: {
  prompt: string;
  onUpdatePrompt?: (value: string) => void;
}) {
  const initialValue: ParagraphElement[] = [
    {
      type: "paragraph",
      children: [{ text: prompt }],
    },
  ];
  const [editor] = useState(
    () => withInlines(withReact(createEditor())) as Editor,
  );
  const selectionNode: SelectionElement = {
    type: "selection", // Type assertion needed here
    children: [{ text: "" }],
  };

  const renderElement = useCallback(
    ({ attributes, children, element }: RenderElementProps) => {
      switch (element.type) {
        case "selection":
          console.log("selection", attributes);
          return (
            <span {...attributes} className="bg-purple-800">
              {children}
            </span>
          );
        default:
          return <span {...attributes}>{children}</span>;
      }
    },
    [],
  );
  return (
    <div className="bg-gray-900 rounded-xl p-4 w-full h-full">
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          renderElement={renderElement}
          onSelect={(e) => {
            if (editor.selection && !Range.isCollapsed(editor.selection)) {
              Transforms.unwrapNodes(editor, {
                match: (n) => Element.isElement(n) && n.type === "selection",
                at: [],
                split: true,
              });
              Transforms.wrapNodes(editor, selectionNode, {
                split: true,
              });
            }
          }}
          className="h-full w-full border-none outline-none resize-none bg-transparent"
        />
      </Slate>
    </div>
  );
}

const withInlines = (editor: Editor) => {
  const { isInline } = editor;

  editor.isInline = (element: Element) =>
    element.type === "selection" || isInline(element);

  return editor;
};
