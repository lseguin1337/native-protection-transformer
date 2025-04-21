function bootstrap() {
  const a = [1, 2, 3];
  const b = a.map((v) => v + 1);
  console.log(document.body.childNodes[0]?.childNodes.length, b);
  document.body.querySelector('.abc'.replace('a','b'))?.childNodes[0]?.nodeType;
}

bootstrap();