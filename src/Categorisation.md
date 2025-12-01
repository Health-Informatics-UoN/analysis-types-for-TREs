---
theme: air
style: entrust-style.css
title: Categorisation of Analysis methods
---
# Categorising analysis types
This is a slightly sensitive work in progress, so in lieu of a proper explanation, I'll describe the parts of the JSON schema used to describe federated analyses.

## Name
The top level name is the name or short description of the output of the analysis, e.g. Mean.

## Description
A slightly longer description of the output.

## Aliases
Some statistics get a few names.
The one we are most familiar with gets top billing, the runners up go here.

## Tags
The output might fall within some higher level categories, so we have them as tags here.

## Output
The actual data that an analysis returns overall, and is what is output by the overall federated analysis needs a bit more description.

### Data type
Each analysis has a different disclosure risk, but the data type can give a shorthand.
This is one of:

- Scalar
- Vector
- Matrix
- Higher-order
- text
- graphic
- table

### Disclosure risk
This is optional, but there's a place in here to put some assessment of the disclosure risk.
Filling these in will require collaboration with statistical disclosure experts.

### Disclosure mitigation
There are methods that can be used to mitigate disclosure risk.
There's a free-text space to describe applicable methods.

## Algorithms
The algorithm used to calculate the analysis is a separate concern to the final output.
Different algorithms you can use to compute the analysis get their own entries.

### Decomposability
Different analyses can be broken down into sub-tasks (decomposed) in different ways by different algorithms.
The categories here are:

- **Fully decomposable** Some summary statistic that can be calculated by each client that can be combined with others to calculate the final statistic exactly
- **Iteratively decomposable** The computation can be decomposed, but not with a single aggregation operation, requiring multiple rounds of computation and communication.
- **Approximately decomposable** An approximation of the desired statistic can be calculated by aggregating summary statistics
- **Non-decomposable** The computation cannot be decomposed into independently computable parts

### Trust requirements
Independent of the output's disclosure risk, TREs may be concerned about the level of trust required to perform some federated analysis and want to know what data need to be shared.

#### Aggregator
We recognise that the level of trust required of a central aggregator might be different to the level of trust required of nodes in the network generally, so the data shared with the aggregator is distinct.

#### Other clients
Other clients in the network may see less data (often none) than the aggregator.

### Communication
The capabilities of a TRE network to do different kinds of communication may limit the kinds of algorithm that can be performed.

#### Rounds
Some kinds of analysis may only require a single round of communication, sending summary stats to an aggregator.
Others may iterate for a fixed, known number of rounds, while others will need to iterate for a number of rounds that cannot be known ahead of time.
This does not describe what kind of computation is happening in the clients at each round, which could be repeating one operation, or doing something different each time.

#### Direction
Some networks might require federation only to have communication that goes from the client to the aggregator.
Others might need communication to go both ways.

### Computation
The computations that a client has to do can define what analysis is possible, independent of how the network can communicate.

#### Execution model
Some execution models do not allow branching computation dependent on some factor that is calculated during analysis.
Others allow workflow-like execution which can branch.

#### Persistent executors
Some analyses require executors that remain active across communication rounds.
For others, an executor can complete upon communication.

### Privacy methods
There are privacy methods that can be applied to different kinds of analysis to make them acceptable for different risk budgets.

#### [Differential Privacy](https://en.wikipedia.org/wiki/Differential_privacy)
Differential privacy can be applied at different levels: applied on the input, required on the intermediate stages, or may not be applicable to an output.

#### Encryption
Homomorphic encryption and secure multiparty computation are widely applied.
These can be compatible with, or required for, an algorithm.

### Performance
An optional rough guess of how fast this is to compute with this algorithm.

### Accuracy
Some algorithms compute the exact statistic, some make some approximation.

### Practical notes
This is where to put anything that isn't captured by the other parts of description.

### References
Academic references for the algorithm.
