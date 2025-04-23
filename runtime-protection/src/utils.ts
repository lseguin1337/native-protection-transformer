type Global = Window & typeof globalThis;

const frame = document.createElement("iframe");
const safeWindow = (() => {
  try {
    (document.head || document.body).appendChild(frame);
    return frame.contentWindow as any as Global;
  } catch (e) {
    return window;
  }
})();

export function getGlobal<K extends keyof Global>(key: K): Global[K] {
  return safeWindow[key];
}

export function getPropertyName(klassName: keyof Global, name: string) {
  const safePropName = `__npt__${name}`; // we can use a Symbol here

  const safeTarget = safeWindow[klassName].prototype;
  const originalTarget = window[klassName].prototype;
  const safeDescriptor = Object.getOwnPropertyDescriptor(safeTarget, name);
  if (!safeDescriptor) {
    return name;
  }
  Object.defineProperty(originalTarget, safePropName, safeDescriptor);
  Object.defineProperty(safeTarget, safePropName, safeDescriptor);
  return safePropName;
}

export function removeSafeFrame() {
  // TODO: avoid removing it for the browser that doesn't support it
  // frame.remove?.();
}
