type Global = Window & typeof globalThis;

function memo<T = any>(fn: () => T) {
  let value: T | undefined;
  return () => {
    if (value === undefined) {
      value = fn();
    }
    return value as T;
  };
}

const getSafeContext = /* @__PURE__ */ memo(() => {
  const frame = document.createElement("iframe");
  try {
    (document.head || document.body).appendChild(frame);
    return frame.contentWindow as any as Global;
  } catch (e) {
    return window;
  } finally {
    // should not remove the frame
    // frame.remove();
  }
});

function get<T = any>(target: any, accessors: string[]): T {
  let value: any = target;
  for (let i = 0; i < accessors.length && value; i++) {
    const accessor = accessors[i];
    value = value[accessor];
  }
  return value;
}

export function getGlobal<K extends keyof Global>(key: K): Global[K] {
  return getSafeContext()[key];
}

export function getProp(targets: string | string[], name: string) {
  const safePropName = Symbol.for(`__npt__${name}`);
  if (typeof targets === "string") {
    targets = [targets];
  }
  for (let i = 0; i < targets.length; i++) {
    const accessors = targets[i].split(".");
    const safeWindow = getSafeContext();
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