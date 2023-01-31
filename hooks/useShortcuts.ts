import { useRef, useCallback, useEffect } from 'react'
import { isMacOs } from 'react-device-detect'

export type Callback = () => void

export interface ShortcutObject {
  get keys(): string
  getKeys: (arr?: boolean) => string | string[]

  get allowed(): boolean
  set allowed(value: boolean)
  getAllowed: () => boolean
  setAllowed: (value: boolean) => void

  getBackup: (value?: boolean) => Backup
}

export interface Shortcuts {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}

export type ShortcutKeys = string | [string, string]

export interface FocusOptions {
  input?: boolean
  textarea?: boolean
  select?: boolean
  button?: boolean
}

export interface ShortcutOptions {
  keys: ShortcutKeys
  allowed?: boolean
  disallowFocusing?: boolean | FocusOptions
  callback: Callback
}

export type UseShortcuts = (options: ShortcutOptions) => ShortcutObject

export interface Backup {
  get prev(): boolean
  restore: () => void
}

export type BackupGetter = (value?: boolean) => Backup

// Get an object for shortcuts.
const getShortcuts = (_keys: string): Shortcuts => {
  const keys = _keys.toLowerCase()
  const options = keys.split(' ').map((key) => key.trim())

  const result: Shortcuts = {
    key: keys,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false
  }

  if (options.includes('ctrl')) {
    result.ctrlKey = true
    result.key = result.key.replace('ctrl', '')
  }

  if (options.includes('alt')) {
    result.altKey = true
    result.key = result.key.replace('alt', '')
  }

  if (options.includes('shift')) {
    result.shiftKey = true
    result.key = result.key.replace('shift', '')
  }

  if (options.includes('command')) {
    result.metaKey = true
    result.key = result.key.replace('command', '')
  }

  result.key = result.key.trim()
  return result
}

// Get the shortcut keys.
const getKeysFromOS = (keys: ShortcutKeys): string => {
  if (!Array.isArray(keys)) return keys
  const index = Number(isMacOs)
  return keys[index]
}

const checkFocusing = (options: boolean | FocusOptions = false): boolean => {
  if (options === false) return false

  const activeElement = document.activeElement
  if (!activeElement) return false

  const tagName = activeElement?.tagName
  if (!tagName) return false

  if (options === true) {
    if (tagName === 'BODY') return false
    return true
  }

  if (options.input && tagName === 'INPUT') return true
  if (options.textarea && tagName === 'TEXTAREA') return true
  if (options.select && tagName === 'SELECT') return true
  if (options.button && tagName === 'BUTTON') return true

  return false
}

// Hook for keyboard shortcuts.
const useShortcuts: UseShortcuts = (options) => {
  const keys = getKeysFromOS(options.keys)
  const allowed = useRef(options.allowed ?? true)

  const shortcuts = getShortcuts(keys)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (shortcuts.key === '') return

      if (event.key.toLowerCase() !== shortcuts.key) return
      if (event.ctrlKey !== shortcuts.ctrlKey) return
      if (event.altKey !== shortcuts.altKey) return
      if (event.shiftKey !== shortcuts.shiftKey) return
      if (event.metaKey !== shortcuts.metaKey) return

      if (checkFocusing(options.disallowFocusing)) return
      if (!allowed.current) return

      event.preventDefault()
      options.callback()
    },
    [
      shortcuts.key,
      shortcuts.ctrlKey,
      shortcuts.altKey,
      shortcuts.shiftKey,
      shortcuts.metaKey,
      options
    ]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getKeys = useCallback((arr = false) => {
    const _keys = !isMacOs
      ? keys
      : keys
        .replace('Command', '⌘')
        .replace('Ctrl', '⌃')
        .replace('Alt', '⌥')
        .replace('Shift', '⇧')

    if (!arr) return _keys
    return _keys.split(' ')
  }, [keys])

  const getAllowed = useCallback(() => {
    return allowed.current
  }, [])

  const setAllowed = useCallback((value: boolean) => {
    allowed.current = value
  }, [])

  const getBackup = useCallback((value?: boolean) => {
    const prev = allowed.current
    const needToBackUp = value === undefined || value === prev

    if (needToBackUp) {
      allowed.current = !prev
    }

    return {
      get prev() {
        return prev
      },
      restore: () => {
        if (!needToBackUp) return
        allowed.current = prev
      }
    }
  }, [])

  return {
    get keys() {
      return getKeys() as string
    },
    getKeys,

    get allowed() {
      return getAllowed()
    },
    set allowed(value: boolean) {
      setAllowed(value)
    },
    getAllowed,
    setAllowed,

    getBackup
  }
}

export default useShortcuts
