import type { OuterFunction } from "./aggregateFunctions.js";

export const sumIntermediates: OuterFunction<number, number> = {
    aggregate: (a, b) => a + b,
    identity: 0,
    finalise: (x) => x
}

export const gatherAvgIntermediates: OuterFunction<{sum: number, count: number}, number> = {
  aggregate: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count}),
  identity: {sum: 0, count: 0},
  finalise: (x: {sum: number, count: number}) => x.sum/x.count
}

export const outerFunctionDescriptions = {
  sumIntermediates: {
    label: "Sum the intermediate values",
    description: "Take all the intermediate values and add them together"
  },
  gatherAvgIntermediates: {
    label: "Gather averaging intermediates",
    description: "Take the count and sum from each node and sum each. Then, calculate the mean by dividing sum by count."
  }
}
