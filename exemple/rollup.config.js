const { defineConfig } = require("rollup");
const typescript = require("@rollup/plugin-typescript");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const {
  nativeProtectionTransformer,
} = require("@contentsquare/native-protection-transformer");
const { pureTransformer } = require("@contentsquare/pure-transformer");

module.exports = defineConfig({
  input: ["src/test.ts"], // Point d'entrée principal
  output: [
    {
      file: "out/rollup.js",
      format: "esm", // Format ES Module
      sourcemap: false,
    },
  ],
  plugins: [
    nodeResolve(), // Résolution des modules Node.js
    commonjs(), // Conversion des modules CommonJS en ES Modules
    typescript({
      tsconfig: "./tsconfig.json", // Chemin vers le fichier de configuration TypeScript
      transformers: {
        before: [
          { type: "program", factory: pureTransformer }, // TODO: understand why I can't invert the order
          { type: "program", factory: nativeProtectionTransformer },
        ],
      },
    }),
  ],
});
