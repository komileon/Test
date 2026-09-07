import { useEffect, useRef, useState, useCallback } from "react";
import useEditorState from "../hooks/useEditorState";
import Field from "./Field";
import FloatingPlusButton from "./FloatingPlusButton";
import FloatingToolbar from "./FloatingToolbar";
import type { BNode } from "../types/blog.types";

type EditBoxProps = {
  initialFields: BNode[];
  onChange: (fields: BNode[]) => void;
};

const EditBox = ({ initialFields, onChange }: EditBoxProps) => {
  const {
    fields,
    focusUpdate,
    replaceNodeTag,
    updateNode,
    insertNodeText,
    insertNode,
    mergeNodeTextPrevious,
    deleteNode,
    setFocusUpdate,
    moveFocus,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorState(initialFields);

  const [position, setPosition] = useState<number | null>(null);
  const [parentPosition, setParentPosition] = useState<DOMRect | null>(null);
  const [id, setId] = useState<string>("");
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    onChange(fields);
  }, [fields, onChange]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      // console.log("PPPP: ", containerRef.current.getBoundingClientRect())
      setParentPosition(containerRef.current.getBoundingClientRect());
    };

    handleScroll();

    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [position]);

  const handleUndoRedo = useCallback(
    (event: KeyboardEvent) => {
      const isModify = event.ctrlKey || event.metaKey;

      if (!isModify) return;

      const key = event.key.toLowerCase();

      if (key === "z" && canUndo) {
        event.preventDefault();
        undo();
      } else if ((key === "y" || (event.shiftKey && key === "z")) && canRedo) {
        event.preventDefault();
        redo();
      }
    },
    [undo, redo, canUndo, canRedo],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUndoRedo);

    return () => {
      window.removeEventListener("keydown", handleUndoRedo);
    };
  }, [handleUndoRedo]);

  // console.log("Fields: ", fields)

  const handleFocus = (field: BNode, element: HTMLElement | null) => {
    if (!element || element.textContent.length !== 0) {
      setPosition(null);
      return;
    }
    setPosition(element.getBoundingClientRect().top);
    setId(field.id);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-100 flex flex-col gap-6 mb-20">
      <section
        ref={containerRef}
        className="relative w-4/5 md:w-3/5 xl:w-1/2 2xl:w-2/5 px-4 mx-auto mb-10"
      >
        {/* <FloatingToolbar /> */}
        <FloatingToolbar
          fields={fields}
          parentPosition={parentPosition}
          onReplaceTag={(tag, id) => replaceNodeTag(id, tag)}
        />

        {fields.map((field, idx) => (
          <Field
            key={field.id}
            field={field}
            index={idx}
            isOnlyField={fields.length === 1}
            focusUpdate={focusUpdate}
            onUpdate={(fragment) => updateNode(field, fragment)}
            onInsertNodeText={(html) => insertNodeText(field.id, html)}
            onDelete={() => deleteNode(field.id)}
            onHandleFocus={handleFocus}
            onMoveFocus={(move) => moveFocus(field.id, move)}
            setFocusUpdate={setFocusUpdate}
            onMergeNodeTextPrevious={() => mergeNodeTextPrevious(field.id)}
          />
        ))}

        <FloatingPlusButton
          position={position}
          parentPosition={parentPosition}
          onInsertNode={(field) => {
            console.log("INSERT NODE");
            insertNode(id, field);
            console.log("INSERT NODE 2");
          }}
        />
      </section>
    </div>
  );
};

export default EditBox;
