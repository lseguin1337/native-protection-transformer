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

function get<T = any>(target: any, accessors: string[]): T {
  let value: any = target;
  for (let i = 0; i < accessors.length && value; i++) {
    const accessor = accessors[i];
    value = value[accessor];
  }
  return value;
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
    const accessors = targets[i].split(".");
    const safeTarget = get(safeWindow, accessors);
    const originalTarget = get(window, accessors);
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