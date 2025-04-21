function bootstrap() {
  console.log(document.body.childNodes[0]?.childNodes.length);
  document.body.querySelector('.abc'.replace('a','b'))?.childNodes[0]?.nodeType;
}

bootstrap();