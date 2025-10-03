---
theme: [dashboard, air]
title: Get analyses by requirements
toc: false
---
```js
import tex from "npm:@observablehq/tex";
```

# Available analyses

## TRE requirements

<!-- Load analyses -->
```js
const analyses = FileAttachment("data/analyses.json").json();
```

<!-- Define filter form -->
```js
const filters = view(Inputs.form({
  // Trust requirements
  trust_level: Inputs.select(
    ["Any", "Aggregate data only", "Row-level data acceptable"],
    {
      label: "Trust level with aggregator",
      value: "Aggregate data only"
    }
  ),
  
  // Communication capabilities
  communication_rounds: Inputs.select(
    ["Any", "One round only", "Multiple rounds OK"],
    {
      label: "Communication rounds",
      value: "One round only"
    }
  ),
  
  // Execution model
  execution_models: Inputs.checkbox(
    ["linear", "branching"],
    {
      label: "Execution models supported",
      value: ["linear"]
    }
  ),
  
  // Persistent executors
  persistent_executors: Inputs.radio(
    ["Any", "Not required", "Supported"],
    {
      label: "Persistent executors",
      value: "Not required"
    }
  ),
  
  // Privacy methods
  privacy_methods: Inputs.checkbox(
    ["Differential Privacy", "Homomorphic Encryption", "Secure MPC"],
    {
      label: "Privacy-preserving methods available",
      value: []
    }
  ),
  
  // Decomposability preference
  decomposability: Inputs.checkbox(
    ["fully-decomposable", "approximately-decomposable", "iteratively-decomposable", "non-decomposable"],
    {
      label: "Acceptable decomposability",
      value: ["fully-decomposable", "approximately-decomposable"]
    }
  ),
  
  // Output type filter
  output_types: Inputs.checkbox(
    ["scalar", "vector", "matrix", "table", "higher-order", "text", "graphic"],
    {
      label: "Required output types",
      value: ["scalar", "vector", "matrix", "table"]
    }
  )
}));
```

<!-- Filter function -->
```js
function filterAnalyses(analyses, filters) {
  return analyses
    .map(analysis => {
      // Filter algorithms within each analysis
      const compatibleAlgorithms = analysis.algorithms.filter(algo => {
        // Trust level check
        if (filters.trust_level === "Aggregate data only") {
          const hasRowLevel = algo.trust_requirements.aggregator.some(req => 
            req.toLowerCase().includes("row-level")
          );
          if (hasRowLevel) return false;
        }
        
        // Communication rounds check
        if (filters.communication_rounds === "One round only") {
          if (algo.communication.rounds !== 1) return false;
        }
        
        // Execution model check
        if (!filters.execution_models.includes(algo.computation.execution_model)) {
          return false;
        }
        
        // Persistent executors check
        if (filters.persistent_executors === "Not required") {
          if (algo.computation.persistent_executors === true) return false;
        }
        
        // Decomposability check
        if (!filters.decomposability.includes(algo.decomposability)) {
          return false;
        }
        
        // Privacy methods check (if any are selected, algorithm must support at least one)
        if (filters.privacy_methods.length > 0) {
          const algoEncryption = algo.privacy_methods?.encryption || [];
          const hasDp = filters.privacy_methods.includes("Differential Privacy") && 
                        algo.privacy_methods?.differential_privacy;
          const hasHe = filters.privacy_methods.includes("Homomorphic Encryption") && 
                        algoEncryption.some(e => e.includes("HE"));
          const hasMpc = filters.privacy_methods.includes("Secure MPC") && 
                         algoEncryption.some(e => e.includes("MPC"));
          
          if (!hasDp && !hasHe && !hasMpc) return false;
        }
        
        return true;
      });
      
      // Return analysis with filtered algorithms, or null if none compatible
      if (compatibleAlgorithms.length === 0) return null;
      
      return {
        ...analysis,
        algorithms: compatibleAlgorithms,
        algorithmCount: compatibleAlgorithms.length
      };
    })
    .filter(a => a !== null)
    .filter(a => filters.output_types.includes(a.output.data_type));
}
```

<!-- Apply filters -->
```js
const filteredAnalyses = filterAnalyses(analyses, filters);
```

<div style= padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
  <h3 style="margin-top: 0;">Summary</h3>
  <p><strong>${filteredAnalyses.length}</strong> of <strong>${analyses.length}</strong> analyses are compatible with your capabilities</p>
  <p><strong>${filteredAnalyses.reduce((sum, a) => sum + a.algorithmCount, 0)}</strong> total compatible algorithms</p>
</div>

<!-- Display results table -->
```js
Inputs.table(filteredAnalyses, {
  columns: [
    "name",
    "output",
    "algorithmCount"
  ],
  header: {
    name: "Analysis",
    output: "Output",
    algorithmCount: "Compatible Algorithms"
  },
  format: {
    output: d => `${d.data_type} - ${d.description}`,
    algorithmCount: d => d
  },
  width: {
    name: "25%",
    output: "60%",
    algorithmCount: "15%"
  }
})
```

