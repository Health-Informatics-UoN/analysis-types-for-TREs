---
theme: air
toc: false
style: entrust-style.css
title: Federation Concepts
---

# Federation Concepts
Running an analysis on federated data requires that you understand some new ideas.

## Why federation?
Important data needs to be protected, even if analysing it would lead to valuable insights.
You may have come across data held in Trusted Research Environments before.
These provide computational environments which allow analysis on this private data.
However, different sites might have different parts of the data needed to carry out some analysis, for example different populations that could be compared.

Many kinds of analysis can be broken down into tasks that can be carried out on private data held in different places, with the output of these tasks being aggregated and processed to describe the data as if it were a single dataset.
This means the data that needs to stay secure stays secure but the valuable insights can be gleaned from it anyway.
