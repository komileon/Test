import { useCallback, useState } from "react";
import type { BNode, NodeTag } from "../types/blog.types";
import { createEmptyNode } from "../utils/blog.utils";
import useUndoRedo from "./useUndoRedo";

export type Move = "up" | "down";

export type CursorPositionType =
  | "start"
  | "end"
  | {
      positionNode: number;
      lastTextLength?: number;
    };

export type FocusUpdateType = {
  id: string;
  position: CursorPositionType;
} | null;

const useEditorState = (initialFields: BNode[]) => {
  // hooks
  const {
    present: fields,
    setUpdate: setFields,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<BNode[]>(
    initialFields && initialFields.length > 0
      ? initialFields
      : [createEmptyNode("text")],
  );
  // const [fields, setFields] = useState<BNode[]>(
  //   initialFields && initialFields.length > 0
  //     ? initialFields
  //     : [createEmptyNode("text")],
  // );
  const [focusUpdate, setFocusUpdate] = useState<FocusUpdateType>(null);
  // const prevIdRef = useRef<string>(null);

  // replaceNodeTag
  const replaceNodeTag = useCallback(
    (currentId: string, tag: NodeTag) => {
      console.log("currentId: ", currentId);
      setFields((prev) =>
        prev.map((field) =>
          field.id === currentId ? { ...field, tag } : field,
        ),
      );
      setFocusUpdate({
        id: currentId,
        position: "end",
      });
    },
    [setFields],
  );

  // updateNode
  const updateNode = useCallback(
    (node: BNode, fragment: Partial<BNode>) => {
      setFields((prev) =>
        prev.map((field) =>
          field.id === node.id ? { ...field, ...fragment } : field,
        ),
      );
    },
    [setFields],
  );

  // insertNodeText
  const insertNodeText = useCallback(
    (currentId: string, html: BNode["html"] = "") => {
      console.log("INSERT TEXT");
      const newField: BNode = createEmptyNode("text");

      setFields((prev) => {
        const currentIndex = prev.findIndex((field) => field.id === currentId);

        if (currentIndex === -1) return [...prev, { ...newField, html }];

        const updateFields = [...prev];
        updateFields.splice(currentIndex + 1, 0, {
          ...newField,
          html,
        });
        setFocusUpdate({
          id: newField.id,
          position: "start",
        });
        return updateFields;
      });
    },
    [setFields],
  );

  // insertNode
  const insertNode = useCallback(
    (currentId: string, node: BNode) => {
      console.log("INSERT NODE");
      const newNode = createEmptyNode("text");
      setFields((prev) => {
        const currentIndex = prev.findIndex((field) => field.id === currentId);

        console.log("currentIdx", currentIndex);

        if (currentIndex === -1) return [...prev, node];

        const updateFields = [...prev];
        if (node.type === "separator") {
          updateFields.splice(currentIndex + 1, 0, node, newNode);
          console.log("updateFields", updateFields);
          setFocusUpdate({
            id: newNode.id,
            position: "end",
          });
          return updateFields;
        }

        if (currentIndex === 0) {
          updateFields.splice(currentIndex + 1, 0, node, newNode);
          setFocusUpdate({
            id: node.id,
            position: "start",
          });
          return updateFields;
        }
        if (
          currentIndex < prev.length - 1 &&
          prev[currentIndex + 1].type === "text"
        ) {
          updateFields.splice(currentIndex, 1, node);
          setFocusUpdate({
            id: node.id,
            position: "start",
          });
          return updateFields;
        }

        updateFields.splice(currentIndex, 0, node);
        setFocusUpdate({
          id: node.id,
          position: "start",
        });
        return updateFields;
      });
      console.log("INSERT NODE 555");
    },
    [setFields],
  );

  // mergeNodePrevious
  const mergeNodeTextPrevious = useCallback(
    (currentId: string) => {
      setFields((prev) => {
        const currentIndex = prev.findIndex((field) => field.id === currentId);
        const current = prev[currentIndex];
        if (currentIndex <= 0) {
          return prev;
        }
        const previous = prev[currentIndex - 1];
        if (previous.type === "separator") {
          const updateFields = [...prev];
          updateFields.splice(currentIndex - 1, 1);
          setFocusUpdate({
            id: currentId,
            position: "start",
          });
          return updateFields;
        }
        if (previous.type !== "text" || currentIndex <= 0) {
          setFocusUpdate({
            id: previous.id,
            position: "end",
          });
          return prev;
        }

        const mergedHtml = previous.html + current.html;
        const updateFields = [...prev];
        updateFields.splice(currentIndex - 1, 2, {
          ...previous,
          html: mergedHtml,
        });
        // prevIdRef.current = previous.id;
        // console.error(previous.id, prevIdRef.current);

        const div = document.createElement("div");
        div.innerHTML = previous.html;
        const positionNode = div.childNodes.length;
        if (positionNode >= 1) {
          const lastNode = div.childNodes[positionNode - 1];
          if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
            const lastTextLength = lastNode.textContent?.length;
            setFocusUpdate({
              id: previous.id,
              position: {
                positionNode,
                lastTextLength,
              },
            });
            return updateFields;
          }
        }

        setFocusUpdate({
          id: previous.id,
          position: { positionNode },
        });

        return updateFields;
      });
    },
    [setFields],
  );

  // deleteNode
  const deleteNode = useCallback(
    (currentId: string) => {
      console.log("Delete");
      const newNode = createEmptyNode("text");
      setFields((prev) => {
        if (prev.length === 1) {
          setFocusUpdate({
            id: newNode.id,
            position: "end",
          });
          return [newNode];
        }

        const currentIndex = prev.findIndex((field) => field.id === currentId);
        if (currentIndex === -1) return prev;

        if (currentIndex === 0 && prev[currentIndex].type === "text") {
          setFocusUpdate({
            id: currentId,
            position: "start",
          });
          return prev;
        }
        if (
          currentIndex > 0 &&
          currentIndex < prev.length &&
          prev[currentIndex].type === "text" &&
          prev[currentIndex - 1].type === "separator"
        ) {
          const updateFields = [...prev];
          updateFields.splice(currentIndex - 1, 1);
          console.log(updateFields);

          setFocusUpdate({
            id: currentId,
            position: "start",
          });
          console.log("object 44");
          return updateFields;
        }
        if (
          currentIndex === prev.length - 1 &&
          prev[currentIndex].type === "text" &&
          prev[currentIndex - 1].type !== "text"
        ) {
          const prevId = prev[currentIndex - 1].id;

          setFocusUpdate({
            id: prevId,
            position: "end",
          });
          return prev;
        }
        if (
          currentIndex < prev.length - 1 &&
          prev[currentIndex].type !== "text" &&
          ((prev[currentIndex + 1].type === "text" &&
            prev[currentIndex + 1].html.trim() !== "") ||
            prev[currentIndex + 1].type !== "text")
        ) {
          const updateFields = [...prev];

          updateFields.splice(currentIndex, 1, newNode);

          setFocusUpdate({
            id: newNode.id,
            position: "start",
          });
          return updateFields;
        }

        const updateFields = prev.filter((field) => field.id !== currentId);

        if (currentIndex === 0 && prev[currentIndex + 1].type !== "text") {
          return updateFields;
        }
        if (currentIndex === 0 && prev[currentIndex + 1].type === "text") {
          const nextId = prev[currentIndex + 1].id;

          setFocusUpdate({
            id: nextId,
            position: "end",
          });
          return updateFields;
        }

        const prevId = prev[currentIndex - 1].id;

        setFocusUpdate({
          id: prevId,
          position: "end",
        });
        return updateFields;
      });
    },
    [setFields],
  );
  // moveFocus
  const moveFocus = useCallback(
    (currentId: string, move: Move) => {
      setFields((prev) => {
        const currentIndex = prev.findIndex((field) => field.id === currentId);
        if (
          currentIndex === -1 ||
          (currentIndex === 0 && move === "up") ||
          (currentIndex === 0 && currentIndex === prev.length - 1) ||
          (currentIndex === prev.length - 1 && move === "down")
        )
          return prev;

        const index = move === "up" ? currentIndex - 1 : currentIndex + 1;

        setFocusUpdate({
          id: prev[index].id,
          position: "end",
        });
        return prev;
      });
    },
    [setFields],
  );

  return {
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
  };
};

export default useEditorState;
