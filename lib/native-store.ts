// In-memory store for the native POST demo.
// Attached to globalThis so the same array is shared across all module instances
// within the same Node.js process (Route Handlers and Server Components can run
// in separate module contexts with Turbopack; globalThis bridges them).
// Resets on server restart — acceptable for a demo environment.

export type StoreItem = { id: number; text: string }

const seed: StoreItem[] = [
  { id: 1, text: "Buy groceries" },
  { id: 2, text: "Read a book" },
  { id: 3, text: "Go for a walk" },
]

declare global {
  // eslint-disable-next-line no-var
  var __nativeStore: { items: StoreItem[]; nextId: number } | undefined
}

if (!globalThis.__nativeStore) {
  globalThis.__nativeStore = { items: [...seed], nextId: seed.length + 1 }
}

export function getItems(): StoreItem[] {
  return [...globalThis.__nativeStore!.items]
}

export function addItem(text: string): StoreItem {
  const store = globalThis.__nativeStore!
  const item: StoreItem = { id: store.nextId++, text: text.trim() }
  store.items.push(item)
  return item
}
