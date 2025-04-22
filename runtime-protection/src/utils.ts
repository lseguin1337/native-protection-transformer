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

export function getPropertyName(targets: string | string[], name: string) {
  const safePropName = `__npt__${name}`; // we can use a Symbol here
  if (typeof targets === "string") {
    targets = [targets];
  }
  for (let i = 0; i < targets.length; i++) {
    const klassName = targets[i] as keyof Global;
    const safeTarget = safeWindow[klassName].prototype;
    const originalTarget = window[klassName].prototype;
    const safeDescriptor = Object.getOwnPropertyDescriptor(safeTarget, name);
    if (!safeDescriptor) {
      return name;
    }
    Object.defineProperty(originalTarget, safePropName, safeDescriptor);
  }
  return safePropName;
}

export function removeSafeFrame() {
  // TODO: avoid removing it for the browser that doesn't support it
  frame.remove();
}