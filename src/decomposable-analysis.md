---
title: Decomposable analysis
style: entrust-style.css
---

# Decomposable analysis

Generally, a decomposable analysis consists of two parts: some function on the data in each node, and a function used to aggregate the outputs from each node.
If you want to carry out basic statistics, you can get a lot by combining a few of these functions.

```js
import { runInner, computeAggregate } from "./components/aggregateFunctions.js";
import { analyses } from "./components/decomposables.js";
```

```js
const analysisChoice = view(
  Inputs.select(
    analyses,
    {
      label: "Choose an analysis",
      format: (t) => t.label,
      value: analyses.find((t) => t.label === "Count All")
    }
  )
)
```

## ${analysisChoice.label}

Overall, this analysis ${analysisChoice.decomposableDescription}

### Running an example

Here's a text box.
It has some example data in it that will work for the kinds of analysis that take a single number from each row of a dataset.

This page will pretend that this is a dataset held across different nodes.
You can put your own in here, just make sure it's an array surrounded by `[ ]`, which in turn contains arrays of numbers.
The inner arrays of numbers (e.g. ${dummyData[0].join(', ')}) are pretend nodes.

```js
const dummyDataInput = view(Inputs.textarea(
  {
    value:
`[
[1, 2, 3, 4, 5],
[6, 7, 8, 9, 10],
[11, 12, 13, 14, 15]
]`,
    submit: true
  }
))
```

This has ${dummyData.length} nodes.

```js
const dummyData = JSON.parse(dummyDataInput);
```

### Functions

#### Inner function
The way it does this is by applying an inner function to each of the datasets.
The inner function, "${analysisChoice.innerDescription.label}", ${analysisChoice.innerDescription.description}
The inner function, ${analysisChoice.innerDescription.label}, returns an array for this distributed dataset:

```js
const intermediates = runInner(analysisChoice.inner, dummyData)
```

```js
function displayIntermediates(intermediateResults) {
    const boxes = intermediateResults.map((d, i) =>
        html`
        <div style="background: #EE7326; margin: 30px; border-radius: 5px;">
            <h4 style="color: #204F90">Node ${i+1}</h4>
            <p>${JSON.stringify(d)}</p>
        </div>
        `
    )
    return html`<div style="display: flex; align-items: center; justify-content: center;"> ${boxes} </div>`
}
```

```js
html`${displayIntermediates(intermediates)}`
```

#### Outer function

The analysis takes the output of ${analysisChoice.innerDescription.label} for each dataset and applies an outer function to these intermediate values.
The outer function, "${analysisChoice.outerDescription.label}", ${analysisChoice.outerDescription.description}

**Final Result:** ${computeAggregate(analysisChoice, dummyData)}

