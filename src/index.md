---
theme: air
toc: false
---

<div class="hero">
  <h1>Analysis Types</h1>
  <h2>Categorising different analyses by how they can be federated</h2>
</div>

---

<div style="margin:1rem 0;">
Trusted research environments (TREs) can take part in federated analytics, where multiple partners in a network collaborate to compute some analysis, providing <em>data access</em> without <em>data sharing</em>.
What analyses are feasible for TREs depends on technical possibility and the operational acceptability of different stages of analysis. 
In theory, any of these analyses are made possible by moving data into one place and carrying out the analysis.
That might be acceptable for some TREs.
However, there are many cases where this presents an unacceptable breach of confidentiality, and the analysis should be performed by calculating a local result that can be combined with similar results for other TREs.
</div>

<div style="margin:1rem 0;">
This is why an <b>analysis</b> is treated separately to the <b>algorithm(s)</b> used to compute it.
The analysis covers what the final output is that is published.
Algorithms describe how the analysis is computed.
This provides information like what data can be observed by which other parties in the federated analysis and technical requirements for TREs.
</div>

---

You can read more details on how analyses are [categorised](Categorisation), or use the [dashboard](analysis-breakdown) to see whether your TRE requirements are compatible with different federated analyses.

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
