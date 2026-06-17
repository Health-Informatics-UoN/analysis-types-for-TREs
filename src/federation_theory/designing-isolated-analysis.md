---
title: Designing isolated analysis
style: ../entrust-style.css
---

# Designing Isolated analysis

This section describes the construction of an isolated analysis in detail.
To start, we will consider the calculation of the arithmetic mean:

## The arithmetic mean

```tex
\bar{x} = \frac{\sum^n_{i=1}{x_i}}{n}
```

If you want to calculate the mean for a dataset you can see the whole of, the way you can think of calculating it is:

1. Count your number of instances (${tex`n`})
2. Add up your values (${tex`\sum^n_{i=1}{x_i}`})
3. Divide the sum by the count

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

The way you build one of these objects doesn't have to work element-wise like the example above.
In fact, it normally will not be the efficient way to do so.
For example, if your data are in a database, just use `SUM` and `COUNT`.
However, if you **can** make one and define the rules for combining them and getting your final result, then you can do it for arbitrary divisions of your data.

There are different perspectives to take on how this works.

## Perspectives

<input type="radio" name="tab" id="python">
<input type="radio" name="tab" id="maths" checked>

<div class="tabs">
  <label for="python">Python example</label>
  <label for="maths">Mathematical description</label>
</div>

<div class="content">
  <div class="tab-content" id="maths-content">

    
We started with the definition of the arithmetic mean:
```tex
\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}
```

But what are we calculating here?
We don't have the sum, we instead have the sum of the sums and the sum of the counts.
For ${tex`n`} TREs, each with ${tex`m`} data points:

```tex
\bar{x} = f(\text{global-sum}, \text{global-count}) = \frac{\sum_{i=1}^{n} \sum_{j=1}^{n_i} x_{i,j}}{\sum_{i=1}^{n} n_i}
```

For our purposes, we can see that both numerator and denominator have ${tex`\sum^n_{i=1}`}, which, as we have seen from our example, means we know we can separate out that part when calculating the federated mean.

### Monoids

