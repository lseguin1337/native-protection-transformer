import * as ts from 'typescript';

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

abstract class BaseTransformer {
  constructor(
    protected program: ts.Program,
    protected context: ts.TransformationContext
  ) {}

  protected abstract transformNode?(node: ts.Node): ts.Node | undefined;

  protected get typeChecker() {
    return this.program.getTypeChecker();
  }

  visit<N extends ts.Node>(node: N): N {
    const visit = (node: ts.Node): ts.Node => {
      if (this.transformNode) {
        const result = this.transformNode(node);
        if (result !== undefined) {
          return result;
        }
      }
      return ts.visitEachChild(node, this.visit.bind(this), this.context);
    };
    return ts.visitNode(node, visit) as N;
  }

  isSubtypeOf(type: ts.Type, targetTypeName: string): boolean {
    const targetSymbol = this.typeChecker.resolveName(
      targetTypeName,
      undefined,
      ts.SymbolFlags.Type,
      false
    );
  
    if (!targetSymbol) return false;
  
    const targetType = this.typeChecker.getDeclaredTypeOfSymbol(targetSymbol);
    return this.typeChecker.isTypeAssignableTo(type, targetType);
  }

  getTypeAtLocation(node: ts.Node): ts.Type {
    const checker = this.program.getTypeChecker();
    return checker.getTypeAtLocation(node);
  }
}

class NativeProtectionTransformer extends BaseTransformer {
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
    if (this.typeChecker.isArrayType(type)) {
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

export function nativeProtectionTransformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      return new NativeProtectionTransformer(program, context).transformFile(sourceFile);
    };
  };
}