import type React from "react";
import {
  CodeIcon,
  ImageIcon,
  Plus,
  SeparatorHorizontal,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import type { BNode } from "../types/blog.types";
import { createEmptyNode, getAltMedia } from "../utils/blog.utils";
import { Unsplash, Youtube } from "@boxicons/react";

type FloatingPlusProps = {
  position: number | null;
  parentPosition: DOMRect | null;
  onInsertNode: (node: BNode) => void;
};

const FloatingPlusButton = ({
  position,
  parentPosition,
  onInsertNode,
}: FloatingPlusProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const mediaRef = useRef<HTMLInputElement | null>(null);

  if (position === null || parentPosition === null) return;

  // console.log(parentPosition.top, position)

  const style: React.CSSProperties = {
    top: position - parentPosition.top + 11,
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    // console.log(file.type.split("/")[0])
    // console.log(file)
    const types = file.type.split("/")[0];

    // const type = file.type.split("/")

    const url = URL.createObjectURL(file);

    // console.log(file.name)
    // console.log(url)
    let node: BNode;
    if (types === "image") {
      node = createEmptyNode("image");
      if (node.type === "image" && node.image) {
        node.image.url = url;
        node.image.alt = getAltMedia(file.name);
      }
    } else if (types === "video") {
      node = createEmptyNode("video");

      if (node.type === "video" && node.video) {
        node.video.url = url;
        node.video.alt = file.name;
      }
    } else {
      return;
    }

    // console.log(node)
    onInsertNode(node);
    setShowMenu(false);
  };

  const handleCreateNodeByType = (type: "separator" | "code") => {
    const node = createEmptyNode(type);
    onInsertNode(node);
    setShowMenu(false);
  };

  return (
    <div
      style={style}
      className="absolute -translate-x-10 flex gap-4 transition-all duration-200"
    >
      <input
        type="file"
        accept="image/*, video/*"
        ref={mediaRef}
        className="hidden"
        onChange={handleChangeFile}
      />

      <button
        className="floating-plus-button-first"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? <X strokeWidth={1} /> : <Plus strokeWidth={1} />}
      </button>

      {showMenu && (
        <div className="flex gap-4 transition-all duration-1000 ease-in">
          <button
            className="floating-plus-button"
            title="add a media"
            onClick={(e) => {
              e.preventDefault();
              mediaRef.current?.click();
            }}
          >
            <ImageIcon size={18} strokeWidth={1} />
          </button>

          <button
            className="floating-plus-button"
            onClick={() => {
              const node = createEmptyNode("image");
              if (node.image) {
                node.image.isExtenalData = true;
                onInsertNode(node);
                setShowMenu(false);
              }
            }}
          >
            <Unsplash className="w-4 h-4" />
          </button>

          <button
            className="floating-plus-button"
            onClick={() => {
              const node = createEmptyNode("video");
              if (node.video) {
                node.video.isExtenalData = true;
                onInsertNode(node);
                setShowMenu(false);
              }
            }}
          >
            <Youtube className="w-5 h-5" />
          </button>

          <button
            className="floating-plus-button"
            onClick={() => handleCreateNodeByType("code")}
          >
            <CodeIcon size={18} strokeWidth={1} />
          </button>

          <button
            className="floating-plus-button"
            title="separator"
            onClick={() => handleCreateNodeByType("separator")}
          >
            <SeparatorHorizontal strokeWidth={1} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingPlusButton;
