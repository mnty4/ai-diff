import { useCallback, useState } from "react";
import { Editable, RenderElementProps, Slate, withReact } from "slate-react";
import { createEditor, Editor, Element, Range, Transforms, Node } from "slate";

import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { Version } from "@/app/lib/definitions";
import Toolbar from "@/app/ui/Toolbar";
import clsx from "clsx";

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

export default function VersionEditor({
  version,
  onUpdateVersion,
}: {
  version: Version;
  onUpdateVersion?: (
    id: string,
    payload: Version | ((prev: Version) => Version),
  ) => void;
}) {
  const initialValue: ParagraphElement[] = [
    {
      type: "paragraph",
      children: [{ text: version.text }],
    },
  ];
  const [editor] = useState(
    () => withInlines(withReact(createEditor())) as Editor,
  );

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

  const selectText = useCallback(() => {
    if (editor.selection && !Range.isCollapsed(editor.selection)) {
      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "selection",
        at: [],
        split: false,
      });
      Transforms.wrapNodes(
        editor,
        {
          type: "selection",
          children: [{ text: "" }],
        },
        {
          split: true,
        },
      );
      return Editor.string(editor, editor.selection);
    }
    return "";
  }, [editor]);

  const handleSelection = useCallback(() => {
    if (!version.selectionActive) {
      return;
    }
    const selectedText = selectText();
    if (selectedText) {
      onUpdateVersion?.(version.id, {
        ...version,
        selection: selectedText,
      });
    }
  }, [onUpdateVersion, selectText, version]);

  const toggleSelectionActive = useCallback(() => {
    onUpdateVersion?.(version.id, (prev) => {
      if (prev.selectionActive) {
        Transforms.unwrapNodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "selection",
          at: [],
          split: false,
        });
        return { ...prev, selectionActive: false };
      } else {
        const selectedText = selectText();
        return { ...prev, selection: selectedText, selectionActive: true };
      }
    });
  }, [editor, onUpdateVersion, selectText, version.id]);

  return (
    <div className="bg-gray-900 rounded-xl w-full h-full">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onValueChange={(nodes) => {
          onUpdateVersion?.(version.id, (prev) => ({
            ...prev,
            text: nodes.map((node) => Node.string(node)).join("\n"),
          }));
        }}
      >
        <Toolbar>
          <SelectButton
            active={version.selectionActive}
            onToggleSelectionActive={toggleSelectionActive}
          />
        </Toolbar>
        <Editable
          data-testid="version-editor"
          renderElement={renderElement}
          onSelect={handleSelection}
          className="h-full w-full p-4 border-none outline-none resize-none bg-transparent"
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

const SelectButton = ({
  active,
  onToggleSelectionActive,
}: {
  active?: boolean;
  onToggleSelectionActive: () => void;
}) => {
  return (
    <button
      className={clsx([
        "text-lg font-bold w-8 h-8 rounded-md cursor-pointer",
        active ? "text-gray-300 bg-gray-900" : "bg-gray-300 text-gray-900",
      ])}
      onPointerDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        onToggleSelectionActive();
      }}
    >
      S
    </button>
  );
};
