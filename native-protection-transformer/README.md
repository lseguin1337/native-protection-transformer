# NativeProtectionTransformer

Library that exports a TypeScript transformer to protect native APIs.

This transformer adapts your code to use an iframe, restoring the original descriptor API and preventing overrides by third-party scripts.

## Installation

```shell
npm install --save-dev @contentsquare/native-protection-transformer # not available yet
```

## Usage

### With Rollup
```javascript
const typescript = require('@rollup/plugin-typescript');
const { nativeProtectionTransformer } = require('@contentsquare/native-protection-transformer');

module.exports = defineConfig({
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

### With Webpack
```javascript
const path = require('path');
const { nativeProtectionTransformer } = require('@contentsquare/native-protection-transformer');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: (program) => ({
                before: [nativeProtectionTransformer(program)],
              }),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
```

## Features

- Protects native APIs from being overridden.
- Easy integration with Rollup and Webpack.
- Supports TypeScript projects.

## Contributing

Feel free to submit issues or pull requests to improve the library.