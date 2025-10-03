# Analysis Types For TREs
This is code for a site describing how different federated analyses can be carried out with different capabilities across a network of Trusted Research Environments (TREs).

The site provides a dashboard for different analyses, which can be filtered by capabilities and levels of trust.
The dashboard is backed by a set of descriptions of [analyses](src/data/analyses.json) following a [defined schema](src/data/federated-analysis-schema.json).

## Deploying

This is an [Observable Framework](https://observablehq.com/framework/) app. To install the required dependencies, run:

```
npm install
```

Then, to start the local preview server, run:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your app.
