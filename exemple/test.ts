function bootstrap() {
  const time = Date.now();
  const myArray = [1, 2, 3];
  const myString = "Hello, world!";

  let el: Element | null = null;

  setTimeout(() => {
    el = document.createElement("div");
  }, 20)

  setTimeout(() => {
    console.log(time, document.body.childNodes.length);
    console.log('el', el?.childNodes[0]?.nodeType);
    myArray.push(4);
    console.log(myString.split(" "));
  }, 1000);
}

bootstrap();