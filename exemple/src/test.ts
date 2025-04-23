import { Foo } from "./foo";

console.log(Foo);

function del(klassName: any, prop: string) {
  const klass: any = window[klassName];
  if (klass && klass.prototype) {
    klass.prototype[prop] = () => {
      throw new Error("Native function overridden");
    };
  }
}

function test(fn: Function) {
  try {
    fn();
  } catch (e) {
    // @ts-ignore
    console.error(e.message, fn.toString());
  }
}

del("Array", "map");
del("String", "replace");

const arr = [1, 2, 3, 4, 5];

test(() => console.log(arr.map((x) => x * 2)));
test(() => console.log(arr.length.toString().replace("5", "five")));

export function stringTest() {
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
  const mutationObserver = new MutationObserver(console.log);
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
