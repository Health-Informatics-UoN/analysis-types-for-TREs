import type { InnerFunction } from "./aggregateFunctions.js";

export const countRows: InnerFunction<number, number> = {
    apply: (_) => 1,
    merge: (a, b) => a + b,
    identity: 0
}

export const sumRows: InnerFunction<number, number> = {
  apply: (x) => x,
  merge: (a, b) => a + b,
  identity: 0
}

export const sumAndCountRows: InnerFunction<number, {sum: number, count: number}> = {
  apply: (x) => ({sum: x, count: 1}),
  merge: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count}),
  identity: {sum: 0, count: 0}
}

export const innerFunctionDescriptions = {
  countRows: {
    label: "Count Rows",
    description: "Count the number of instances"
  },
  sumRows: {
    label: "Sum Rows",
    description: "Sum the instances"
  },
  sumAndCountRows: {
    label: "Sum and Count Rows",
    description: "Both count and sum the instances, returning both"
  }
}
