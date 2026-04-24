---
title: Isolated analysis
style: ../entrust-style.css
---

# Isolated analysis

Generally, an isolated analysis consists of two parts: some function on the data in each node (a local function), and a function used to aggregate the outputs from each node (an aggregation function).
If you want to carry out basic statistics, you can get a lot by combining a few of these functions.

Below, there is a demonstrator to help you get a feel for how an isolated analysis can work.

```js
import { runInner, computeAggregate } from "../components/aggregateFunctions.js";
import { analyses } from "../components/decomposables.js";
import { displayIntermediates, displayNodes, displayArrows } from "../components/drawDiagrams.js";
import { populateNodes } from "../components/renderNodes.js";
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

Here are some text boxes.
It has some example data in it that will work for the kinds of analysis that take a single number from each row of a dataset.
You can put your own numbers in, just separate them with commas.


```js
const nodeN = view(Inputs.button(
  [
    ["Add Node", value => value + 1],
    ["Remove Node", value => value >= 2 ? value - 1 : value]
  ], {value: 3}
))
```

```js
const dummyNodes = view(populateNodes(nodeN))
```

This page will pretend that this is a dataset held across different nodes.


```js
const dummyData = dummyNodes.map(d => JSON.parse(`[${d}]`))
```


```js
const intermediates = runInner(analysisChoice.inner, dummyData)
```


```js
const dataNodes = html`${displayNodes(dummyData.length)}`;
const intermediatesRepr = html`${displayIntermediates(intermediates)}`;
const arrows = html`${displayArrows(dummyData.length)}`;
const arrows2 = html`${displayArrows(dummyData.length)}`;
```

### Functions

#### Local function
The way it does this is by applying a local function to each of the datasets.
The local function, "${analysisChoice.innerDescription.label}", ${analysisChoice.innerDescription.description}

#### Aggregation function

The analysis takes the output of ${analysisChoice.innerDescription.label} for each dataset and applies an aggregation function to these intermediate values.
The aggregation function, "${analysisChoice.outerDescription.label}", ${analysisChoice.outerDescription.description}

<div class="card">
  ${dataNodes}
  <div style="display:flex; justify-content:center;">
      ${analysisChoice.innerDescription.label}
  </div>
  ${arrows}
  ${intermediatesRepr}
  <div style="display:flex; justify-content:center;">
      ${analysisChoice.outerDescription.label}
  </div>
  ${arrows2}
  <div style="display: flex;
              justify-content: center;
              background: #EE7326;
              margin-left: 30px;
              margin-right: 30px;
              border-radius: 5px;">
    <span><b>Final Result:</b> ${computeAggregate(analysisChoice, dummyData)}</span>
  </div>
</div>

## Other statistics

This page only describes a few examples of the statistics that can be federated, if you can just calculate the counts, sums, and the sum of the products of variables in each node.
More common statistics can be federated from these parts.
In addition, many domain-specific statistics can be decomposed.

If you are trying to figure out whether that is true for yours, you need to find some set of statistics that can be calculated at a node, and some function for combining them at an aggregator to get the result you want.
Then, if you're working across TREs, you just have to determine whether the intermediate results are acceptable for egress by your TREs.

## Technical details

This section describes the construction of an isolated analysis in detail.
To start, we will consider the calculation of the arithmetic mean:

```tex
\bar{x} = \frac{\sum^n_{i=1}{x_i}}{n}
```

If you want to calculate the mean for a dataset you can see the whole of, the way you can think of calculating it is:

1. Count your number of instances (${tex`n`})
2. Add up your values (${tex`\sum^n_{i=1}{x_i}`})

This doesn't work if you can't see all of your data at once, though.
Ignoring federation for now, imagine you could only see one item of data at a time.
You couldn't calculate the mean each time, as you would lose the information needed for the next row.
For example, let's imagine we have a list of numbers: ${tex`27, 1, 26, 23, 15`}.

1. The mean of 27 is 27
2. The mean of 27 and 1 is 14
3. The mean of 14 and 26 is 20

This way of trying to calculate the mean breaks down on step 3, as the mean of 27, 1, and 26 is 18, not 20.
Luckily, in this imaginary scenario, we can store two numbers.
If instead, we write down the sum of values and a running total, we can do this instead.

1. Total = 27, Count = 1
2. Total = 28 (27 + 1), Count = 2 (1 + 1)
3. Total = 54 (28 + 26), Count = 3 (2 + 1)

etc.

This means at each stage, we can look at what we've stored, and calculate the mean from it by dividing the total by the count.
Now if you imagine that you have a friend who is very helpful and volunteers to do some of the calculation for you, you can apply the same logic.

4. You have calculated Total = 54, Count = 3
5. They calculate Total = 23, Count = 1
6. They calculate Total = 15, Count = 2

They can then pass you their Total and Count and you can use this to calculate the mean.
This is the essence of isolated analysis.
We have taken a basic statistic, the arithmetic mean, and defined:

- An object that contains the information needed to calculate our final result
- A function that takes the input and turns it into one of these objects
- A function that takes one of the objects and calculates the final result
- A function that combines these objects

There are different perspectives to take on how this works.

<input type="radio" name="tab" id="maths" checked>
<input type="radio" name="tab" id="typescript">
<input type="radio" name="tab" id="python">

<div class="tabs">
  <label for="maths">Mathematical description</label>
  <label for="typescript">Functional programming</label>
  <label for="python">Python example</label>
</div>

<div class="content">
  <div class="tab-content" id="maths-content">

    
```tex
\bar{x} = \frac{\sum^n_{i=1}{x_i}}{n}
```

```tex
\bar{x} = \frac{\sum^n_{i=1}{x_i}}{\sum^n_{i=1}{1}}
```
  </div>
  <div class="tab-content" id="python-content">


protocols
  </div>
  <div class="tab-content" id="typescript-content">


fold
  </div>
</div>

<style>
  /* Hide radio buttons */
  input[type="radio"] {
    display: none;
  }

  /* Style tab labels */
  label {
    padding: 10px 20px;
    display: inline-block;
    border: 1px solid gray;
    cursor: pointer;
  }

  /* Highlight active tab */
  #maths:checked ~ .tabs label[for="maths"],
  #python:checked ~ .tabs label[for="python"],
  #typescript:checked ~ .tabs label[for="typescript"] {
    background: #eee;
    font-weight: bold;
  }

  /* Hide all content sections */
  .tab-content {
    display: none;
    margin-top: 20px;
    font-size: 2rem;
  }

  /* Show selected tab content */
  #maths:checked ~ .content #maths-content,
  #python:checked ~ .content #python-content,
  #typescript:checked ~ .content #typescript-content {
    display: block;
  }
</style>
