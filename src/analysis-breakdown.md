---
theme: [dashboard, air]
style: entrust-style.css
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
