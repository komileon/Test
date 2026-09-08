import { Trash2Icon } from "lucide-react";
import type { BNode } from "../types/blog.types";
import React, { useEffect, useRef, useState } from "react";
import type { FocusUpdateType, Move } from "../hooks/useEditorState";
import UnsplashSearchImage from "./UnsplashSearchImage";
import { isEmptyElement } from "../utils/blog.utils";
import InsetCenter from "./icons/InsetCenter";
import OutsetCenter from "./icons/OutsetCenter";

type FieldImageProps = {
  field: BNode;
  onDelete: () => void;
  onUpdate: (fragment: Partial<BNode>) => void;
  focus: FocusUpdateType;
  onHandleFocus: (field: BNode, element: HTMLElement | null) => void;
  onMoveFocus: (move: Move) => void;
};

const FieldImage = ({
  field,
  onDelete,
  onUpdate,
  onHandleFocus,
  onMoveFocus,
  focus,
}: FieldImageProps) => {
  const [showImageTab, setShowImageTab] = useState(false);
  const [switchMediaSize, setswitchMediaSize] = useState<number>(
    field.image?.size?.width ? field.image.size.width : 100,
  );
  const [isEmpty, setIsEmpty] = useState(
    isEmptyElement(field.image?.label ? field.image.label : ""),
  );
  const [mediaLabel, setMediaLabel] = useState(
    field.image?.label ? field.image.label : "",
  );
  const MediaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (labelRef.current) {
      const label = field.image?.label ? field.image.label : "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (label) setIsEmpty(false);
      // console.log("label: ", label)
      labelRef.current.innerHTML = label;
    }
  }, [field]);

  useEffect(() => {
    if (!focus) return;

    if (
      labelRef.current &&
      field.image?.label &&
      labelRef.current.innerHTML !== field.image.label
    ) {
      const label = field.image.label;
      // console.log("label3: ", label)
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

  if (!field.image?.url && field.image?.isExtenalData === true) {
    return <UnsplashSearchImage onUpdate={onUpdate} />;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // console.log(event.key, event);
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
      className={`relative my-8 mx-auto left-1/2 -translate-x-1/2 ${switchMediaSize === 100 ? "w-full" : "w-[150%]"}`}
    >
      <div
        ref={MediaRef}
        tabIndex={0}
        className="w-full outline-0 ring-2 ring-transparent hover:ring-blue-400 focus:ring-4 focus:ring-blue-500"
        onFocus={() => {
          setShowImageTab(true);
        }}
        onBlur={() => {
          // console.log("BLUR");
          setShowImageTab(false);
          // onUpdate({
          //     image: {
          //         url: field.image ? field.image.url : "",
          //         alt: field.image ? field.image.alt : "",
          //         label: mediaLabel,
          //         size: {
          //             width: switchMediaSize
          //         }
          //     },
          // });
        }}
        onKeyDown={handleKeyDown}
      >
        <img src={field.image?.url} alt={field.image?.alt} className="w-full" />
      </div>
      <figcaption
        ref={labelRef}
        className={`label relative text-xs border-0 outline-0 min-w-48 w-max max-w-1/2 min-h-5 leading-normal my-2 mx-auto text-zinc-600 ${isEmpty ? "isEmpty" : "text-center"}`}
        spellCheck="false"
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          // console.log(isEmptyElement(e.currentTarget.innerHTML));
          // console.log("Red")
          setIsEmpty(isEmptyElement(e.currentTarget.innerHTML));
          setMediaLabel(
            isEmptyElement(e.currentTarget.innerHTML)
              ? ""
              : e.currentTarget.innerHTML.trim(),
          );
        }}
        onBlur={(e) => {
          console.log("Child");
          if (!e) {
            return;
          }
          onUpdate({
            image: {
              url: field.image ? field.image.url : "",
              alt: field.image ? field.image.alt : "",
              label: isEmptyElement(e.currentTarget.innerHTML)
                ? ""
                : e.currentTarget.innerHTML.trim(),
            },
          });
        }}
      />
      {showImageTab && (
        <div
          onMouseDown={handleAlwaysFocus}
          className="floating-style absolute bg-zinc-900 text-white -top-11 left-1/2 -translate-x-1/2 h-9 flex gap-4 px-3 max-w-max rounded-sm"
        >
          <div className="flex gap-4">
            <button
              onMouseDown={() => {
                setswitchMediaSize(100);
                onUpdate({
                  image: {
                    url: field.image ? field.image.url : "",
                    alt: field.image ? field.image.alt : "",
                    label: mediaLabel,
                    size: {
                      width: 100,
                    },
                  },
                });
              }}
              className={`cursor-pointer ${switchMediaSize === 100 ? "text-blue-400" : ""}`}
            >
              <InsetCenter />
            </button>
            <button
              onMouseDown={() => {
                onUpdate({
                  image: {
                    url: field.image ? field.image.url : "",
                    alt: field.image ? field.image.alt : "",
                    label: mediaLabel,
                    size: {
                      width: 150,
                    },
                  },
                });
                setswitchMediaSize(150);
              }}
              className={`cursor-pointer ${switchMediaSize === 150 ? "text-blue-400" : ""}`}
            >
              <OutsetCenter />
            </button>
          </div>
          {/* <button
                        className="cursor-pointer text-blue-400"
                        onMouseDown={() => setswitchMediaSize((prev) => !prev)}
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

export default FieldImage;
