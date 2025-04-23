import { Foo } from "./foo";

console.log(Foo);
export function stringTest() {
  const arr = [1, 2, 3, 4, 5];
  const five = arr.length.toString().replace("5", "five");
  const str = "Hello, world!";
  return five + str.replace("world", "TypeScript");
}

export function arrayTest(arr1: number[]) {
  const arr2 = [1, 2, 3];
  return arr1
    .map((x) => x * 2)
    .filter((i) => i > 2)
    .concat(arr2.map((x) => x * 2));
}

export function nodeTest(event: Event) {
  if (!event.target || (event.target as Node).nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  if (event.target instanceof HTMLImageElement) {
    event.target.src = "https://example.com/image.png";
  }

  const target = event.target as HTMLElement;
  document.createElement("div").shadowRoot;
  document.createElement("div").matches(".live");
  const parent = target.parentNode;
  const firstChild = target.firstChild;
  const nextSibling = target.nextSibling;
  return {
    parent,
    firstChild,
    nextSibling,
    all: target.querySelectorAll("*"),
  };
}

export function globalFunctions() {
  setTimeout(console.log);
  queueMicrotask(console.log);
  const interval = setInterval(console.log);
  clearTimeout(0);
  clearInterval(interval);
  const mutationObserver = new window.MutationObserver(console.log);
  const mutationObserver2 = new MutationObserver(console.log);
  const fileReader = new FileReader();
  const symbol = Symbol("test");
  const regExp = new RegExp("test");
  const url = new URL("https://example.com");
  const screen = window.screen;
  const json = JSON.parse('{"test": "test"}');
  const date = new Date().getDate() + Date.now();
  navigator.sendBeacon("https://example.com", "test");

  return [
    mutationObserver,
    mutationObserver2,
    fileReader,
    symbol,
    regExp,
    url,
    screen,
    json,
    date,
  ];
}

export function matchesTest(element: HTMLElement) {
  const e: Element = document.createElement("div");
  e.matches(".live");
  return document.body.matches(".live") && element.matches(".live");
}

export function querySelectorTest() {
  document.querySelector("div")?.querySelector("span");
  document.querySelector("div")?.shadowRoot?.querySelector("span");

  document.querySelector("div")!.querySelector("span");
  document.querySelector("div")!.shadowRoot!.querySelector("span");
}

export function instanceOfStuff() {
  let foo: any = null;
  if (foo instanceof Array) {
    console.log("foo is an array");
  }
}

export function nodeTypeTest() {
  const node = document.createElement("div");
  if (node.nodeType === Node.ELEMENT_NODE) {
    console.log("node is an element");
  }
  if (node.nodeType === Node.TEXT_NODE) {
    console.log("node is a text node");
  }
}

export function unionTest(root: Document | ShadowRoot, selector: string) {
  return root.querySelector(selector);
}

export function anyTest(toto: any) {
  toto.split("toto");
  toto.childNodes;
  toto.parentNode;
  toto.firstChild;
  toto.lastChild;
  toto.querySelector("toto");
}