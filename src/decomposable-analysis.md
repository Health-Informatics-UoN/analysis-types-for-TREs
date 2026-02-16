---
title: Decomposable analysis
style: entrust-style.css
---

# Decomposable analysis

Generally, a decomposable analysis consists of two parts: some function on the data in each node, and a function used to aggregate the outputs from each node.
If you want to carry out basic statistics, you can get a lot by combining a few of these functions.

```js
import {
    InnerFunction,
    runInner,
    OuterFunction,
    Decomposable,
    computeAggregate,
    countRows,
    sumRows,
    sumIntermediates
} from "./components/aggregateFunctions.js"
```

```js
const dummyDataInput = view(Inputs.textarea(
  {
    label: "Put some data in here!",
    value: `[
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15]
    ]`,
    submit: true
  }
))
```

```js
const dummyData = JSON.parse(dummyDataInput);
```

```js
runInner(countRows, dummyData)
```

```ts echo
const countAll: Decomposable<number, number, number> = {
    inner: countRows,
    outer: sumIntermediates
}

display(computeAggregate(countAll, dummyData))
```

```ts echo
const sumAll: Decomposable<number, number, number> = {
    inner: sumRows,
    outer: sumIntermediates
}

display(computeAggregate(sumAll, dummyData))
```
