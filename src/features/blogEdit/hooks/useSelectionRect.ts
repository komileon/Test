import { useEffect, useRef, useState } from "react";

const useSelectionRect = () => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  //   const [id, setId] = useState<string | null>(null);
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    const handleSelectionRect = () => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setRect(null);
        return;
      }

      const range = selection.getRangeAt(0);

      const element = range.commonAncestorContainer;

      if (element.nodeType === Node.TEXT_NODE) {
        const parent = element.parentElement?.closest("[data-id]");
        if (!parent) {
          setRect(null);
          return;
        }

        idRef.current = parent.getAttribute("data-id");

        const position = range.getBoundingClientRect();
        if (position.height === 0 && position.height === 0) {
          setRect(null);
          return;
        }
        // console.log(range);
        setRect(position);
      }

      return rect;
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setRect(null);
        return;
      }
    };

    window.addEventListener("resize", handleSelectionRect);
    window.addEventListener("scroll", handleSelectionRect);
    document.addEventListener("mouseup", handleSelectionRect);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      window.removeEventListener("resize", handleSelectionRect);
      window.removeEventListener("scroll", handleSelectionRect);
      document.removeEventListener("mouseup", handleSelectionRect);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [rect]);

  return { rect, idRef };
};

export default useSelectionRect;
