import { loadPyodide } from "https://cdn.jsdelivr.net/npm/pyodide@314.0.0/pyodide.mjs";

let pyodide = await loadPyodide({
  indexURL: "https://cdn.jsdelivr.net/npm/pyodide@314.0.0/"
});

export async function hello_python() {
  return pyodide.runPythonAsync("1+1");
}

export async function evaluate_aggregate(userFunction) {
  return pyodide.runPythonAsync(
    `
some_list = [1,2,3,4,5]
${userFunction}
node_function(some_list)
    `
  )
}
