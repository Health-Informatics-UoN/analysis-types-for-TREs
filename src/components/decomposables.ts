import type { AnalysisDescription } from "./aggregateFunctions.js";
import { countRows, sumRows, sumAndCountRows, innerFunctionDescriptions, maxRows, minRows } from "./innerFunctions.js";
import { sumIntermediates, gatherAvgIntermediates, outerFunctionDescriptions, maxIntermediates, minIntermediates } from "./outerFunctions.js";


export const analyses: AnalysisDescription<any, any, number>[]  = [
  {
    label: "Count All",
    decomposableDescription: "Count the rows across the datasets",
    inner: countRows,
    outer: sumIntermediates,
    innerDescription: innerFunctionDescriptions.countRows,
    outerDescription: outerFunctionDescriptions.sumIntermediates
  },
  {
    label: "Sum All",
    decomposableDescription: "Sum values across the datasets",
    inner: sumRows,
    outer: sumIntermediates,
    innerDescription: innerFunctionDescriptions.sumRows,
    outerDescription: outerFunctionDescriptions.sumIntermediates
  },
  {
    label: "Mean across all",
    decomposableDescription: "Calculate the mean of all values across datasets",
    inner: sumAndCountRows,
    outer: gatherAvgIntermediates,
    innerDescription: innerFunctionDescriptions.sumAndCountRows,
    outerDescription: outerFunctionDescriptions.gatherAvgIntermediates
  }
]