There is a mathematical structure called a [monoid](https://en.wikipedia.org/wiki/Monoid).
A monoid is a set (${tex`S`}), with an operation (${tex`\oplus`}) that needs three properties.

- Using ${tex`\oplus`} on two elements of ${tex`S`} has to make another ${tex`S`}
- The operation has to be associative, so for ${tex`a,b`} and ${tex`c`} in ${tex`S`}, ${tex`(a \oplus b) \oplus c = a \oplus (b \oplus c)`}
- There needs to be an identity element, ${tex`e`} where ${tex`a \oplus e = a`} and ${tex` e \oplus a = a`}

This looks suspiciously like the function that combines the objects as described above.
Luckily for us, a lot of statistics can be computed using building blocks that can be combined with associative operations: real numbers and addition form a monoid (with 0 as an identity element), and positive real numbers and multiplication (with 1 as an identity element).

If we can express the partial results from nodes in a federation (pi​) and the operation used to combine them as a monoid, we can abstract the aggregation phase of a federated analysis as:

<!--Function that takes a set of values and returns one-->
```tex
f(p_1, p_2, \dots, p_n) = \bigoplus_{i=1}^{n} p_i
```

Then using some other function (${tex `g`}) applied to that aggregated partial result to calculate a final result, the overall function is then

```tex
result = g(f({p_1, p_2,\dots, p_n}))
```

For our mean example, the partial state is a tuple ${tex`p_i = (sum_i,count_i)`}. The monoid operation combines them element-wise:
```tex
(sum_a, count_a) \oplus (sum_b, count_b) = (sum_a + sum_b, count_a + count_b)
```

and our finalisation function is simply

```tex
g(sum, count) = \frac{sum}{count}
```

There are other ways to federate statistics, but if you *can* break the calculation down into something that can be calculated from monoids that can be aggregated means you can federate it.
<!--

PYTHON BIT

-->
  </div>
  <div class="tab-content" id="python-content">


The example above mentions "A function that combines these objects".
Providing python code for an example might make this more concrete.
Python's standard library contains `functools` to make this kind of approach easier.
`reduce` is a function from `functools` which applies a function to each item of some iterable and returns a single result.
This is something like

```python
result = {"count": 0, "sum": 0}

for item in some_list:
    result = {
        "count": result.count + item.count,
        "sum": result.sum + item.sum
    }
```

and using `result` afterwards.

If we take partial results from nodes in a federation, we can use `reduce` to combine them like so:

```python
from functools import reduce

def aggregate(partial1, partial2):
    return {
        "count": partial1["count"] + partial2["count"],
        "sum": partial1["sum"] + partial2["sum"]
    }

first, *rest = partials

result = reduce(aggregate, rest, first)
```

`reduce` needs some initial value to combine the other values with, so the `first, *rest` like splits the partials into the first value and a list of the rest.
`reduce` then uses aggregate to combine every value in partials.

The nice part of this approach is that we can tie the functions used for combining partial results to the function used to calculate a final result, and even have the type checker in your IDE tell you if you're making a mistake.

```python
from typing import TypeVar, Iterable, Callable

S = TypeVar("S")
R = TypeVar("R")
```

This bit of set up says that we want to work with two, possibly different, data types, but we don't want to be restricted to any particular types yet.

```python
def build_combine_function(
    aggregate: Callable[[S,S], S],
    finalise: Callable[[S], R]
) -> Callable[[Iterable[S]], R]:
    ...
```

You might be wondering what `Callable` is.
This is python's way of doing type hints for a function.
There are two parameters for a `Callable`: the types of the function's parameters, and the return type.
`aggregate: Callable[[S,S], S]` says "`aggregate` has to be a function that takes two things of one type (`S`) and returns something of the same type", `finalise: Callable[[S], R]` says "`finalise` has to be a function that takes something of type `S` and returns something of type `R`".
The return type `Callable[[Iterable[S]], R]` is a promise that `build_combine_function` will use these to make a function that takes a list or similar holding items of type `S` and use them to make something of type `R`.

```python
def build_combine_function(
    aggregate: Callable[[S,S], S],
    finalise: Callable[[S], R]
) -> Callable[[Iterable[S]], R]:
    def combine(partials: Iterable[S]):
        first, *rest = partials
        return finalise(
            reduce(aggregate, rest, first)
        )
    
    return combine
```

The function body defines a function that uses reduce to apply `aggregate` so we combine the partial results into one object, then apply finalise to the result.
Since we have made sure aggregate and finalise have the behaviours we want, we know the function we get from `build_combine_function` will take a list of partial results and give us the final result we want.
Without the type hinting, the function looks much simpler: `def build_combine_function(aggregate, finalise):...`, but by adding the other parts, your IDE will probably tell you off if you try to use functions that don't work with the data you have.

If we wanted, we could pull off a similar trick to go from our input data to the final result, but in the federated setting, the code executed in the nodes will be in a separate program, but this approach means all you need to know is that it should supply values you can shape into the partial results that your combiner function expects.
The [partialstats](https://github.com/Health-Informatics-UoN/partialstats) module uses this approach to provide combiner functions for common statistics and a scaffold for making your own.
  </div>
</div>


```js
import { evaluate_aggregate } from "../components/evaluate_pyodide.js";
```

```js
const node_function = view(Inputs.textarea(
{
  label: "Function to run at the node",
  submit: true,
  value: `def node_function(some_list):
  return len(some_list)`
}
))
```

```js
evaluate_aggregate(node_function)
```



## Further reading
The approaches used here are not new; aggregation in distributed systems has to solve many of the same problems, so federated analytics can crib from their solutions

- [Data Cube: A Relational Aggregation Operator Generalizing Group-By, Cross-Tab, and Sub-Totals](https://dx.doi.org/10.1023/A:1009726021843) a generalisation of particular aggregations.
- [A Survey of Distributed Data Aggregation Algorithms](http://arxiv.org/abs/1110.0725)
- [Monoidify! Monoids as a Design Principle for Efficient MapReduce Algorithms](http://arxiv.org/abs/1304.7544)

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
  #python:checked ~ .tabs label[for="python"] {
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
  #python:checked ~ .content #python-content {
    display: block;
  }
</style>
