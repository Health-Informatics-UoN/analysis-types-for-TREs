import {html} from "npm:htl";
import * as Inputs from "npm:@observablehq/inputs";
import {marked} from "marked";
import markedKatex from "marked-katex-extension";

const options = {
  throwOnError: false
};

marked.use(markedKatex(options));

function htmlUnsafe(string) {
  const template = document.createElement("template");
  template.innerHTML = string;
  return template.content.cloneNode(true);
}

function getSeparabilityColor(sep) {
  const colors = {
    "fully": "#10b981",
    "iterative": "#f59e0b",
    "none": "#ef4444"
  };
  return colors[sep] || "#6b7280";
}

function getSeparabilityString(sep) {
  const strs = {
    "fully": "Fully separable",
    "iterative": "Iteratively separable",
    "none": "Non-separable"
  };
  return strs[sep] || "Unknown separability";
}

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

export class Statistic {
  constructor(statisticField) {
    this.statisticId = statisticField.statistic_id;
    this.description = statisticField.description;
    this.output = statisticField.output;
    this.statbarnId = statisticField.statbarn_id;
    this.mathjax = statisticField.mathjax;
    this.notes = statisticField.notes;
  }

  addAliases(aliasList) {
    this.aliases = aliasList.filter(a => a.statistic_id === this.statisticId);
    if (this.aliases.length > 0) {
      const primary_alias = this.aliases.filter(a => a.is_primary === "true");
      if (primary_alias.length > 0) {
        this.primary_alias = primary_alias[0];
      } else {
        this.primary_alias = this.aliases[0];
      }
    } else {
      this.primary_alias = this.statisticId;
    }
  }

  addAlgorithms(algorithmList) {
    this.algorithms = algorithmList.filter(a => a.statisticId === this.statisticId);
  }

  addRelationships(relationshipList) {
    this.relationships = relationshipList.filter(r => r.source_statistic_id === this.statisticId);
  }

  showAliases() {
    if (this.aliases.length > 1) {
      return html`
      <div class="card">
        <h2>Also known as:</h2>
        <ul>
          ${this.aliases.map(a => html`<li>${a.alias_name}</li>`)}
        </ul>
      </div>
      `
    } else {
      return ``
    }
  }

  showAlgorithms() {
    if (this.algorithms.length > 0) {
      return this.algorithms.map(a => a.display());
    } else {
      return ``;
    }
  }

  display() {
    return html`
    <div class = "card">
      <h1>${this.primary_alias.alias_name}</h1>
      <details>
        <summary style="
          color: #6b7280;
          font-weight: normal;
          font-size: 0.9rem;
        ">
          (${this.algorithms.length} compatible algorithms)
          <p>${this.description}</p>
        </summary>
        ${this.showAliases()}
        <p><strong>Output data type:</strong>${this.output}</p>
        <p><strong>Statbarn:</strong>${this.statbarnId}</p>
        <p><strong>Notes:</strong>${this.notes}</p>
        <div class = "card">
          <h2> Algorithms </h2>
          ${this.showAlgorithms()}
        </div>
      </details>
    </div>
    `
  }
}

export class Algorithm {
  constructor(algorithmField) {
    this.algorithmId = algorithmField.algorithm_id;
    this.statisticId = algorithmField.statistic_id;
    this.name = algorithmField.name;
    this.description = algorithmField.description;
    this.separability = algorithmField.separability;
    this.mathjax = algorithmField.mathjax;
    this.communicationRounds = algorithmField.communication_rounds;
    this.adaptiveRounds = algorithmField.adaptive_rounds === "true";
    this.communicationDirection = algorithmField.communication_direction.replace("_", " ");
    this.requiresBranching = algorithmField.requires_branching === "true";
    this.requiresPersistence = algorithmField.requires_persistence === "true";
    this.differentialPrivacy = algorithmField.differential_privacy === "true";
    this.homomorphicEncryption = algorithmField.homomorphic_encryption;
    this.multipartyComputation = algorithmField.multiparty_computation;
    this.notes = algorithmField.notes;
  }

  addObservables(observableDataList) {
    this.observables = observableDataList.filter(o => o.algorithm_id === this.algorithmId)
  }

  showObservables() {
    return Inputs.table(
      this.observables.map(
        d => {
          return {
            "node": d.node_type,
            "sees": d.item,
            "description": d.description,
          }
        }
      ),
      {layout: "auto"}
    );
  }

  display() {
    return html`
    <div class="card">
      <h3>${this.name}</h3>
      <p><strong>Description:</strong> ${this.description}</div>
      <span style="
        background: ${getSeparabilityColor(this.separability)};
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 600;
      ">
        ${getSeparabilityString(this.separability)}
      </span>
      <h4>Observable data</h4>
      ${this.showObservables()}
      <div>
        ${htmlUnsafe(marked.parse(this.notes))}
      <div>
    </div>
    `
  }
}
