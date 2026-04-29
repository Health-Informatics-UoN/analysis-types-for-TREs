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

## Perspectives

<input type="radio" name="tab" id="python">
<input type="radio" name="tab" id="typescript">
<input type="radio" name="tab" id="maths" checked>

<div class="tabs">
  <label for="python">Python example</label>
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

### Monoids

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


Above, we vaguely refer to "inner functions" and "outer functions", but we have concrete examples, which definitely work because they are what drives the interactive examples.

### Structures

To recap - the way the example given above works is that there is an "inner" function that creates an intermediate which can be used by an "outer" function to generate your inner result.

There are python features that let you generalise this solution.

[Dataclasses](https://docs.python.org/3/library/dataclasses.html) automatically add python special methods which let you create objects more easily.

[Generics](https://typing.python.org/en/latest/reference/generics.html) are data types (like `int` or `str`) which can "hold" other types.
Don't worry about this too much, the examples should make this more clear.

Combining dataclasses and generics lets us describe an overall isolated analysis like this:


```python
from typing import Generic
from dataclasses import dataclass

@dataclass
class AlgebraicAggregate(Generic[T, S, R]):
```

This overall dataclass works on three types:
- `T`: The input rows
- `S`: The intermediate values
- `R`: The type of the output

```python
    inner_function: InnerFunction[T, S]
    outer_function: OuterFunction[S, R]
```

The overall analysis is then broken into an inner function and an outer function, each of which is parameterised by the overall analysis types: `T` and `S` for the inner function, and `S` and `R` for the outer function.

```python
    def run(self, data: list[list[T]]) -> R:
        intermediates: list[S] = map(self.inner_function.run, data)
        return self.outer_function.run(intermediates)
```

The analysis works by running the inner function on the data to produce a list of intermediate values, then running the outer function on the intermediates.


### Inner function
The inner function is what takes input and turns it into objects that can be combined or used to calculate the final result.
In reality, the code used to create this will be highly dependent on how calculations are carried out at the node. This just needs to create an object of type `S`.

<details>
<summary>If you want code for the toy example, expand for details</summary>


```python
from typing import Callable

@dataclass
class InnerFunction(Generic[T, S]):
```

This is actually two functions: the function that turns input values into the intermediate (`apply`), and a function for combining the intermediates (`merge`).
Putting these into a class might seem a little odd, but makes tying these together easier, as you will see when we write the mean example this way.
We also provide the identity element, which is something that you can merge with another instance of `S` and get the same result.

```python
    apply: Callable[[T], S]
    merge: Callable[[S, S], S]
    identity: S
```

Running the inner function uses [higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function), functions which take another function as a parameter.

```python
    def run(self, rows: list[T]) -> S:
        return reduce(
            self.merge,
            map(self.apply, rows),
            self.identity
            )
```

To understand this, it can help to look at it inside out:

```python
map(self.apply, rows)
```

Takes the rows, and runs `apply` on each element.
You can think of this as creating a new list, with an intermediate result for each element of the input, like a `for` loop or a list comprehension.

This is used as the input for

```python
reduce(
    self.merge,
    array_of_intermediates,
    self.identity
)
```

A `reduce` operation takes this array of intermediates and uses `merge` to combine each element of the array of intermediates with the `identity`.
By wrapping the `apply` function in the `merge` function this way we can go from individual rows to an aggregate value in the intermediate format.
</details>

### Outer function
We don't want intermediate values, though; we want the final result.
By lining up the output of `InnerFunction` and the input of `OuterFunction` by giving them the same type, we have a path to get from `T` to `R` via `S`.

```python
@dataclass
class OuterFunction(Generic[S, R]):
```

We then get to define the two functions of the `Outerfunction`
- `aggregate` The part that combines `S`
- `finalise` The part that turns `S` into `R`

```python
    aggregate: Callable[[S, S], S]
    identity: S
    finalise: Callable[[S], R]
```

Running the whole function uses a `reduce` operation to combine all the intermediate values into a single value, then finalise

```python
    def run(self, intermediates: Iterable[S]) -> R:
        return self.finalise(reduce(self.aggregate, intermediates))
```

### End-to-end example: Mean
The example of the mean as described above serves to make this more concrete.
We know that the types of data we need are a number, an intermediate holding the sum and count, and a final result that is a single number again.

For python, we can define the intermediate:
```python
@dataclass
class SumIntermediate:
    sum: float
    count: int
```

As we have all the data for a toy example, we can define the InnerFunction like this:
```python
sum_rows = InnerFunction[float, SumIntermediate](
    apply=lambda x: SumIntermediate(sum=x, count=1),
    merge=lambda a, b: SumIntermediate(sum=a.sum + b.sum, count=a.count + b.count),
    identity=SumIntermediate(sum=0, count=0),
)
```

This is not realistic, but you can see the syntax for creating an inner function includes `InnerFunction[float, SumIntermediate]`, which tells the type checker that `apply` should take a `float` and return a `SumIntermediate`, and that `merge` should take two `SumIntermediate` and return another.
This should help you write functions that return the right values for aggregation.

The outer function is more realistic; as long as it receives `SumIntermediate` values, it can calculate your mean:

```python
gather_avg_intermediates = OuterFunction[SumIntermediate, float](
        aggregate=lambda a, b: SumIntermediate(sum=a.sum + b.sum, count=a.count + b.count),
        identity=SumIntermediate(0,0),
        finalise=lambda x: x.sum/x.count
        )
```

Creating an aggregate function is then simple:

```python
federated_mean = AlgebraicAggregate(
    inner_function=sum_rows,
    outer_function=gather_avg_intermediates
)
``` 

Then, all you need to do is call `run` from `federated_mean`.

Hopefully, walking through an example in python helps make it clear how federated analytics can use simple data structures that can be combined and used to calculate a final result.
Surprisingly few of these can be used to calculate a lot of statistics.
For example, if you can create an intermediate value that describes the sum, sum of squares, and counts, you can calculate variance, as well as several other statistics.
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