```js
import tex from "npm:@observablehq/tex";

display(html`<div style="margin-top: 2rem;">
  <h2>Detailed Compatibility</h2>
  ${filteredAnalyses.map(analysis => html`
    <details style="
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1rem 0;
      background: white;
    ">
      <summary style="
        cursor: pointer;
        font-weight: 600;
        font-size: 1.1rem;
        user-select: none;
      ">
        ${analysis.mathjax ? tex`${analysis.mathjax}` : analysis.name}
        <span style="
          color: #6b7280;
          font-weight: normal;
          font-size: 0.9rem;
        "> — ${analysis.algorithmCount} algorithm(s)</span>
      </summary>
      
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <p><strong>Description:</strong> ${analysis.description}</p>
        <p><strong>Output:</strong> ${analysis.output.data_type} — ${analysis.output.description}</p>
        
        <h4>Compatible Algorithms:</h4>
        ${analysis.algorithms.map(algo => html`
          <div style="
            background: #f9fafb;
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 0.375rem;
            border-left: 3px solid ${getDecomposabilityColor(algo.decomposability)};
          ">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <h5 style="margin: 0 0 0.5rem 0;">${algo.name}</h5>
              <span style="
                background: ${getDecomposabilityColor(algo.decomposability)};
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                font-weight: 600;
              ">
                ${algo.decomposability}
              </span>
            </div>
            
            ${algo.description ? html`<p style="color: #6b7280; margin: 0.5rem 0;">${algo.description}</p>` : ''}
            ${algo.mathjax ? html`<div style="margin: 0.5rem 0; padding: 0.5rem; background: white; border-radius: 0.25rem;">${tex`${algo.mathjax}`}</div>` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.75rem; font-size: 0.875rem;">
              <div>
                <strong>Trust requirements:</strong>
                <ul style="margin: 0.25rem 0; padding-left: 1.5rem;">
                  ${algo.trust_requirements.aggregator.map(req => html`<li>${req}</li>`)}
                </ul>
              </div>
              
              <div>
                <strong>Communication:</strong>
                <ul style="margin: 0.25rem 0; padding-left: 1.5rem;">
                  <li>Rounds: ${algo.communication.rounds}</li>
                  <li>Direction: ${algo.communication.direction}</li>
                </ul>
              </div>
              
              <div>
                <strong>Computation:</strong>
                <ul style="margin: 0.25rem 0; padding-left: 1.5rem;">
                  <li>Model: ${algo.computation.execution_model}</li>
                  <li>Persistent: ${algo.computation.persistent_executors ? 'Yes' : 'No'}</li>
                </ul>
              </div>
              
              ${algo.privacy_methods ? html`
                <div>
                  <strong>Privacy methods:</strong>
                  <ul style="margin: 0.25rem 0; padding-left: 1.5rem;">
                    ${algo.privacy_methods.differential_privacy ? html`<li>DP: ${algo.privacy_methods.differential_privacy}</li>` : ''}
                    ${algo.privacy_methods.encryption?.length > 0 ? html`<li>Encryption: ${algo.privacy_methods.encryption.join(', ')}</li>` : ''}
                  </ul>
                </div>
              ` : ''}
            </div>
            
            ${algo.performance ? html`
              <div style="margin-top: 0.5rem;">
                <strong>Performance:</strong> 
                <span style="
                  background: ${getPerformanceColor(algo.performance)};
                  padding: 0.125rem 0.5rem;
                  border-radius: 0.25rem;
                  font-size: 0.875rem;
                ">${algo.performance}</span>
              </div>
            ` : ''}
            
            ${algo.practical_notes?.length > 0 ? html`
              <div style="
                margin-top: 0.75rem;
                padding: 0.5rem;
                background: #fef3c7;
                border-radius: 0.25rem;
                font-size: 0.875rem;
              ">
                <strong>Notes:</strong>
                <ul style="margin: 0.25rem 0; padding-left: 1.5rem;">
                  ${algo.practical_notes.map(note => html`<li>${note}</li>`)}
                </ul>
              </div>
            ` : ''}
          </div>
        `)}
      </div>
    </details>
  `)}
</div>`);
```

<!-- Helper functions for colors -->
```js
function getDecomposabilityColor(decomp) {
  const colors = {
    "fully-decomposable": "#10b981",
    "approximately-decomposable": "#3b82f6",
    "iteratively-decomposable": "#f59e0b",
    "non-decomposable": "#ef4444"
  };
  return colors[decomp] || "#6b7280";
}
```

```js
function getPerformanceColor(perf) {
  const colors = {
    "very fast": "#d1fae5",
    "fast": "#a7f3d0",
    "moderate": "#fef3c7",
    "slow": "#fed7aa",
    "very slow": "#fecaca"
  };
  return colors[perf] || "#f3f4f6";
}
```
