import { useCallback, useState } from "react";

type History<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Fn<T> = (past: T) => T;

const HISTORY_LIMIT = 50;

const useUndoRedo = <T>(initialValue: T) => {
  const [history, setHistory] = useState<History<T>>({
    past: [],
    present: initialValue,
    future: [],
  });

  const setValue = useCallback((value: T | Fn<T>) => {
    setHistory(({ past, present }) => {
      const updateValue =
        typeof value === "function" ? (value as Fn<T>)(present) : value;
      return {
        past: [...past, present].slice(-HISTORY_LIMIT),
        present: updateValue,
        future: [],
      };
    });
  }, []);
  const undo = useCallback(() => {
    setHistory(({ past, present, future }) => {
      if (past.length === 0) {
        return { past, present, future };
      }

      const previous = past[past.length - 1];

      return {
        past: past.slice(0, -1),
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(({ past, present, future }) => {
      if (future.length === 0) {
        return { past, present, future };
      }

      const next = future[0];

      return {
        past: [...past, present],
        present: next,
        future: future.slice(1),
      };
    });
  }, []);

  return {
    present: history.present,
    setUpdate: setValue,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};

export default useUndoRedo;
