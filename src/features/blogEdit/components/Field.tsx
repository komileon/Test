import React, { createElement, useEffect, useRef } from "react";
import type { BNode } from "../types/blog.types";
import FieldImage from "./FieldImage";
import FieldVideo from "./FieldVideo";
import Separator from "./Separator";
import type { FocusUpdateType, Move } from "../hooks/useEditorState";
import {
  clearElement,
  isEmptyElement,
  sanitizeHtml,
} from "../utils/blog.utils";
import FieldCodeBox from "./FieldCodeBox";

interface BNodeProps {
  field: BNode;
  index: number;
  onUpdate: (fragment: Partial<BNode>) => void;
  onInsertNodeText: (html: BNode["html"]) => void;
  onDelete: () => void;
  onMergeNodeTextPrevious: () => void;
  onHandleFocus: (field: BNode, element: HTMLElement | null) => void;
  focusUpdate: FocusUpdateType;
  setFocusUpdate: (focusUpdate: FocusUpdateType) => void;
  isOnlyField: boolean;
  onMoveFocus: (move: Move) => void;
}

const Field = ({
  field,
  index,
  isOnlyField,
  focusUpdate,
  onUpdate,
  onInsertNodeText,
  onDelete,
  onHandleFocus,
  setFocusUpdate,
  onMergeNodeTextPrevious,
  onMoveFocus,
}: BNodeProps) => {
  const nodeRef = useRef<HTMLElement | null>(null);
  const isEmpty = isEmptyElement(field.html);

  useEffect(() => {
    if (!nodeRef.current) return;

    const node = nodeRef.current;

    if (index === 0 && isOnlyField) {
      nodeRef.current.focus();
    }

    if (
      nodeRef.current.innerHTML !== field.html ||
      nodeRef.current.tagName.trim().toLowerCase() !== field.tag
    ) {
      if (["h1", "h3", "blockquote"].includes(field.tag)) {
        nodeRef.current.innerHTML = clearElement(field.html);
        // console.log(clearElement(field.html))
      } else {
        nodeRef.current.innerHTML = field.html;
      }

      // console.log("Change Content")
      onHandleFocus(field, nodeRef.current);
      // setFocusUpdate({
      //     id: field.id,
      //     position: "end"
      // })
    }
    if (focusUpdate && focusUpdate.id === field.id) {
      const range = document.createRange();
      const selection = window.getSelection();
      if (!selection) return;

      const textNode = nodeRef.current;

      range.selectNodeContents(textNode);
      console.log(focusUpdate.id, focusUpdate.position);

      if (focusUpdate.position === "start") {
        range.collapse(true);
        // console.log("START");
      } else if (focusUpdate.position === "end") {
        range.collapse(false);
        // console.log("END");
      } else if (typeof focusUpdate.position === "object") {
        if (focusUpdate.position.lastTextLength) {
          range.setStart(
            textNode.childNodes[focusUpdate.position.positionNode - 1],
            focusUpdate.position.lastTextLength,
          );
          range.setEnd(
            textNode.childNodes[focusUpdate.position.positionNode - 1],
            focusUpdate.position.lastTextLength,
          );
        } else {
          range.setStart(textNode, focusUpdate.position.positionNode);
          range.setEnd(textNode, focusUpdate.position.positionNode);
        }
      }

      selection.removeAllRanges();
      selection.addRange(range);
      nodeRef.current.focus();
      setFocusUpdate(null);
    }
    window.addEventListener("scroll", () => {
      onHandleFocus(field, node);
    });

    return () => {
      window.removeEventListener("scroll", () => {
        onHandleFocus(field, node);
      });
    };
  }, [field, onHandleFocus, index, isOnlyField, focusUpdate, setFocusUpdate]);

  if (field.type === "image") {
    return (
      <FieldImage
        field={field}
        onDelete={onDelete}
        onUpdate={onUpdate}
        focus={focusUpdate}
        onHandleFocus={onHandleFocus}
        onMoveFocus={onMoveFocus}
      />
    );
  }
  if (field.type === "separator") {
    return <Separator />;
  }

  if (field.type === "video") {
    return (
      <FieldVideo
        field={field}
        onDelete={onDelete}
        onUpdate={onUpdate}
        focus={focusUpdate}
        onHandleFocus={onHandleFocus}
        onMoveFocus={onMoveFocus}
      />
    );
  }
  if (field.type === "code") {
    onHandleFocus(field, null);
    return (
      <FieldCodeBox
        onDelete={onDelete}
        focus={focusUpdate}
        setFocus={setFocusUpdate}
        onUpdate={onUpdate}
        field={field}
      />
    );
  }

  const handleInput = (event: React.InputEvent<HTMLElement>) => {
    // console.log(event.currentTarget.innerHTML)
    console.log("PUT");
    onUpdate({ html: sanitizeHtml(event.currentTarget.innerHTML) });
    if (nodeRef.current && isEmptyElement(event.currentTarget.innerHTML)) {
      onHandleFocus(field, nodeRef.current);
      // console.log("Show Plus Button")
    } else if (
      nodeRef.current &&
      !isEmptyElement(event.currentTarget.innerHTML)
    ) {
      onHandleFocus(field, null);
      // console.log("Show Plus Button")
    }
  };
  const handlePaste = (event: React.ClipboardEvent<HTMLElement>) => {
    event.preventDefault();
    // console.log("PASTE")

    const textPaste = event.clipboardData.getData("text/plain");
    // console.log(textPaste)
    const div = document.createElement("div");
    div.innerHTML = textPaste;
    const textBrut = div.textContent;
    // console.log(textBrut)
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    range.deleteContents();
    // console.log(range)
    const node = document.createTextNode(textBrut);
    // console.log(node)

    range.insertNode(node);
    // console.log(range)

    range.setEndAfter(node);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);

    if (!nodeRef.current) return;

    const html = nodeRef.current.textContent;

    onUpdate({ html });
    onHandleFocus(field, null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const textNode = nodeRef.current;
    if (!textNode) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // console.log(textNode)
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }
      const range = selection.getRangeAt(0);

      const startRange = range.cloneRange();
      startRange.selectNodeContents(textNode);
      startRange.setEnd(range.startContainer, range.startOffset);
      const startDiv = document.createElement("div");
      startDiv.appendChild(startRange.cloneContents());

      const endRange = range.cloneRange();
      endRange.selectNodeContents(textNode);
      endRange.setStart(range.endContainer, range.endOffset);
      const endDiv = document.createElement("div");
      endDiv.appendChild(endRange.cloneContents());

      // console.log("Start", startDiv.innerHTML)
      // console.log("End", endDiv.innerHTML)

      onUpdate({ html: startDiv.innerHTML });
      onInsertNodeText(endDiv.innerHTML);
    } else if (event.key === "Backspace") {
      // event.preventDefault()
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }

      const isStart = selection.anchorOffset === 0 && selection.isCollapsed;

      // console.log(selection)

      if (isStart) {
        event.preventDefault();
        if (isEmpty && !isOnlyField) {
          onDelete();
          onHandleFocus(field, null);
        } else if (!isEmpty && !isOnlyField) {
          // !isEmpty || isOnlyField
          onMergeNodeTextPrevious();
        }
      }
    } else if (event.key === "ArrowUp") {
      // console.log(event.key)
      // console.log(field.id)
      onMoveFocus("up");
    } else if (event.key === "ArrowDown") {
      // console.log(event.key)
      onMoveFocus("down");
    }
    // else if (event.key === "ArrowRight") {
    //     console.log(event.key)
    // }
    // else if (event.key === "ArrowLeft") {
    //     const selection = window.getSelection()
    //     if (!selection || !selection.rangeCount) {
    //         return
    //     }

    //     console.log(event.key)
    //     const isStart = selection.anchorOffset === 0 && selection.isCollapsed

    //     if (isStart) {
    //         onMoveFocus("up")
    //     }
    // }
  };

  return createElement(
    field.tag,
    // eslint-disable-next-line react-hooks/refs
    {
      ref: nodeRef,
      "data-id": field.id,
      "data-index": index,
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: "text-field-style",
      spellCheck: false,
      onInput: handleInput,
      onPaste: handlePaste,
      onKeyDown: handleKeyDown,
      onFocus: () => nodeRef.current && onHandleFocus(field, nodeRef.current),
    },
  );
};

export default Field;
