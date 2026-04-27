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

- An object that contains the information needed to calculate our final result (an intermediate result)
- A function that takes the input and turns it into one of these objects (referred to above as the inner function)
- A function that takes one of the objects and calculates the final result
- A function that combines these objects

The way you build one of these objects doesn't have to work element-wise like the example above.
In fact, it normally will not be the efficient way to do so.
For example, if your data are in a database, just use `SUM` and `COUNT`.
However, if you **can** make one and define the rules for combining them and getting your final result, then you can do it for arbitrary divisions of your data.

There are different perspectives to take on how this works.

### Perspectives

<input type="radio" name="tab" id="python">
<input type="radio" name="tab" id="typescript">
<input type="radio" name="tab" id="maths" checked>

<div class="tabs">
  <label for="python">Python example</label>
  <label for="typescript">Functional programming</label>
  <label for="maths">Mathematical description</label>
</div>

<div class="content">
  <div class="tab-content" id="maths-content">

    
We started with the definition of the arithmetic mean:
```tex
\bar{x} = \frac{\sum^n_{i=1}{x_i}}{n}
```

But what are we calculating here?

**HOW DO I ANNOTATE THIS?**
```tex
\bar{x} = f(sub\ total, sub\ count) = \frac{\sum^n_{i=1}{x_i}}{\sum^n_{i=1}{1}}
```

#### Monoids

There is a mathematical structure called a [monoid](https://en.wikipedia.org/wiki/Monoid).
A monoid is a set (${tex`S`}), with an operation (${tex`\cdot`}) that needs three properties.

- Using ${tex`\cdot`} on two elements of ${tex`S`} has to make another ${tex`S`}
- The operation has to be associative, so for ${tex`a,b`} and ${tex`c`} in ${tex`S`}, ${tex`(a \cdot b) \cdot c = a \cdot (b \cdot c)`}
- There needs to be an identity element, ${tex`e`} where ${tex`a \cdot e = a`} and ${tex` e \cdot a = a`}

This looks suspiciously like the function that combines the objects as described above.
Luckily for us, a lot of statistics can be computed using building blocks that can be combined with associative operations: real numbers and addition form a monoid (with 0 as an identity element), and positive real numbers and multiplication (with 1 as an identity element).
There are other ways to federate statistics, but if you can break the calculation down into something that can be calculated from monoids that can be aggregated means you can federate it.
  </div>
  <div class="tab-content" id="python-content">


protocols
  </div>
  <div class="tab-content" id="typescript-content">


#### Examples in Typescript
Above, we vaguely refer to "inner functions" and "outer functions", but we have concrete examples, which definitely work because they are what drives the interactive examples.

##### Inner function
The inner function is what takes input and turns it into objects that can be combined or used to calculate the final result.
This is actually two functions: the function that turns input values into the intermediate, and a function for combining the intermediates.

Typescript provides some nice ways to wrap these up: interfaces and generics.
This code defines code that works on the generic types `T` and `S`.

```js echo run=false
export interface InnerFunction<T, S> {
  // apply is what happens to each row
  apply: (item: T) => S;
  // merge is how rows within a 
  merge: (a: S, b: S) => S;
  identity: S;
}
```

The example for the mean is:

```js echo run=false
export const sumAndCountRows: InnerFunction<number, {sum: number, count: number}> = {
  apply: (x) => ({sum: x, count: 1}),
  merge: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count}),
  identity: {sum: 0, count: 0}
}
```

so `T` is number and `S` is a pair of sum and count.

Once we have functions to go from `T` to `S` and two of `S` to another `S`, we can use them to aggregate locally by:

```js echo run=false
export function runInner<T, S>(
  inner: InnerFunction<T, S>,
  data: T[][]
): S[] {
  return data
  .map(
    ds => ds
    .map(inner.apply)
    .reduce(inner.merge, inner.identity)
  )
}
```

##### Outer function
We don't want intermediate values, though; we want the final result.
The nice thing about having the types `T` and `S` is that we can have a type, `R`, where

```js echo run=false
export interface Decomposable<T, S, R> {
  inner: InnerFunction<T, S>;
  outer: OuterFunction<S, R>;
}
```

By lining up the output of `InnerFunction` and the input of `OuterFunction` by giving them the same type, we have a path to get from `T` to `R` via `S`.
We then get to define the two functions of the `Outerfunction`, the part that combines `S`, and the part that turns `S` into `R`
    
```js echo run=false
export interface OuterFunction<S, R> {
  // the aggregate function is what takes the intermediate results and produces the final result
  aggregate: (aggregate: S, intermediate: S) => S;
  identity: S;
  finalise: (aggregate: S) => R;
}
```

For the mean example above, this is:

```js echo run=false
export const gatherAvgIntermediates: OuterFunction<{sum: number, count: number}, number> = {
  aggregate: (a, b) => ({sum: a.sum + b.sum, count: a.count + b.count}),
  identity: {sum: 0, count: 0},
  finalise: (x: {sum: number, count: number}) => x.sum/x.count
}
```

To tie the whole thing together, we can apply the parts with:

```js echo run=false
export function computeAggregate<T, S, R>(
  agg: Decomposable<T, S, R>,
  data: T[][],
): R {
    const intermediates: S[] = data
    .map(
      ds => ds
      .map(agg.inner.apply)
      .reduce(agg.inner.merge, agg.inner.identity)
    );

    const aggregateResult = intermediates.reduce(
      agg.outer.aggregate,
      agg.outer.identity
    )

    return agg.outer.finalise(aggregateResult)
}
```


#### Higher-order functions
You might be wondering what the point of this section is; there is already a python example, which is a more common language for statistics.



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
  }

  /* Show selected tab content */
  #maths:checked ~ .content #maths-content,
  #python:checked ~ .content #python-content,
  #typescript:checked ~ .content #typescript-content {
    display: block;
  }
</style>
