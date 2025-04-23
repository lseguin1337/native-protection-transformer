const path = require('path');
const { nativeProtectionTransformer } = require('@contentsquare/native-protection-transformer');
const { pureTransformer } = require('@contentsquare/pure-transformer');

module.exports = {
  mode: 'production',
  entry: './src/test.ts', // Point d'entrée principal
  output: {
    filename: 'webpack.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'module', // Format ES Module
  },
  experiments: {
    outputModule: true, // Nécessaire pour le format ES Module
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: false, // Disable code minification
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
                before: [
                  pureTransformer(program), // TODO: understand why I can't invert the order
                  nativeProtectionTransformer(program),
                ],
              }),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};