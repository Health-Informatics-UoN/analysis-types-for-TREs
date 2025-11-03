---
theme: [dashboard, air]
title: Get analyses by requirements
toc: false
---

```js
import { Statistic, Algorithm } from "./components/display_statistic.js"
```

# Available analyses

## TRE requirements

<!-- Load data -->
```js
const statistics = FileAttachment("./data/statistics.csv").csv();
const algorithms = FileAttachment("./data/algorithms.csv").csv();
const aliases = FileAttachment("./data/statistic_aliases.csv").csv();
const observableData = FileAttachment("./data/observable_data.csv").csv();
const statisticRelationships = FileAttachment("./data/statistic_relationships.csv").csv();
const statbarns = FileAttachment("./data/statbarns.csv").csv();
```

<!-- Old filter form
```js
const filters = view(Inputs.form({
  // Trust requirements
  trust_level: Inputs.select(
    ["Any", "Aggregate data only", "Row-level data acceptable"],
    {
      label: "Trust level with aggregator",
      value: "Aggregate data only"
    }
  ),
  
  // Communication capabilities
  communication_rounds: Inputs.select(
    ["Any", "One round only", "Multiple rounds OK"],
    {
      label: "Communication rounds",
      value: "One round only"
    }
  ),
  
  // Execution model
  branching_capable: Inputs.toggle(
    {
      label: "Capable of branching execution",
      value: false
    }
  ),
  
  // Persistent executors
  persistence_capable: Inputs.toggle(
    {
      label: "Capable of persistent execution",
      value: false
    }
  ),
  
  // Privacy methods
  privacy_methods: Inputs.checkbox(
    ["Differential Privacy", "Homomorphic Encryption", "Secure MPC"],
    {
      label: "Privacy-preserving methods available",
      value: []
    }
  ),
  
  // Separability preference
  separability: Inputs.checkbox(
    ["none", "fully", "iterative"],
    {
      label: "Acceptable decomposability",
      value: ["fully", "iterative"]
    }
  ),
  
  // Output type filter
  output_types: Inputs.checkbox(
    ["scalar", "vector", "matrix", "table", "higher-order", "text", "graphic"],
    {
      label: "Required output types",
      value: ["scalar", "vector", "matrix", "table"]
    }
  )
}));
``` -->

```js
const algo_filters = view(Inputs.form({
    
    //branching_capable: Inputs.toggle(
    //  {
    //    label: "Capable of branching execution",
    //    value: false
    //  }
    //),
    acceptable_separability: Inputs.checkbox(
        ["fully", "iterative", "none"],
        {
            label: "Acceptable separability",
            value: ["fully"]
        } 
    ),
    acceptableCommunicationDirection: Inputs.checkbox(
        ["client to aggregator", "bidirectional"],
        {
            label: "Acceptable communication directions",
            value: ["client to aggregator"]
        }
    ),
}));
```

```js
const algorithmList = algorithms.map(
    d => {
        const algo = new Algorithm(d);
        algo.addObservables(observableData);
        return algo
    }
).filter(
    d => {
        // Separability check
        if (!algo_filters.acceptable_separability.includes(d.separability)){
            return false;
        };
        // Branching execution - not relevant until I have examples
        //if (d.requiresBranching && !algo_filters.branching_capable){
        //    return false;
        //};
        if (!algo_filters.acceptableCommunicationDirection.includes(d.communicationDirection)){
            return false;
        };
        return true;
    }
);

const statisticsList = statistics.map(
    d => {
        const stat = new Statistic(d);
        stat.addAliases(aliases);
        stat.addAlgorithms(algorithmList);
        if (stat.algorithms.length > 0) {
            return stat
        }
    }
).filter(stat => stat != null);
```

There are ${statisticsList.length} compatible statistics, implemented with ${algorithmList.length} total algorithms.

```js
html`${statisticsList.map(stat => stat ? stat.display(): "")}`
```
