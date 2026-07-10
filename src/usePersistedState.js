import { useCallback, useSyncExternalStore } from 'react';

// Module-level store shared by every usePersistedState instance in this tab
// (keyed by localStorage key), so two simultaneously-mounted components
// reading the same key - e.g. Form's "add task" dropdown and a TaskItem's
// "edit task" dropdown, both backed by 'subLists' - see each other's
// updates immediately instead of drifting until one of them remounts.
const cache = new Map();      // key -> current value (already parsed if not raw)
const listeners = new Map();  // key -> Set of subscriber callbacks
const defaults = new Map();   // key -> { defaultValue, raw }, recorded on first use

// Every localStorage key this app persists, kept as one explicit list (not
// just "whatever has registered so far") so resetAllPersistedState() clears
// everything even if some owning component hasn't mounted yet this session.
// Update this list alongside any new usePersistedState(key, ...) call.
const ALL_PERSISTED_KEYS = [
  'tasks',
  'totalPoints',
  'heartsOwned',
  'selectedVideoId',
  'customVideos',
  'subLists',
];

function getListeners(key) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  return set;
}

function readFromStorage(key, defaultValue, raw) {
  const stored = localStorage.getItem(key);
  if (stored === null) return defaultValue;
  if (raw) return stored;
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error(`Invalid JSON for localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function writeToStorage(key, value, raw) {
  localStorage.setItem(key, raw ? value : JSON.stringify(value));
}

function notify(key) {
  getListeners(key).forEach((callback) => callback());
}

// Same API as useState, but reads its initial value from localStorage and
// writes back to localStorage every time it changes. Centralizes what used
// to be duplicated load/save logic scattered across components, and keeps
// every mounted instance for a given key in sync via useSyncExternalStore.
//
// `raw: true` stores/reads the value as a plain string instead of JSON
// (used for selectedVideoId, so existing localStorage values written before
// this hook existed - plain unquoted strings - still parse correctly).
function usePersistedState(key, defaultValue, { raw = false } = {}) {
  if (!cache.has(key)) {
    cache.set(key, readFromStorage(key, defaultValue, raw));
    defaults.set(key, { defaultValue, raw });
  }

  const subscribe = useCallback((callback) => {
    const set = getListeners(key);
    set.add(callback);
    return () => set.delete(callback);
  }, [key]);

  const getSnapshot = useCallback(() => cache.get(key), [key]);

  const value = useSyncExternalStore(subscribe, getSnapshot);

  const setValue = useCallback((updater) => {
    const prev = cache.get(key);
    const next = typeof updater === 'function' ? updater(prev) : updater;
    cache.set(key, next);
    writeToStorage(key, next, raw);
    notify(key);
  }, [key, raw]);

  return [value, setValue];
}

// Clears every persisted key from localStorage and, for any key currently
// backing a mounted component, resets it back to that component's own
// default and notifies subscribers so the UI reflects the reset immediately
// - no page reload required. Lives here rather than in Settings.jsx so the
// "reset" button doesn't need to know each feature's storage keys/defaults.
export function resetAllPersistedState() {
  ALL_PERSISTED_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    if (defaults.has(key)) {
      const { defaultValue } = defaults.get(key);
      cache.set(key, defaultValue);
      notify(key);
    } else {
      cache.delete(key);
    }
  });
}

export default usePersistedState;