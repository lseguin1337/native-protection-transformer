import { getGlobal, getPropertyName, removeSafeFrame } from "./utils";

/**
 * ⚠️ Important: Follow the naming conventions strictly for the native protection transformer to function correctly.
 *
 * - To replace a global API, export it using the exact same name as the global API.
 * - To replace a property of a class, export it using the format `ClassName_propertyName` (e.g., `String_indexOf`).
 */

type Global = Window & typeof globalThis;

const scope = (...classNames: (keyof Global)[]) => (prop: string) => getPropertyName(classNames, prop);

export const setTimeout = /* @__PURE__ */ getGlobal("setTimeout");
export const queueMicrotask = /* @__PURE__ */ getGlobal("queueMicrotask");
export const clearTimeout = /* @__PURE__ */ getGlobal("clearTimeout");
export const setInterval = /* @__PURE__ */ getGlobal("setInterval");
export const clearInterval = /* @__PURE__ */ getGlobal("clearInterval");
export const Date = /* @__PURE__ */ getGlobal("Date");
export const JSON = /* @__PURE__ */ getGlobal("JSON");
export const URL = /* @__PURE__ */ getGlobal("URL");
export const MutationObserver = /* @__PURE__ */ getGlobal("MutationObserver");
export const RegExp = /* @__PURE__ */ getGlobal("RegExp");
export const screen = /* @__PURE__ */ getGlobal("screen");
// export const document = (() => doc)();

// Node
let g = scope("Node");
export const Node_nodeType = /* @__PURE__ */ g("nodeType");
export const Node_parentNode = /* @__PURE__ */ g("parentNode");
export const Node_childNodes = /* @__PURE__ */ g("childNodes");
export const Node_firstChild = /* @__PURE__ */ g("firstChild");
export const Node_lastChild = /* @__PURE__ */ g("lastChild");
export const Node_nextSibling = /* @__PURE__ */ g("nextSibling");
export const Node_previousSibling = /* @__PURE__ */ g("previousSibling");
export const Node_localName = /* @__PURE__ */ g("localName");

// NodeList
g = scope("Element", "Document", "ShadowRoot");
export const Node_querySelector = /* @__PURE__ */ g("querySelector");
export const Node_querySelectorAll = /* @__PURE__ */ g("querySelectorAll");

// Element
g = scope("Element");
export const Element_shadowRoot = /* @__PURE__ */ g("shadowRoot");
export const Element_matches = /* @__PURE__ */ g("matches");
export const Element_classList = /* @__PURE__ */ g("classList");
export const Element_getAttribute = /* @__PURE__ */ g("getAttribute");

// HTMLImageElement
g = scope("HTMLImageElement");
export const HTMLImageElement_src = /* @__PURE__ */ g("src");

// Array
g = scope("Array");
export const Array_filter = /* @__PURE__ */ g("filter");
export const Array_push = /* @__PURE__ */ g("push");
export const Array_pop = /* @__PURE__ */ g("pop");
export const Array_shift = /* @__PURE__ */ g("shift");
export const Array_unshift = /* @__PURE__ */ g("unshift");
export const Array_splice = /* @__PURE__ */ g("splice");
export const Array_slice = /* @__PURE__ */ g("slice");
export const Array_concat = /* @__PURE__ */ g("concat");
export const Array_indexOf = /* @__PURE__ */ g("indexOf");
export const Array_map = /* @__PURE__ */ g("map");

// String
g = scope("String");
export const String_indexOf = /* @__PURE__ */ g("indexOf");
export const String_slice = /* @__PURE__ */ g("slice");
export const String_split = /* @__PURE__ */ g("split");
export const String_trim = /* @__PURE__ */ g("trim");
export const String_replace = /* @__PURE__ */ g("replace");
export const String_match = /* @__PURE__ */ g("match");

// Navigator
g = scope("Navigator");
export const Navigator_sendBeacon = /* @__PURE__ */ g("sendBeacon");

// Additional Utilities
const SafeArray = /* @__PURE__ */ getGlobal("Array");
export function isInstanceOfArray(v: unknown) {
  return (v instanceof Array || v instanceof SafeArray);
}

removeSafeFrame();
