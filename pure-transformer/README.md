# PureTransformer

The `PureTransformer` package provides a TypeScript transformer that optimizes code by wrapping certain declarations and expressions in Immediately Invoked Function Expressions (IIFEs) marked with the `@__PURE__` annotation. This helps tools like Terser to perform better tree-shaking and dead code elimination.

## Features

- Wraps variable initializers and declarations in `@__PURE__` IIFEs.
- Optimizes class, enum, and module declarations for better tree-shaking.
- Ensures compatibility with TypeScript projects.

## Installation

```shell
npm install --save-dev @contentsquare/pure-transformer # not available yet
```

## Usage

### With Rollup
```javascript
const typescript = require('@rollup/plugin-typescript');
const { pureTransformer } = require('@contentsquare/pure-transformer');

module.exports = {
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      transformers: {
        before: [pureTransformer],
      },
    }),
  ],
};
```

### With Webpack
```javascript
const path = require('path');
const { pureTransformer } = require('@contentsquare/pure-transformer');

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
                before: [pureTransformer(program)],
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

## API

### `pureTransformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile>`
Creates a transformer that processes TypeScript source files to wrap certain declarations and expressions in `@__PURE__` IIFEs.

## Contributing

Feel free to submit issues or pull requests to improve the library.