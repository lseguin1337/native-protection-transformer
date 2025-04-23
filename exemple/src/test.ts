import { Foo } from './foo';

const a = [1, 2, 3];

function bootstrap() {
  const b = a.map((v) => v + 1);
  console.log(document.body.childNodes[0]?.childNodes.length, b, new Foo());
  document.body.querySelector('.abc'.replace('a','b'))?.childNodes[0]?.nodeType;
  navigator.sendBeacon('https://example.com', JSON.stringify({ foo: 'bar' }));

  /* @ignore-native-protection */ console.log(document.body.childNodes[0]?.childNodes.length);
  console.log(document.body.childNodes[0]?.childNodes.length);
}

bootstrap();