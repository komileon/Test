import { Trash2Icon } from "lucide-react";
import type { BNode } from "../types/blog.types";
import React, { useEffect, useRef, useState } from "react";
import type { FocusUpdateType, Move } from "../hooks/useEditorState";
import {
  extractYoutubeId,
  isEmptyElement,
  isYoutubeUrl,
} from "../utils/blog.utils";
import InsetCenter from "./icons/InsetCenter";
import OutsetCenter from "./icons/OutsetCenter";

type FieldVideoProps = {
  field: BNode;
  onDelete: () => void;
  onUpdate: (fragment: Partial<BNode>) => void;
  focus: FocusUpdateType;
  onHandleFocus: (field: BNode, element: HTMLElement | null) => void;
  onMoveFocus: (move: Move) => void;
};

const FieldVideo = ({
  field,
  onDelete,
  onUpdate,
  onHandleFocus,
  onMoveFocus,
  focus,
}: FieldVideoProps) => {
  const [showVideoTab, setShowVideoTab] = useState(false);
  const [switchMediaSize, setswitchMediaSize] = useState<number>(
    field.video?.size?.width ? field.video.size.width : 100,
  );
  const [isEmpty, setIsEmpty] = useState(
    isEmptyElement(field.video?.label ? field.video.label : ""),
  );
  const [mediaLabel, setMediaLabel] = useState(
    field.video?.label ? field.video.label : "",
  );
  const [linkYt, setLinkYt] = useState("");
  const [ytError, setYtError] = useState<string | null>(null);
  const MediaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (labelRef.current) {
      const label = field.video ? field.video?.label : "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (label) setIsEmpty(false);
      labelRef.current.innerHTML = label;
    }
  }, [field]);

  useEffect(() => {
    if (!focus) return;

    if (
      labelRef.current &&
      field.video &&
      labelRef.current.innerHTML !== field.video.label
    ) {
      const label = field.video.label;
      labelRef.current.innerHTML = label;
    }

    if (focus.id === field.id) {
      onHandleFocus(field, null);
      if (MediaRef.current) MediaRef.current.focus();
    }
  }, [focus, field, onHandleFocus]);

  useEffect(() => {
    const handleSave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // console.log("Quit")
      onUpdate({
        image: {
          url: field.image ? field.image.url : "",
          alt: field.image ? field.image.alt : "",
          label: mediaLabel,
          size: {
            width: switchMediaSize,
          },
        },
      });
    };

    window.addEventListener("beforeunload", handleSave);

    return () => {
      window.removeEventListener("beforeunload", handleSave);
    };
  }, [field.image, mediaLabel, onUpdate, switchMediaSize]);

  const inputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && isEmptyElement(linkYt)) {
      e.preventDefault();
      onDelete();
    }

    if (e.key === "Enter" && !e.shiftKey && linkYt.trim()) {
      e.preventDefault();
      const id = extractYoutubeId(linkYt.trim());
      // console.log("ID: ", id)
      if (id) {
        onUpdate({
          video: {
            url: `https://www.youtube.com/embed/${id}`,
            alt: "Youtube video",
            label: "",
          },
        });
      } else {
        setYtError("The link is incorrect");
      }
    }
  };

  if (!field.video?.url && field.video?.isExtenalData === true) {
    return (
      <div className="w-full">
        <input
          autoFocus
          type="text"
          onChange={(e) => {
            setLinkYt(e.currentTarget.value);
          }}
          placeholder="Paste a YouTube video link, and press Enter"
          onKeyDown={inputKeyDown}
          className="w-full outline-0 border-b border-b-neutral-300 p-2 focus:border-b-neutral-500 transition-all duration-200"
        />
        {ytError && <span className="text-red-400">{ytError}</span>}
      </div>
    );
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    console.log(event.key, event);
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      onDelete();
    } else if (event.key === "ArrowUp") {
      // console.log(event.key);
      onMoveFocus("up");
    } else if (event.key === "ArrowDown") {
      // console.log(event.key);
      onMoveFocus("down");
    } else if (event.key === "ArrowLeft") {
      // console.log(event.key);
      onMoveFocus("up");
    } else if (event.key === "ArrowRight") {
      // console.log(event.key);
      onMoveFocus("down");
    }
  };

  const handleAlwaysFocus = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!MediaRef.current) return;
    MediaRef.current.focus();
  };

  return (
    <figure
      className={`relative my-8 mx-auto ${switchMediaSize === 100 ? "w-full" : "w-[150%] left-1/2 -translate-x-1/2"}`}
    >
      <div
        ref={MediaRef}
        tabIndex={0}
        onFocus={() => setShowVideoTab(true)}
        onBlur={(e) => {
          // console.log("BLUR");
          setShowVideoTab(false);
          onUpdate({
            video: {
              url: field.video ? field.video.url : "",
              alt: field.video ? field.video.alt : "",
              label: isEmptyElement(e.currentTarget.innerHTML)
                ? ""
                : e.currentTarget.innerHTML.trim(),
              size: {
                width: switchMediaSize,
              },
            },
          });
        }}
        onKeyDown={handleKeyDown}
        className="min-w-full outline-0 ring-2 ring-transparent hover:ring-blue-400 focus:ring-4 focus:ring-blue-500"
      >
        {isYoutubeUrl(field.video?.url ? field.video.url : "") ? (
          <iframe
            width="100%"
            height="350"
            src={field.video?.url}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; 
                            encrypted-media; gyroscope;"
            className="pointer-events-none"
          ></iframe>
        ) : (
          <video controls className="w-full">
            <source src={field.video?.url} />
          </video>
        )}
      </div>
      <figcaption
        ref={labelRef}
        className={`label relative text-xs border-0 outline-0 min-w-48 w-max max-w-1/2 leading-normal my-2 mx-auto text-zinc-600 ${isEmpty ? "isEmpty" : "text-center"}`}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          // console.log(isEmptyElement(e.currentTarget.innerHTML));
          setIsEmpty(isEmptyElement(e.currentTarget.innerHTML));
          setMediaLabel(
            isEmptyElement(e.currentTarget.innerHTML)
              ? ""
              : e.currentTarget.innerHTML.trim(),
          );
        }}
        onBlur={(e) => {
          if (!e) {
            return;
          }
          onUpdate({
            video: {
              url: field.video ? field.video.url : "",
              alt: field.video ? field.video.alt : "",
              label: isEmptyElement(e.currentTarget.innerHTML)
                ? ""
                : e.currentTarget.innerHTML.trim(),
            },
          });
        }}
      />
      {showVideoTab && (
        <div
          onMouseDown={handleAlwaysFocus}
          className="floating-style absolute -top-11 left-1/2 -translate-x-1/2 bg-zinc-900 text-white h-9 flex gap-4 px-2 max-w-max rounded-sm"
        >
          <div className="flex gap-4">
            <button
              onMouseDown={() => setswitchMediaSize(100)}
              className={`cursor-pointer ${switchMediaSize === 100 ? "text-blue-400" : ""}`}
            >
              <InsetCenter />
            </button>
            <button
              onMouseDown={() => setswitchMediaSize(150)}
              className={`cursor-pointer ${switchMediaSize === 150 ? "text-blue-400" : ""}`}
            >
              <OutsetCenter />
            </button>
          </div>
          {/* <button
                        className="cursor-pointer text-blue-400"
                        onClick={() => setswitchMediaSize((prev) => !prev)}
                    >
                        {switchMediaSize ? (
                            <GalleryHorizontalIcon size={18} />
                        ) : (
                            <GalleryVerticalIcon size={18} />
                        )}
                    </button> */}
          <div className="w-px bg-zinc-400 my-1"></div>
          <button
            className="cursor-pointer hover:text-red-400"
            onClick={onDelete}
          >
            <Trash2Icon size={18} />
          </button>
        </div>
      )}
    </figure>
  );
};

export default FieldVideo;
