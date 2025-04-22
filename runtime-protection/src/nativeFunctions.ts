import { getGlobal, getProp, removeSafeFrame } from "./utils";

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
export const Node_nodeType = /* @__PURE__ */ getProp(NodePrototype, "nodeType");
export const Node_parentNode = /* @__PURE__ */ getProp(NodePrototype, "parentNode");
export const Node_childNodes = /* @__PURE__ */ getProp(NodePrototype, "childNodes");
export const Node_firstChild = /* @__PURE__ */ getProp(NodePrototype, "firstChild");
export const Node_lastChild = /* @__PURE__ */ getProp(NodePrototype, "lastChild");
export const Node_nextSibling = /* @__PURE__ */ getProp(NodePrototype, "nextSibling");
export const Node_previousSibling = /* @__PURE__ */ getProp(NodePrototype, "previousSibling");
const ElementPrototype = "Element.prototype";
const DocumentPrototype = "Document.prototype";
const ShadowRootPrototype = "ShadowRoot.prototype";
export const Node_shadowRoot = /* @__PURE__ */ getProp(ElementPrototype, "shadowRoot");
export const Node_localName = /* @__PURE__ */ getProp(ElementPrototype, "localName");
export const Node_querySelectorAll = /* @__PURE__ */ getProp([ElementPrototype, DocumentPrototype, ShadowRootPrototype], "querySelectorAll");
export const Node_querySelector = /* @__PURE__ */ getProp([ElementPrototype, DocumentPrototype, ShadowRootPrototype], "querySelector");

const ArrayPrototype = "Array.prototype";
export const Array_push = /* @__PURE__ */ getProp(ArrayPrototype, "push");
export const Array_pop = /* @__PURE__ */ getProp(ArrayPrototype, "pop");
export const Array_shift = /* @__PURE__ */ getProp(ArrayPrototype, "shift");
export const Array_unshift = /* @__PURE__ */ getProp(ArrayPrototype, "unshift");
export const Array_splice = /* @__PURE__ */ getProp(ArrayPrototype, "splice");
export const Array_slice = /* @__PURE__ */ getProp(ArrayPrototype, "slice");
export const Array_concat = /* @__PURE__ */ getProp(ArrayPrototype, "concat");
export const Array_indexOf = /* @__PURE__ */ getProp(ArrayPrototype, "indexOf");
export const Array_map = /* @__PURE__ */ getProp(ArrayPrototype, "map");

const StringPrototype = "String.prototype";
export const String_indexOf = /* @__PURE__ */ getProp(StringPrototype, "indexOf");
export const String_slice = /* @__PURE__ */ getProp(StringPrototype, "slice");
export const String_split = /* @__PURE__ */ getProp(StringPrototype, "split");
export const String_trim = /* @__PURE__ */ getProp(StringPrototype, "trim");
export const String_replace = /* @__PURE__ */ getProp(StringPrototype, "replace");
export const String_match = /* @__PURE__ */ getProp(StringPrototype, "match");

removeSafeFrame();