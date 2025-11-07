import { useCallback, useState } from "react";
import { Editable, RenderElementProps, Slate, withReact } from "slate-react";
import { createEditor, Editor, Element, Range, Transforms, Node } from "slate";

import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { Version } from "@/app/lib/definitions";
import Toolbar from "@/app/ui/Toolbar";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import { updateVersion } from "@/app/lib/slices/PromptSlice";

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
  initialVersion,
}: {
  initialVersion: Version;
}) {
  const versionState = useAppSelector((state) =>
    state.activePrompt.entity?.versions.find((v) => v.id === initialVersion.id),
  );

  const version = versionState ?? initialVersion;
  const dispatch = useAppDispatch();

  const [editor] = useState(
    () => withInlines(withReact(createEditor())) as Editor,
  );

  const initialValue: ParagraphElement[] = [
    {
      type: "paragraph",
      children: [{ text: version.text }],
    },
  ];

  const onUpdateVersion = useCallback(
    (value: Partial<Version>) => {
      dispatch(updateVersion({ id: version.id, updates: value }));
    },
    [dispatch, version.id],
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
      onUpdateVersion?.({
        selection: selectedText,
      });
    }
  }, [onUpdateVersion, selectText, version]);

  const toggleSelectionActive = useCallback(() => {
    if (version.selectionActive) {
      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "selection",
        at: [],
        split: false,
      });
      onUpdateVersion?.({ selectionActive: false });
    } else {
      const selectedText = selectText();
      onUpdateVersion?.({
        selection: selectedText,
        selectionActive: true,
      });
    }
  }, [editor, onUpdateVersion, selectText, version]);

  return (
    <div className="bg-gray-900 rounded-xl w-full h-full">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onValueChange={(nodes) =>
          onUpdateVersion?.({
            text: nodes.map((node) => Node.string(node)).join("\n"),
          })
        }
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
