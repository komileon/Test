import { imageExtensions } from "../constants/blog.constants";
import type { BNode, NodeType } from "../types/blog.types";
import { v4 as uuidv4 } from "uuid";

function generateId() {
  // return crypto.randomUUID();
  // return Math.floor(Math.random() * 100000000).toString(36);
  return uuidv4();
}

export const clearElement = (element: string) => {
  const div = document.createElement("div");
  div.innerHTML = element;
  return div.textContent.trim() || "";
};
export const isEmptyElement = (element: string) => {
  return (
    element
      .replace(/<br\s*\/?>/gi, "")
      .replace(/(?:&nbsp;|&#160;|&#xA0;)/gi, "")
      .replace(/\s|\u00A0/g, "")
      .trim().length === 0
  );
};

export function createEmptyNode(type: NodeType = "text") {
  const node: BNode = {
    id: generateId(),
    type,
    tag: "p",
    html: "",
  };

  if (type === "code") {
    node.code = {
      language: "Javascript",
    };
  }

  if (type === "image") {
    node.tag = "img";
    node.image = {
      url: "",
      alt: "",
      label: "",
      size: {
        width: 100,
      },
    };
  }
  if (type === "video") {
    node.tag = "video";
    node.video = {
      url: "",
      alt: "",
      label: "",
      size: {
        width: 100,
      },
    };
  }

  return node;
}

export const getAltMedia = (alt: string) => {
  if (!alt.trim()) return "";
  const words = alt.split(".");

  const last = words[words.length - 1];
  const rest = words.slice(0, -1);
  // console.log(words);
  if (imageExtensions.includes(last)) {
    // console.log("Join");
    return rest.join("");
  }
  // console.log(alt);
  return alt;
};

export const containsBalises = (text: string) => {
  return /<[^>]+>/.test(text);
};

export const extractYoutubeId = (link: string) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const isYoutubeUrl = (url: string) => {
  try {
    const { hostname } = new URL(url);

    return (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtu.be" ||
      hostname === "www.youtu.be"
    );
  } catch {
    return false;
  }
};

const verifyIfLastFieldIsEmpty = (fields: BNode[]) => {
  if (Array.isArray(fields)) {
    const last = fields[fields.length - 1];

    const isEmpty =
      (last.type === "text" && isEmptyElement(last.html)) ||
      (last.type === "image" && !last.image?.url) ||
      (last.type === "video" && !last.video?.url) ||
      (last.type === "code" && isEmptyElement(last.html));

    if (isEmpty) return true;
  }
};

export const CleanFields = (fields: BNode[]) => {
  while (fields.length > 0 && verifyIfLastFieldIsEmpty(fields)) {
    fields.pop();
  }
  console.log(fields);
  return fields;
};
