type Global = Window & typeof globalThis;

export const doc = document;
const frame = doc.createElement("iframe");
const safeWindow = (() => {
  try {
    (doc.head || doc.body).appendChild(frame);
    return frame.contentWindow as any as Global;
  } catch (e) {
    return window;
  }
})();

export function getGlobal<K extends keyof Global>(key: K): Global[K] {
  return safeWindow[key];
}

export function getPropertyName(klassNames: (keyof Global)[], name: string) {
  const safePropName = `__npt__${name}`; // we can use a Symbol here
  for (const klassName of klassNames) {
    const safeTarget = safeWindow[klassName].prototype;
    const originalTarget = window[klassName].prototype;
    const safeDescriptor = Object.getOwnPropertyDescriptor(safeTarget, name);
    if (!safeDescriptor) {
      return name;
    }
    Object.defineProperty(originalTarget, safePropName, safeDescriptor);
    Object.defineProperty(safeTarget, safePropName, safeDescriptor);
  }
  return safePropName;
}

export function removeSafeFrame() {
  // TODO: avoid removing it for the browser that doesn't support it
  // frame.remove?.();
}
