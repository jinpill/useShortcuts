import { useRef, useCallback, useEffect } from 'react';
import { isMacOs } from 'react-device-detect';

type Callback = () => void

type ShortcutObject = {
  get disabled(): boolean;
  set disabled(value: boolean);
}

interface UseShortcuts {
  (_options: string, _callback: Callback): ShortcutObject
  (_options: string, _optionsForMac: string, _callback: Callback): ShortcutObject
}

interface Shortcuts {
  key: string,
  ctrlKey?: boolean,
  altKey?: boolean,
  shiftKey?: boolean,
  metaKey?: boolean,
}

const getShortcuts = (_keys: string): Shortcuts => {
  const result: Shortcuts = {
    key: "",
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false
  };

  const keys = _keys.toLowerCase();
  const options = keys.split(" ").map(key => key.trim());

  if (options.includes("ctrl")) result.ctrlKey = true;
  if (options.includes("alt")) result.altKey = true;
  if (options.includes("shift")) result.shiftKey = true;
  if (options.includes("command")) result.metaKey = true;
  result.key = keys.replace("ctrl", "").replace("alt", "").replace("shift", "").replace("command", "").trim();

  return result;
}

const useShortcuts: UseShortcuts = (_options: string, _optionsForMac: string | Callback, _callback?: Callback) => {
  let keys: string = "";
  let callback: Callback | null = null;
  const disabled = useRef(false);

  if (typeof _optionsForMac !== 'string') {
    keys = _options;
    callback = _optionsForMac;
  } else if (typeof _callback !== 'undefined') {
    keys = isMacOs ? _optionsForMac : _options;
    callback = _callback!;
  }

  const shortcuts = getShortcuts(keys);
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (shortcuts.key === "") return;
    if (callback === null) return;

    if (event.key.toLowerCase() !== shortcuts.key) return;
    if (event.ctrlKey !== shortcuts.ctrlKey) return;
    if (event.altKey !== shortcuts.altKey) return;
    if (event.shiftKey !== shortcuts.shiftKey) return;
    if (event.metaKey !== shortcuts.metaKey) return;

    event.preventDefault();
    if (disabled.current) return;
    callback();
  }, [
    shortcuts.key,
    shortcuts.ctrlKey,
    shortcuts.altKey,
    shortcuts.shiftKey,
    shortcuts.metaKey,
    callback
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
