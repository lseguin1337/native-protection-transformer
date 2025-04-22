import * as ts from 'typescript';
import { readFileSync } from 'fs';

function extractExportedVariables(code: string) {
  const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest);
  const globals: string[] = [];
  const properties: Record<string, string[]> = {};

  function visitIndentifier(identifierName: string) {
    if (/_/.test(identifierName)) {
      const [key, value] = identifierName.split('_');
      if (!properties[key]) {
        properties[key] = [];
      }
      properties[key].push(value);
    } else {
      globals.push(identifierName);
    }
  }

  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node) && node.modifiers?.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(declaration => {
        if (declaration.name && ts.isIdentifier(declaration.name)) {
          visitIndentifier(declaration.name.text);
        }
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  return { globals, properties };
}

export function parseRuntimeFile(file: string) {
  const code = readFileSync(file, 'utf8');
  return extractExportedVariables(code);
}