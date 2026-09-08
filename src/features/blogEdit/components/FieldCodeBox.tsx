import { Check, ChevronDown, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
// import { codeToHtml } from "shiki";
import type { BNode, Language } from "../types/blog.types";
import type { FocusUpdateType } from "../hooks/useEditorState";

const LANGUAGES: Language[] = [
  "Javascript",
  "Typescript",
  "Python",
  "HTML",
  "CSS",
  "JSON",
];

type FieldCodeProps = {
  field: BNode;
  focus: FocusUpdateType;
  setFocus: (focus: FocusUpdateType) => void;
  onUpdate: (fragment: Partial<BNode>) => void;
  onDelete: () => void;
};

const FieldCodeBox = ({
  field,
  focus,
  setFocus,
  onUpdate,
  onDelete,
}: FieldCodeProps) => {
  const [selectLang, setSelectLang] = useState<Language>(
    field.code?.language ?? "Javascript",
  );
  const [openSelect, setOpenSelect] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeRef.current) return;

    if (codeRef.current.textContent !== field.html) {
      codeRef.current.textContent = field.html;
    }

    if (focus && focus.id === field.id) {
      const range = document.createRange();
      const selection = window.getSelection();
      if (!selection) return;

      const textNode = codeRef.current;

      range.selectNodeContents(textNode);
      // console.log(focus.id, focus.position);

      if (focus.position === "start") {
        range.collapse(true);
        // console.log("START");
      } else if (focus.position === "end") {
        range.collapse(false);
        // console.log("END");
      } else if (typeof focus.position === "object") {
        if (focus.position.lastTextLength) {
          range.setStart(
            textNode.childNodes[focus.position.positionNode - 1],
            focus.position.lastTextLength,
          );
          range.setEnd(
            textNode.childNodes[focus.position.positionNode - 1],
            focus.position.lastTextLength,
          );
        } else {
          // console.log(textNode.firstChild);
          range.setStart(textNode.firstChild!, focus.position.positionNode);
          range.setEnd(textNode.firstChild!, focus.position.positionNode);
        }
      }

      selection.removeAllRanges();
      selection.addRange(range);
      codeRef.current.focus();
      setFocus(null);
    }
  }, [field, focus, setFocus]);

  // async function highlight(code: string) {
  //     const html = await codeToHtml(code, {
  //         lang: selectLang.toLowerCase(),
  //         theme: "github-light",
  //         defaultColor: false,
  //     });

  //     if (codeRef.current) {
  //         console.log("Pre: ", html, selectLang);
  //         codeRef.current.innerHTML = html;
  //     }
  // }

  // const handleUpdate = (e: React.FocusEvent<HTMLDivElement>) => {
  //     console.log(e.currentTarget.textContent)
  // }
  const handleInput = (e: React.InputEvent<HTMLDivElement>) => {
    const value = e.currentTarget.textContent;
    onUpdate({ html: value });
    // console.log(value)
    // highlight(value)
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    range.deleteContents();
    // console.log(range);
    const node = document.createTextNode(text);
    // console.log(node);

    range.insertNode(node);
    // console.log(range);

    range.setEndAfter(node);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);

    if (!codeRef.current) return;

    const html = codeRef.current.textContent;

    onUpdate({ html });
  };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
  //     console.log(event.key, event)
  //     if (event.key === "Backspace") {
  //         event.preventDefault()
  //         onDelete()
  //     } else if (event.key === "ArrowUp") {
  //         console.log(event.key)
  //         onMoveFocus("up")

  //     }
  //     else if (event.key === "ArrowDown") {
  //         console.log(event.key)
  //         onMoveFocus("down")
  //     }
  //     else if (event.key === "ArrowLeft") {
  //         console.log(event.key)
  //         onMoveFocus("up")
  //     }
  //     else if (event.key === "ArrowRight") {
  //         console.log(event.key)
  //         onMoveFocus("down")
  //     }
  // }

  return (
    <div className="border border-neutral-400 bg-neutral-200 my-4 rounded-sm">
      <div className="flex items-center justify-between border-b border-b-neutral-400 px-2 py-1 relative">
        <div className="text-xs">
          <div
            onClick={() => setOpenSelect(!openSelect)}
            className="flex gap-1 items-center cursor-pointer px-4 py-2 rounded-sm"
          >
            <span> {selectLang} </span>
            <ChevronDown size={14} />
          </div>

          {openSelect && (
            <div className="absolute w-40 border border-zinc-300 rounded-sm">
              {LANGUAGES.map((lang) => (
                <div
                  key={lang}
                  onClick={() => {
                    setSelectLang(lang);
                    setOpenSelect(false);
                    onUpdate({ code: { language: lang } });
                  }}
                  className="flex items-center justify-between cursor-pointer bg-zinc-100 px-2 py-3 text-left"
                >
                  <span>{lang}</span>
                  {selectLang === lang && <Check size={14} />}
                </div>
              ))}
            </div>
          )}
        </div>
        <button>
          <Trash2
            size={18}
            className="text-red-400 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
              // console.log("Delete");
            }}
          />
        </button>
      </div>
      <div
        ref={codeRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        data-placeholder="// your code here"
        className="code w-full min-h-10 outline-0 p-4 border-0 text-xs"
        onInput={handleInput}
        // onBlur={handleUpdate}
        onPaste={handlePaste}
        // onKeyDown={handleKeyDown}
      />
      {/* <textarea className="w-full min-h-10 flex outline-0 border-0 resize-none field-sizing-content p-4" onBlur={handleUpdate} placeholder="// your code here" spellCheck={false} /> */}
    </div>
  );
};

export default FieldCodeBox;
