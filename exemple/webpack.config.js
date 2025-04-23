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
  plugins: [
    new webpack.DefinePlugin({
      'Node.ELEMENT_NODE': JSON.stringify(1),
      'Node.ATTRIBUTE_NODE': JSON.stringify(2),
      'Node.TEXT_NODE': JSON.stringify(3),
      'Node.CDATA_SECTION_NODE': JSON.stringify(4),
      'Node.ENTITY_REFERENCE_NODE': JSON.stringify(5),
      'Node.ENTITY_NODE': JSON.stringify(6),
      'Node.PROCESSING_INSTRUCTION_NODE': JSON.stringify(7),
      'Node.COMMENT_NODE': JSON.stringify(8),
      'Node.DOCUMENT_NODE': JSON.stringify(9),
      'Node.DOCUMENT_TYPE_NODE': JSON.stringify(10),
      'Node.DOCUMENT_FRAGMENT_NODE': JSON.stringify(11),
      'Node.NOTATION_NODE': JSON.stringify(12),
    }),
  ],
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