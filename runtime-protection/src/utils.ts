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

function get<T = any>(target: any, key: string): T {
  return target[key];
}

export function getGlobal<K extends keyof Global>(key: K): Global[K] {
  return safeWindow[key];
}

export function getProp(targets: string | string[], name: string) {
  const safePropName = Symbol.for(`__npt__${name}`);
  if (typeof targets === "string") {
    targets = [targets];
  }
  for (let i = 0; i < targets.length; i++) {
    const klassName = targets[i];
    const safeTarget = get(safeWindow, klassName).prototype;
    const originalTarget = get(window, klassName).prototype;
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