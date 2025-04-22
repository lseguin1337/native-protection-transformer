import * as ts from 'typescript';
import { readFileSync } from 'fs';

function extractExportedVariables(code: string): string[] {
  const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest);
  const exportedVariables: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node) && node.modifiers?.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(declaration => {
        if (declaration.name && ts.isIdentifier(declaration.name)) {
          exportedVariables.push(declaration.name.text);
        }
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  return exportedVariables;
}

export function parseRuntimeFile(file: string) {
  const code = readFileSync(file, 'utf8');
  const variables = extractExportedVariables(code);
  const globals = variables.filter(variable => !/_/.test(variable));
  const properties = variables.filter(variable => /_/.test(variable)).reduce((acc, variable) => {
    const [className, propName] = variable.split('_');
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(propName);
    return acc;
  }, {} as Record<string, string[]>);

  return {
    globals,
    properties
  };
}