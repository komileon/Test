/* eslint-disable react-hooks/refs */
import { Link, Quote } from "lucide-react";
import useSelectionRect from "../hooks/useSelectionRect";
import type React from "react";
import type { BNode, NodeTag } from "../types/blog.types";

type FloatingToolbarProps = {
  onReplaceTag: (tag: NodeTag, idNode: string) => void;
  parentPosition: DOMRect | null;
  // currentId: string
  fields: BNode[];
};

const isTag = (fields: BNode[], id: string | null, tag: NodeTag) => {
  if (!id) return false;
  const currentIndex = fields.findIndex((field) => field.id === id);
  if (currentIndex === -1) return false;

  return fields[currentIndex].tag === tag;
};

const FloatingToolbar = ({
  onReplaceTag,
  parentPosition,
  // currentId,
  fields,
}: FloatingToolbarProps) => {
  const { rect, idRef } = useSelectionRect();

  if (!rect || !parentPosition) return null;

  // console.log("Parent: ", parentPosition)
  // console.log("Rect", rect)

  const isTagNodeActive =
    isTag(fields, idRef.current, "h1") ||
    isTag(fields, idRef.current, "h3") ||
    isTag(fields, idRef.current, "blockquote");

  const style: React.CSSProperties = {
    top: rect.top - parentPosition.top - 10,
    left: rect.left - parentPosition.left + rect.width / 2,
  };

  const handleExec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleLink = () => {
    const url = window.prompt("Adresse du lien :", "https://");
    if (url) handleExec("createLink", url);
    // console.log("lien: ", url)
  };

  const handleTagText = (tag: NodeTag) => {
    const currentIndex = fields.findIndex(
      (field) => field.id === idRef.current,
    );
    if (currentIndex === -1) return;
    // console.log(fields[currentIndex].tag)
    if (fields[currentIndex].tag !== tag) {
      onReplaceTag(tag, idRef.current ? idRef.current : "");
    } else {
      onReplaceTag("p", idRef.current ? idRef.current : "");
    }
  };

  return (
    <div
      style={style}
      onMouseDown={(e) => e.preventDefault()}
      className="floating-style absolute z-50 -translate-x-1/2 -translate-y-full bg-zinc-900 text-white h-10 flex gap-2 px-2 max-w-max rounded-sm"
    >
      <div className="flex gap-2">
        <button
          className={`floating-button text-xl ${isTagNodeActive ? "text-neutral-400 pointer-events-none" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleExec("bold");
          }}
        >
          <strong>B</strong>
        </button>
        <button
          className={`floating-button text-xl ${isTagNodeActive ? "text-neutral-400 pointer-events-none" : ""}`}
          onClick={() => handleExec("italic")}
        >
          <em>I</em>
        </button>
        <button
          className={`floating-button ${isTagNodeActive ? "text-neutral-400 pointer-events-none" : ""}`}
          onClick={handleLink}
        >
          <Link size={16} />
        </button>
      </div>
      <div className="w-px bg-zinc-400 my-1"></div>
      <div className="flex gap-2">
        <button
          className={`floating-button text-2xl ${isTag(fields, idRef.current, "h1") ? "text-blue-400" : ""}`}
          onClick={() => handleTagText("h1")}
        >
          T
        </button>
        <button
          className={`floating-button text-md ${isTag(fields, idRef.current, "h3") ? "text-blue-400" : ""}`}
          onClick={() => handleTagText("h3")}
        >
          T
        </button>
        <button
          className={`floating-button ${isTag(fields, idRef.current, "blockquote") ? "text-blue-400" : ""}`}
          onClick={() => handleTagText("blockquote")}
        >
          <Quote size={14} />
        </button>
      </div>
    </div>
  );
};

export default FloatingToolbar;
