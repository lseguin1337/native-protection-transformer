import * as ts from 'typescript';
import { BaseTransformer } from './BaseTransformer';
import { parseRuntimeFile } from './parseRuntimeFile';

const runtimeFile = require.resolve("@contentsquare/runtime-protection");
const { globals: GLOBALS, properties: PROPERTIES } = parseRuntimeFile(runtimeFile);

export class NativeProtectionTransformer extends BaseTransformer {
  private importsToAdd: Set<string> = new Set();

  constructor(program: ts.Program, context: ts.TransformationContext) {
    super(program, context);
    this.ignoredDecoration = '@ignore-native-protection';
  }

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
      ts.factory.createNamedImports(imports.map(name => {
        const importedName = name.replace(/^GobalThis_/, '');
        return ts.factory.createImportSpecifier(false, importedName === name ? undefined : ts.factory.createIdentifier(importedName), ts.factory.createIdentifier(name));
      }))
    );
    const moduleSpecifier = ts.factory.createStringLiteral(runtimeFile);
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

  private setParent(node: ts.Node, parent: ts.Node) {
    (node as any).parent = parent;
  }

  protected transformNode(node: ts.Node): ts.Node | undefined {
    if (ts.isIdentifier(node) && GLOBALS.includes(node.text)) {
      this.importsToAdd.add(node.text);
      return node;
    }

    if (ts.isPropertyAccessExpression(node)) {
      const propertyText = node.name.text;
      const type = this.getTypeAtLocation(node.expression);
      if (GLOBALS.includes(propertyText) && ts.isIdentifier(node.expression) && node.expression.text === 'window') {
        const importName = `GobalThis_${propertyText}`;
        this.importsToAdd.add(importName);
        return ts.factory.createIdentifier(importName);
      }
      for (const TypeName in PROPERTIES) {
        const properties = PROPERTIES[TypeName];
        if (properties.includes(propertyText) && this.isSubtypeOf(type, TypeName)) {
          const importName = `${TypeName}_${propertyText}`;
          this.importsToAdd.add(importName);
          const accessExpression = this.createAccessExpression(node, importName);
          this.setParent(accessExpression, node.parent);
          return accessExpression;
        }
      }
    }
  }
}