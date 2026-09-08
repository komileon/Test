export type NodeType = "text" | "image" | "video" | "separator" | "code";
export type NodeTag = "p" | "h1" | "h3" | "blockquote" | "img" | "video";
export type Language =
  | "Javascript"
  | "Typescript"
  | "Python"
  | "HTML"
  | "CSS"
  | "JSON";

type BNodeData = {
  url: string;
  alt: string;
  label: string;
  isExtenalData?: boolean;
  size?: {
    width: number;
    height?: number;
  };
};

type BCodeData = {
  language: Language;
};

export interface BNode {
  id: string;
  type: NodeType;
  tag: NodeTag;
  html: string;
  image?: BNodeData;
  video?: BNodeData;
  code?: BCodeData;
}

export type BlogData = {
  id: string;
  nodes: BNode[];
  update_at: Date;
};
