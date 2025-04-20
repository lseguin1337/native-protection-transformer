import { getGlobal, getProp } from "./utils";

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

// properties

const NodePrototype = "Node.prototype";
export const nodeNodeType = /* @__PURE__ */ getProp(NodePrototype, "nodeType");
export const nodeParentNode = /* @__PURE__ */ getProp(NodePrototype, "parentNode");
export const nodeChildNodes = /* @__PURE__ */ getProp(NodePrototype, "childNodes");
export const nodeFirstChild = /* @__PURE__ */ getProp(NodePrototype, "firstChild");
export const nodeLastChild = /* @__PURE__ */ getProp(NodePrototype, "lastChild");
export const nodeNextSibling = /* @__PURE__ */ getProp(NodePrototype, "nextSibling");
export const nodePreviousSibling = /* @__PURE__ */ getProp(NodePrototype, "previousSibling");
const ElementPrototype = "Element.prototype";
const DocumentPrototype = "Document.prototype";
const ShadowRootPrototype = "ShadowRoot.prototype";
export const nodeShadowRoot = /* @__PURE__ */ getProp(ElementPrototype, "shadowRoot");
export const nodeLocalName = /* @__PURE__ */ getProp(ElementPrototype, "localName");
export const nodeQuerySelectorAll = /* @__PURE__ */ getProp([ElementPrototype, DocumentPrototype, ShadowRootPrototype], "querySelectorAll");
export const nodeQuerySelector = /* @__PURE__ */ getProp([ElementPrototype, DocumentPrototype, ShadowRootPrototype], "querySelector");

const ArrayPrototype = "Array.prototype";
export const arrayPush = /* @__PURE__ */ getProp(ArrayPrototype, "push");
export const arrayPop = /* @__PURE__ */ getProp(ArrayPrototype, "pop");
export const arrayShift = /* @__PURE__ */ getProp(ArrayPrototype, "shift");
export const arrayUnshift = /* @__PURE__ */ getProp(ArrayPrototype, "unshift");
export const arraySplice = /* @__PURE__ */ getProp(ArrayPrototype, "splice");
export const arraySlice = /* @__PURE__ */ getProp(ArrayPrototype, "slice");
export const arrayConcat = /* @__PURE__ */ getProp(ArrayPrototype, "concat");
export const arrayIndexOf = /* @__PURE__ */ getProp(ArrayPrototype, "indexOf");
export const arrayMap = /* @__PURE__ */ getProp(ArrayPrototype, "map");

const StringPrototype = "String.prototype";
export const stringIndexOf = /* @__PURE__ */ getProp(StringPrototype, "indexOf");
export const stringSlice = /* @__PURE__ */ getProp(StringPrototype, "slice");
export const stringSplit = /* @__PURE__ */ getProp(StringPrototype, "split");
export const stringTrim = /* @__PURE__ */ getProp(StringPrototype, "trim");
export const stringReplace = /* @__PURE__ */ getProp(StringPrototype, "replace");
export const stringMatch = /* @__PURE__ */ getProp(StringPrototype, "match");