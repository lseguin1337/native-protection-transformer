import * as ts from 'typescript';
import { BaseTransformer } from './BaseTransformer';

type WrappedDeclaration =
  | ts.EnumDeclaration
  | ts.ClassDeclaration
  | ts.ModuleDeclaration;

export class PureTransformer extends BaseTransformer {
  transformFile(sourceFile: ts.SourceFile): ts.SourceFile {
    return this.visit(sourceFile);
  }

  protected createPureIife(expression: ts.Expression | ts.Block): ts.CallExpression {
    const iife = ts.factory.createCallExpression(
      ts.factory.createParenthesizedExpression(
        ts.factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          expression
        ),
      ),
      undefined,
      []
    );
    ts.addSyntheticLeadingComment(iife, ts.SyntaxKind.MultiLineCommentTrivia, " @__PURE__ ", false);
    return iife;
  }

  private transformVariableStatement(node: ts.VariableStatement): ts.VariableStatement {
    const declarations = node.declarationList.declarations.map(declaration => {
      if (declaration.initializer) {
        return ts.factory.createVariableDeclaration(
          declaration.name,
          declaration.exclamationToken,
          declaration.type,
          this.createPureIife(declaration.initializer),
        );
      }
      return declaration;
    });
    return ts.factory.createVariableStatement(
      node.modifiers,
      ts.factory.createVariableDeclarationList(
        declarations,
        node.declarationList.flags
      )
    );
  }

  private transformDeclaration(node: WrappedDeclaration) {
    const identifier = node.name?.text || 'LocalClassName';
    if (!node.name) {
      (node as any).name = ts.factory.createIdentifier(identifier);
    }
    const wasExported = node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) || false;
    const wasDefaultExported = node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword) || false;
    if (wasExported || wasDefaultExported) {
      (node as any).modifiers = node.modifiers?.filter(modifier => modifier.kind !== ts.SyntaxKind.ExportKeyword && modifier.kind !== ts.SyntaxKind.DefaultKeyword);
    }
    const statement = ts.factory.createVariableStatement(
      [],
      ts.factory.createVariableDeclarationList(
        [ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(identifier),
          undefined,
          undefined,
          this.createPureIife(ts.factory.createBlock([
            node,
            ts.factory.createReturnStatement(ts.factory.createIdentifier(identifier)),
          ])),
        )],
        ts.NodeFlags.Const,
      ),
    );
    
    if (wasDefaultExported) {
      return ts.factory.createNodeArray([
        node,
        ts.factory.createExportDefault(ts.factory.createIdentifier(identifier)),
      ]);
    }
    (statement as any).modifiers = wasExported
      ? [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)]
      : [];
    return statement;
  }

  protected transformNode(node: ts.Node) {
    if (node.parent && !ts.isSourceFile(node.parent)) {
      return;
    }
    if (ts.isVariableStatement(node)) {
      return this.transformVariableStatement(node);
    }
    if (ts.isClassDeclaration(node) || ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node)) {
      return this.transformDeclaration(node);
    }
  }
}