import { useRef, useCallback, useEffect } from "react";
import { isMacOs } from "react-device-detect";

export type Callback = () => void;

export interface ShortcutObject {
  get disabled(): boolean;
  set disabled(value: boolean);
  getDisabled: () => boolean;
  setDisabled: (value: boolean) => void;
}

export interface Shortcuts {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

export type ShortcutKeys = string | [string, string];

export interface FocusOptions {
  input?: boolean;
  textarea?: boolean;
  select?: boolean;
  button?: boolean;
}

export interface ShortcutOptions {
  keys: ShortcutKeys;
  disabled?: boolean;
  disallowFocusing?: boolean | FocusOptions;
  callback: Callback;
}

export type UseShortcuts = (options: ShortcutOptions) => ShortcutObject;

// Get an object for shortcuts.
const getShortcuts = (_keys: string): Shortcuts => {
  const keys = _keys.toLowerCase();
  const options = keys.split(" ").map((key) => key.trim());

  const result: Shortcuts = {
    key: keys,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false
  };

  if (options.includes("ctrl")) {
    result.ctrlKey = true;
    result.key = result.key.replace("ctrl", "");
  }

  if (options.includes("alt")) {
    result.altKey = true;
    result.key = result.key.replace("alt", "");
  }

  if (options.includes("shift")) {
    result.shiftKey = true;
    result.key = result.key.replace("shift", "");
  }

  if (options.includes("command")) {
    result.metaKey = true;
    result.key = result.key.replace("command", "");
  }

  result.key = result.key.trim();
  return result;
};

// Get the shortcut keys.
const getKeys = (keys: ShortcutKeys): string => {
  if (!Array.isArray(keys)) return keys;
  const index = Number(isMacOs);
  return keys[index];
};

const checkFocusing = (options: boolean | FocusOptions = false): boolean => {
  if (options === false) return false;

  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement?.tagName;
  if (!tagName) return false;

  if (options === true) {
    if (tagName === "BODY") return false;
    return true;
  }

  if (options.input && tagName === "INPUT") return true;
  if (options.textarea && tagName === "TEXTAREA") return true;
  if (options.select && tagName === "SELECT") return true;
  if (options.button && tagName === "BUTTON") return true;

  return false;
};

// Hook for keyboard shortcuts.
const useShortcuts: UseShortcuts = (options) => {
  const keys = getKeys(options.keys);
  const disabled = useRef(options.disabled ?? false);

  const shortcuts = getShortcuts(keys);
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (shortcuts.key === "") return;

    if (event.key.toLowerCase() !== shortcuts.key) return;
    if (event.ctrlKey !== shortcuts.ctrlKey) return;
    if (event.altKey !== shortcuts.altKey) return;
    if (event.shiftKey !== shortcuts.shiftKey) return;
    if (event.metaKey !== shortcuts.metaKey) return;

    if (checkFocusing(options.disallowFocusing)) return;
    if (disabled.current) return;

    event.preventDefault();
    options.callback();
  }, [
    shortcuts.key,
    shortcuts.ctrlKey,
    shortcuts.altKey,
    shortcuts.shiftKey,
    shortcuts.metaKey,
    options
  ]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const getDisabled = useCallback(() => {
    return disabled.current;
  }, []);

  const setDisabled = useCallback((value: boolean) => {
    disabled.current = value;
  }, []);

  return {
    get disabled() {
      return getDisabled()
    },
    set disabled(value: boolean) {
      setDisabled(value)
    },
    getDisabled,
    setDisabled
  };
};

export default useShortcuts;
