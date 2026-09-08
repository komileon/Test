import { codeToHtml } from "shiki";
import type { BNode } from "../types/blog.types";
import Separator from "./Separator";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { clearElement } from "../utils/blog.utils";

const FieldPreview = ({ field, index }: { field: BNode; index: number }) => {
  const [code, setCode] = useState("");
  const nodeRef = useRef<HTMLElement>(null);
  const labelImageRef = useRef<HTMLElement>(null);
  const labelVideoRef = useRef<HTMLElement>(null);

  const highlight = useCallback(
    async function highlight(code: string) {
      const html = await codeToHtml(code, {
        lang: field.code?.language.toLowerCase() ?? "javascript",
        theme: "github-light",
        defaultColor: false,
      });
      return html;
    },
    [field],
  );

  useEffect(() => {
    if (labelImageRef.current) {
      labelImageRef.current.innerHTML = field.image?.label
        ? field.image.label
        : "";
    }

    if (labelVideoRef.current) {
      labelVideoRef.current.innerHTML = field.video?.label
        ? field.video.label
        : "";
    }
  }, [field]);

  useEffect(() => {
    if (field.type === "code") {
      console.log("object code");
      highlight(field.html).then((v) => {
        console.log(v);
        setCode(v);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log("object");

    if (!nodeRef.current) return;

    if (nodeRef.current.innerHTML !== field.html) {
      if (["h1", "h3", "blockquote"].includes(field.tag)) {
        nodeRef.current.innerHTML = clearElement(field.html);
        console.log(clearElement(field.html));
      } else {
        nodeRef.current.innerHTML = field.html;
      }
    }
    if (field.type === "code") {
      console.log("object code");
      highlight(field.html).then((v) => {
        setCode(v);
      });
    }
  }, [field, highlight]);

  if (field.type === "image") {
    return (
      <figure
        className={`relative my-8 mx-auto left-1/2 -translate-x-1/2 ${field.image?.size?.width && field.image.size.width === 150 ? "w-[150%]" : "w-full"}`}
      >
        <img
          src={field.image?.url}
          alt={field.image?.alt}
          className="min-w-full outline-0 ring-2 ring-transparent hover:ring-blue-400"
        />
        <figcaption
          ref={labelImageRef}
          className="text-center text-sm border-0 outline-0 w-1/2 my-2 mx-auto text-zinc-600"
        />
      </figure>
    );
  }
  if (field.type === "separator") {
    return <Separator />;
  }

  if (field.type === "video") {
    return (
      <figure
        className={`relative my-8 mx-auto left-1/2 -translate-x-1/2 ${field.video?.size?.width && field.image?.size?.width === 150 ? "w-[150%]" : "w-full"}`}
      >
        <video controls className="min-w-full">
          <source src={field.video?.url} />
        </video>
        <figcaption
          ref={labelVideoRef}
          className="text-center text-sm border-0 outline-0 w-1/2 my-2 mx-auto text-zinc-600"
        />
      </figure>
    );
  }
  if (field.type === "code" && field.html.trim()) {
    return (
      <div className="my-4">
        {/* <div className='rounded-tr-sm rounded-tl-sm bg-orange-100 max-w-max px-2 py-px text-xs'>{field.code?.language}</div> */}
        <div
          className="code w-full min-h-10 outline-0 border border-neutral-400 p-4 rounded-b-sm rounded-tr-sm bg-neutral-200 text-xs"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </div>
    );
  }

  return createElement(
    field.tag,
    // eslint-disable-next-line react-hooks/refs
    {
      ref: nodeRef,
      "data-index": index,
      className: "text-field-style",
    },
  );
};

export default FieldPreview;
