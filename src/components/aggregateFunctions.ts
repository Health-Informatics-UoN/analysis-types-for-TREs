export enum FunctionDescriptor {
  Sum,
  Product,
  Count,
  SumOfSquares,
};

export type AggregateFunction = {
  innerFunction: Function;
  innerFunctionDescriptors: String[];
  outerFunction: Function;
  outerFunctionDescriptors: String[];
};

export function applyAggregate (aggregateFunction: AggregateFunction, data: number[][]): number {
  return data.map(aggregateFunction.innerFunction)
             .reduce(aggregateFunction.outerFunction)
}
