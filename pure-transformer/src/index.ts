import * as ts from 'typescript';
import { PureTransformer } from './PureTransformer';

export function pureTransformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      return new PureTransformer(program, context).transformFile(sourceFile);
    };
  };
}