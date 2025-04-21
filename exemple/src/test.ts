import { Foo } from './foo';

const a = [1, 2, 3];
const b = a.map((v) => v + 1);

function bootstrap() {
  console.log(document.body.childNodes[0]?.childNodes.length, b, new Foo());
  document.body.querySelector('.abc'.replace('a','b'))?.childNodes[0]?.nodeType;
}

bootstrap();