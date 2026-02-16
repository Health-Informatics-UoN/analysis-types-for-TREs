import { AnalysisDescription } from "./aggregateFunctions";
import { countRows, sumRows, sumAndCountRows, innerFunctionDescriptions } from "./innerFunctions";
import { sumIntermediates, gatherAvgIntermediates, outerFunctionDescriptions } from "./outerFunctions";


export const analyses: AnalysisDescription<any, any, number>[]  = [
  {
    label: "Count All",
    decomposableDescription: "Count the rows across the dataset",
    inner: countRows,
    outer: sumIntermediates,
    innerDescription: innerFunctionDescriptions.countRows,
    outerDescription: outerFunctionDescriptions.sumIntermediates
  }
}
