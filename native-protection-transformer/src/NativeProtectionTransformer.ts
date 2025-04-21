import * as ts from 'typescript';
import { BaseTransformer } from './BaseTransformer';

const GLOBALS = [
  'setTimeout', 'queueMicrotask', 'clearTimeout', 'setInterval', 'clearInterval',
  'Date', 'JSON', 'URL', 'MutationObserver', 'RegExp', 'screen'
];

const PROPERTIES = {
  'array': ['push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'concat', 'indexOf', 'map'],
  'string': ['indexOf', 'slice', 'split', 'trim', 'replace', 'match'],
  'node': [
    'nodeType', 'parentNode', 'childNodes', 'firstChild', 'lastChild', 'nextSibling',
    'previousSibling', 'shadowRoot', 'localName', 'querySelectorAll', 'querySelector'
  ],
};

export class NativeProtectionTransformer extends BaseTransformer {
  private importsToAdd: Set<string> = new Set();

  transformFile(sourceFile: ts.SourceFile): ts.SourceFile {
    const transformedSourceFile = this.visit(sourceFile);
    if (this.importsToAdd.size > 0) {
      const importDeclaration = this.createImportDeclaration(Array.from(this.importsToAdd));
      return ts.factory.updateSourceFile(transformedSourceFile, [
        importDeclaration,
        ...transformedSourceFile.statements,
      ]);
    }
    return transformedSourceFile;
  }

  protected createImportDeclaration(imports: string[]): ts.ImportDeclaration {
    const importClause = ts.factory.createImportClause(
      /* isTypeOnly */ false,
      /* name (default import) */ undefined,
      ts.factory.createNamedImports(imports.map(name => ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(name))))
    );
    const moduleSpecifier = ts.factory.createStringLiteral(require.resolve("@contentsquare/runtime-protection"));
    return ts.factory.createImportDeclaration(
      undefined,
      importClause,
      moduleSpecifier
    );
  }

  protected createAccessExpression(node: ts.PropertyAccessExpression, identifierName: string): ts.ElementAccessExpression {
    const identifier = ts.factory.createIdentifier(identifierName);
    const expression = this.visit(node.expression);
    if (node.questionDotToken) {
      return ts.factory.createElementAccessChain(expression, node.questionDotToken, identifier);
    }
    return ts.factory.createElementAccessExpression(expression, identifier);
  }

  protected getTypeNameAtLocation(node: ts.Node): string {
    const type = this.getTypeAtLocation(node);
    if (this.isSubtypeOf(type, 'Array')) {
      return 'array';
    }
    if (this.isSubtypeOf(type, 'Node')) {
      return 'node';
    }
    if (this.isSubtypeOf(type, 'String')) {
      return 'string';
    }
    return 'unknown';
  }

  protected transformNode(node: ts.Node): ts.Node | undefined {
    if (ts.isIdentifier(node) && GLOBALS.includes(node.text)) {
      this.importsToAdd.add(node.text);
      return node;
    }

    if (ts.isPropertyAccessExpression(node)) {
      const propertyText = node.name.text;
      const leftTypeName = this.getTypeNameAtLocation(node.expression);
      if (leftTypeName in PROPERTIES) {
        const properties = PROPERTIES[leftTypeName as keyof typeof PROPERTIES];
        if (properties.includes(propertyText)) {
          const importName = `${leftTypeName}${propertyText.replace(/^[a-z]/, c => c.toUpperCase())}`;
          this.importsToAdd.add(importName);
          return this.createAccessExpression(node, importName);
        }
      }
    }
  }
}