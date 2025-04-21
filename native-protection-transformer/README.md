# NativeProtectionTransformer

Library that export the transformer for typescript.

This Transformer will adapt your code and use an iframe to restore the original descriptor API and prevent any override from the third party website.

## How to use it?

```shell
npm install --save-dev @contentsquare/native-protection-transformer # not available yet
```

### with rollup:
```javascript
// ...
const typescript = require('@rollup/plugin-typescript');
const { nativeProtectionTransformer } = require('@contentsquare/native-protection-transformer');

module.exports = defineConfig({
  // ...
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      transformers: {
        before: [{ type: 'program', factory: nativeProtectionTransformer }],
      },
    })
  ],
});
```

### with webpack:
```javascript
// TODO: add webpack exemple
```