---
title: An explanation of federated analytics
style: entrust-style.css
---

# An explanation of federated analytics

In some circumstances, you might need to carry out some statistical analysis without having all the data in one place.
Most commonly, this will be because you are not allowed to see individual data points in your datasets.
This website is designed for users of Trusted Research Environments (TREs) working in a federation, so the rest of this page will assume that perspective, but there are reasons of efficiency and computing power that could also necessitate federated analytics that helpfully tie federated analytics to the broader field of distributed computing.

## Why federation?


## Kinds of federation


## Kinds of federated analytics
Broadly, the algorithms used to carry out analytics can be broken into three groups.

### Isolated
In [isolated](./federation_theory/decomposable-analysis) analyses, the same function is replicated in each node, producing some summary statistic.
This output from each node can be combined with the same kind of output from other nodes to calculate the final result.

### Connected
Other kinds of analytics cannot be carried out without multiple rounds of communication.
Usually, this means nodes will need to accept input, and need to combine that with some internal state to carry out a step of analysis.

### Centralised
Some kinds of statistics require the sharing of individual data points.

<!-- ## Distributed computing -->
