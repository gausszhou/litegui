const warned = new Set<string>();

export function deprecate(id: string, message: string) {
  if (warned.has(id)) return;
  warned.add(id);
  console.warn(`[LiteGUI] ${message}`);
}

export function resetDeprecationWarnings() {
  warned.clear();
}
