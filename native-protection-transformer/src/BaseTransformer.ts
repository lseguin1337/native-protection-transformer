import * as ts from 'typescript';

export abstract class BaseTransformer {
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
    if (type.isUnion()) {
      // TODO: check if null or undefined and raise an error if it's an other object
      return type.types.some((t) => this.isSubtypeOf(t, targetTypeName));
    }
    if (targetTypeName === 'Array') {
      return this.typeChecker.isArrayType(type);
    }
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