import * as ts from 'typescript';
import { NativeProtectionTransformer } from './NativeProtectionTransformer';

export function nativeProtectionTransformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      return new NativeProtectionTransformer(program, context).transformFile(sourceFile);
    };
  };
}