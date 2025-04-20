function bootstrap() {
  const time = Date.now();
  const myArray = [1, 2, 3];
  const myString = "Hello, world!";

  setTimeout(() => {
    console.log({ time });
    console.log('Node.querySelectorAll', document.querySelectorAll("div"));
    console.log('Node.childNodes.length', document.body.childNodes.length);
    console.log('Node.childNodes[0].nodeType', document.body.childNodes[0]?.nodeType);
    console.log('Array.push', myArray.push(4));
    console.log('String.split', myString.split(" "));
    console.log(document.body.querySelector('.abc'.replace('a','b'))?.childNodes[0]?.nodeType);
  }, 1000);
}

bootstrap();