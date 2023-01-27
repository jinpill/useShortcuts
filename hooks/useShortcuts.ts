import { useRef, useCallback, useEffect } from 'react';
import { isMacOs } from 'react-device-detect';

export type Callback = () => void

export type ShortcutObject = {
  get disabled(): boolean;
  set disabled(value: boolean);
}

export interface Shortcuts {
  key: string,
  ctrlKey?: boolean,
  altKey?: boolean,
  shiftKey?: boolean,
  metaKey?: boolean,
}

export type ShortcutKeys = string | [string, string]

export interface ShortcutOptions {
  keys: ShortcutKeys
  disabled?: boolean
  preventInFocus?: boolean
  callback: Callback
}

export type UseShortcuts = (options: ShortcutOptions) => ShortcutObject

// Get an object for shortcuts.
const getShortcuts = (_keys: string): Shortcuts => {
  const keys = _keys.toLowerCase();
  const options = keys.split(" ").map(key => key.trim());

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
}

// Get the shortcut keys.
const getKeys = (keys: ShortcutKeys): string => {
  if (keys instanceof Array) {
    const index = Number(isMacOs)
    return keys[index]
  }

  return keys;
}

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

    event.preventDefault();
    if (disabled.current) return;
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
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    get disabled() {
      return disabled.current;
    },
    set disabled(value: boolean) {
      disabled.current = value;
    }
  };
};

export default useShortcuts;
