---
theme: air
style: entrust-style.css
title: Visualising Bunny Outputs
---
# Visualising Bunny Outputs
There are two examples of outputs from a Bunny distribution query included in the test data.
This kind of data can be obtained from Five Safes TES (5STES) by submitting a TES message as follows:

```json
{
         "id": "someID",
         "state": 0,
         "name": "Bunny testing",
         "description": null,
         "inputs": null,
         "outputs": [
                  {
                           "name": "Query Results",
                           "description": "Results from the requested query execution",
                           "url": "s3://",
                           "path": "/outputs",
                           "type": "DIRECTORY"
                  }
         ],
         "resources": null,
         "executors": [
                  {
                           "image": "ghcr.io/health-informatics-uon/five-safes-tes-analytics-bunny-cli:1.6.0",
                           "command": [
                                    "--body-json",
                                    "{\"code\":\"GENERIC\",\"analysis\":\"DISTRIBUTION\",\"uuid\":\"123\",\"collection\":\"test\",\"owner\":\"me\"}",
                                    "--output",
                                    "/outputs/output.json",
                                    "--no-encode"
                           ],
                           "workdir": null,
                           "stdin": null,
                           "stdout": null,
                           "stderr": null,
                           "env": null
                  }
         ],
         "volumes": null,
         "tags": {
                  "project": "someProject",
                  "tres": "someTREs"
         },
         "logs": null,
         "creation_time": null
}

```

A message like this can be submitted using the submission layer's Raw JSON wizard, substituting your own parameters for `"id"`, `"tags"/"project"` and `"tags/tres"`.
Alternatively, consult the documentation for the use of the Custom image wizard.

We have provided some utilities to help users interpret the outputs of these distribution queries, importable from `bunny_utils`.


```python
from five_safes_tes_analytics.utils.parse_bunny import parse_bunny
from bunny_utils import DistributionCodesets, count_bar
import warnings
warnings.filterwarnings('ignore')
```

The examples "1k TRE" and "100k TRE" are taken from the synthetic OMOP datasets held in University of Nottingham test TREs.
The other examples are dummy data created for this demonstration.
Running the wizard, you should be able to egress files for your output.
Hopefully, you've kept track of which files come from which TRE.

Initialising a `DistributionCodesets` object with a dictionary with names you recognise and the paths to the files means that visualisations etc. will keep those labels.


```python
bunny_table_names = {
    "1k TRE": "../tests/test-data/1kconcepts.json",
    "100k TRE": "../tests/test-data/100kconcepts.json",
    "Narnia": "bunny-dummy-data/narnia-tsv-dummy.json",
    "The Moon": "bunny-dummy-data/the-moon-tsv-dummy.json",
    "Tingham": "bunny-dummy-data/tingham-tsv-dummy.json"
}
```


```python
codesets = DistributionCodesets(bunny_table_names)
```

You can look at the raw tables from the query in the `.tables` attribute.


```python
codesets.tables["1k TRE"].head()
```

| TRE | BIOBANK | CODE | COUNT | ALTERNATIVES | DATASET | OMOP | OMOP_DESCR | CATEGORY | 
| --- | ------- | ---- | ----- | ------------ | ------- | ---- | ---------- | -------- |
| 1k TRE | test | OMOP:0 | 580 | NaN | NaN | 0 | No matching concept | Condition |
| 1k TRE | test | OMOP:28060 | 150 | NaN | NaN | 28060 | Streptococcal sore throat | Condition |
| 1k TRE | test | OMOP:75036 | 20 | NaN | NaN | 75036 | Localized, primary osteoarthritis of the hand | Condition |
| 1k TRE | test | OMOP:78272 | 50 | NaN | NaN | 78272 | Sprain of wrist | Condition |
| 1k TRE | test | OMOP:80502 | 50 | NaN | NaN | 80502 | Osteoporosis | Condition |

You can get the counts for each code on each TRE with the `counts_by_TRE` property.


```python
codesets.counts_by_TRE.head()
```

You can view how many codes your TREs have in common with the `code_intersections` property.
This example shows that the 100k and 1k TREs share 7 codes, that "100k TRE" has 8885 unique codes, and the "1k TRE" has 361 unique codes.

```python
codesets.code_intersections
```

|     |     |
| --- | --- |
| \['100k TRE', '1k TRE'\] | 	7 |
| \['100k TRE', 'Narnia', 'The Moon', 'Tingham'\] | 	16 |
| \['100k TRE', 'Narnia', 'The Moon'\] | 	1 |
| \['100k TRE', 'Tingham'\] | 	3 |
| \['100k TRE'\] | 	8865 |
| \['1k TRE', 'Narnia', 'The Moon', 'Tingham'\] | 	2 |
| \['1k TRE'\] | 	359 |
| \['Narnia', 'The Moon', 'Tingham'\] | 	1056 |
| \['Narnia', 'The Moon'\] | 	925 |
| \['Tingham'\] | 	921 |


You can plot the $k$ codes with the highest counts using `.plot_top_k_by_count(k)`.
If you run this notebook, you can hover over the bars to get the OMOP description of that code.

```python
codesets.plot_top_k_by_count(10)
```

```js
const top10Plot = FileAttachment("./data/vega-plots/count-top-10.json").json();
```

```js
vl.render({
  spec: {
    width: 600,
    height: 400,
    data: {values: top10Plot.datasets["data-a728793463941ee04eb23777eacf1e87"]},
    mark: "bar",
    encoding: top10Plot.encoding
  }
})
```

If you have codes that you're interested in, you can use the `.plot_by_codes(list_of_codes)` method to get a barplot of those.


```python
codesets.plot_by_codes([28060, 3000905])
```

```js
const countByCodes = FileAttachment("./data/vega-plots/count-by-codes.json").json()
```

```js
vl.render({
  spec: {
    width: 600,
    height: 200,
    data: {values: countByCodes.datasets["data-e89cded756829d18dd1becc550a02ca3"]},
    mark: "bar",
    encoding: countByCodes.encoding
  }
})
```

You can combine this method with ways of generating lists of codes, for example, getting the list of codes that are shared between some TREs, using the `.get_codes_by_membership` method.
These are the codes shared by both of the synthetic datasets.


```python
codesets.plot_by_codes(codesets.get_codes_by_membership("['100k TRE', '1k TRE']")["OMOP"])
```


```js
const countByIntersection = FileAttachment("./data/vega-plots/count-by-intersection.json").json()
```

```js
vl.render({
  spec: {
    width: 600,
    height: 400,
    data: {values: countByIntersection.datasets["data-c04c945ec29ce9a29b27390dd3cde0d6"]},
    mark: "bar",
    encoding: countByIntersection.encoding
  }
})
```


Or if you don't have a set of codes you want to query, but do have some substring to match, you can use the `get_codes_by_substring_match` method. This is case-insensitive and supports regular expressions.


```python
codesets.plot_by_codes(codesets.get_codes_by_substring_match("leuko")["OMOP"])
```

```js
const countBySubstring = FileAttachment("./data/vega-plots/count-by-substring.json").json()
```

```js
vl.render({
  spec: {
    height: 800,
    width: 600,
    mark: "bar",
    data: {values: countBySubstring.datasets["data-23db58bc3def801d6732df0a39f3852e"]},
    encoding: countBySubstring.encoding
  }
})
```


You can get a heatmap of how many codes are in each combination of datasets as a heatmap with `.plot_count_heatmap`


```python
codesets.plot_count_heatmap().properties(width=600, height=600)
```

```js
const heatmap = FileAttachment("./data/vega-plots/heatmap.json").json()
```

```js
vl.render({
  spec: {
    height: 600,
    width: 600,
    mark: heatmap.mark,
    data: {values: heatmap.datasets["data-66c0c809ab4b5af683a377e644596847"]},
    encoding: heatmap.encoding
  }
})
```

You can also get an [Upset plot](https://upset.app/) for your datasets.
This is like a Venn diagram, but instead of numbers written in circles, you get bars proportional to the number of codes present in each combination of TREs.
This shows the same information as the `code_insersections` property.
If you only have a couple of TREs, this isn't terribly useful, but once you have more than three, the number of combinations is much higher, and Venn diagrams get hard to read.


```python
codesets.plot_upset()
```

```js
const upset = FileAttachment("./data/vega-plots/upset.json").json()
```

```js
vl.render({spec: upset})
```




<style>
  #altair-viz-705b51f05226492087cc5b61fac2b7f9.vega-embed {
    width: 100%;
    display: flex;
  }

  #altair-viz-705b51f05226492087cc5b61fac2b7f9.vega-embed details,
  #altair-viz-705b51f05226492087cc5b61fac2b7f9.vega-embed details summary {
    position: relative;
  }
</style>
<div id="altair-viz-705b51f05226492087cc5b61fac2b7f9"></div>
<script type="text/javascript">
  var VEGA_DEBUG = (typeof VEGA_DEBUG == "undefined") ? {} : VEGA_DEBUG;
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-705b51f05226492087cc5b61fac2b7f9") {
      outputDiv = document.getElementById("altair-viz-705b51f05226492087cc5b61fac2b7f9");
    }

    const paths = {
      "vega": "https://cdn.jsdelivr.net/npm/vega@6?noext",
      "vega-lib": "https://cdn.jsdelivr.net/npm/vega-lib?noext",
      "vega-lite": "https://cdn.jsdelivr.net/npm/vega-lite@6.1.0?noext",
      "vega-embed": "https://cdn.jsdelivr.net/npm/vega-embed@7?noext",
    };

    function maybeLoadScript(lib, version) {
      var key = `${lib.replace("-", "")}_version`;
      return (VEGA_DEBUG[key] == version) ?
        Promise.resolve(paths[lib]) :
        new Promise(function(resolve, reject) {
          var s = document.createElement('script');
          document.getElementsByTagName("head")[0].appendChild(s);
          s.async = true;
          s.onload = () => {
            VEGA_DEBUG[key] = version;
            return resolve(paths[lib]);
          };
          s.onerror = () => reject(`Error loading script: ${paths[lib]}`);
          s.src = paths[lib];
        });
    }

    function showError(err) {
      outputDiv.innerHTML = `<div class="error" style="color:red;">${err}</div>`;
      throw err;
    }

    function displayChart(vegaEmbed) {
      vegaEmbed(outputDiv, spec, embedOpt)
        .catch(err => showError(`Javascript Error: ${err.message}<br>This usually means there's a typo in your chart specification. See the javascript console for the full traceback.`));
    }

    if(typeof define === "function" && define.amd) {
      requirejs.config({paths});
      let deps = ["vega-embed"];
      require(deps, displayChart, err => showError(`Error loading script: ${err.message}`));
    } else {
      maybeLoadScript("vega", "6")
        .then(() => maybeLoadScript("vega-lite", "6.1.0"))
        .then(() => maybeLoadScript("vega-embed", "7"))
        .catch(showError)
        .then(() => displayChart(vegaEmbed));
    }
  })({"config": {"view": {"continuousWidth": 300, "continuousHeight": 300, "stroke": null}, "axis": {"labelFontSize": 14, "labelFontWeight": 300, "titleFontSize": 16, "titleFontWeight": 400, "titlePadding": 10}, "concat": {"spacing": 0}, "legend": {"labelFontSize": 14, "labelFontWeight": 300, "orient": "top", "padding": 20, "symbolSize": 500.0, "symbolType": "circle", "titleFontSize": 16, "titleFontWeight": 400}, "title": {"anchor": "start", "fontSize": 18, "fontWeight": 400, "subtitlePadding": 10}}, "vconcat": [{"layer": [{"mark": {"type": "bar", "color": "#3A3A3A", "size": 30}, "encoding": {"color": {"condition": {"test": {"not": {"param": "param_7421591d7e6fcfd3"}}, "value": "#3A3A3A"}, "value": "#EA4667"}, "tooltip": [{"aggregate": "max", "field": "count", "title": "Cardinality", "type": "quantitative"}, {"field": "degree", "title": "Degree", "type": "quantitative"}, {"field": "sets", "title": "Sets", "type": "nominal"}], "x": {"axis": {"domain": true, "grid": false, "labels": false, "ticks": false}, "field": "intersection_id", "sort": {"field": "count", "order": "ascending"}, "title": null, "type": "nominal"}, "y": {"aggregate": "max", "axis": {"grid": false, "orient": "right", "tickCount": 3}, "field": "count", "title": "Intersection Size", "type": "quantitative"}}, "name": "view_a4765cb0ebba99a5_0", "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}]}, {"mark": {"type": "text", "color": "#3A3A3A", "dy": -10, "size": 16}, "encoding": {"color": {"condition": {"test": {"not": {"param": "param_7421591d7e6fcfd3"}}, "value": "#3A3A3A"}, "value": "#EA4667"}, "text": {"field": "count", "format": ".0f", "type": "quantitative"}, "tooltip": [{"aggregate": "max", "field": "count", "title": "Cardinality", "type": "quantitative"}, {"field": "degree", "title": "Degree", "type": "quantitative"}, {"field": "sets", "title": "Sets", "type": "nominal"}], "x": {"axis": {"domain": true, "grid": false, "labels": false, "ticks": false}, "field": "intersection_id", "sort": {"field": "count", "order": "ascending"}, "title": null, "type": "nominal"}, "y": {"aggregate": "max", "axis": {"grid": false, "orient": "right", "tickCount": 3}, "field": "count", "title": "Intersection Size", "type": "quantitative"}}, "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}]}], "height": 420.0, "width": 1200}, {"hconcat": [{"layer": [{"mark": {"type": "circle", "opacity": 1, "size": 200}, "encoding": {"color": {"condition": {"test": {"not": {"param": "param_7421591d7e6fcfd3"}}, "value": "#3A3A3A"}, "value": "#EA4667"}, "tooltip": [{"aggregate": "max", "field": "count", "title": "Cardinality", "type": "quantitative"}, {"field": "degree", "title": "Degree", "type": "quantitative"}, {"field": "sets", "title": "Sets", "type": "nominal"}], "x": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "intersection_id", "sort": {"field": "count", "order": "ascending"}, "title": null, "type": "nominal"}, "y": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "set_order", "title": null, "type": "nominal"}}, "name": "view_c6837b6556e731ed_0", "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}, {"filter": "(datum['is_intersect'] === 1)"}]}, {"mark": {"type": "rect"}, "encoding": {"color": {"value": "#F7F7F7"}, "tooltip": [{"aggregate": "max", "field": "count", "title": "Cardinality", "type": "quantitative"}, {"field": "degree", "title": "Degree", "type": "quantitative"}, {"field": "sets", "title": "Sets", "type": "nominal"}], "x": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "intersection_id", "sort": {"field": "count", "order": "ascending"}, "title": null, "type": "nominal"}, "y": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "set_order", "title": null, "type": "nominal"}}, "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}, {"filter": "((datum['set_order'] % 2) === 1)"}]}, {"mark": {"type": "circle", "opacity": 1, "size": 200}, "encoding": {"color": {"value": "#E6E6E6"}, "tooltip": [{"aggregate": "max", "field": "count", "title": "Cardinality", "type": "quantitative"}, {"field": "degree", "title": "Degree", "type": "quantitative"}, {"field": "sets", "title": "Sets", "type": "nominal"}], "x": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "intersection_id", "sort": {"field": "count", "order": "ascending"}, "title": null, "type": "nominal"}, "y": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "set_order", "title": null, "type": "nominal"}}, "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}]}, {"mark": {"type": "bar", "color": "#3A3A3A", "size": 2}, "encoding": {"color": {"condition": {"test": {"not": {"param": "param_7421591d7e6fcfd3"}}, "value": "#3A3A3A"}, "value": "#EA4667"}, "tooltip": [{"aggregate": "max", "field": "count", "title": "Cardinality", "type": "quantitative"}, {"field": "degree", "title": "Degree", "type": "quantitative"}, {"field": "sets", "title": "Sets", "type": "nominal"}], "x": {"axis": {"domain": true, "grid": false, "labels": false, "ticks": false}, "field": "intersection_id", "sort": {"field": "count", "order": "ascending"}, "title": null, "type": "nominal"}, "y": {"aggregate": "min", "field": "set_order", "type": "nominal"}, "y2": {"aggregate": "max", "field": "set_order"}}, "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}, {"filter": "(datum['is_intersect'] === 1)"}]}, {"mark": {"type": "circle", "opacity": 1, "size": 200}, "encoding": {"color": {"condition": {"test": {"not": {"param": "param_7421591d7e6fcfd3"}}, "value": "#3A3A3A"}, "value": "#EA4667"}, "tooltip": [{"aggregate": "max", "field": "count", "title": "Cardinality", "type": "quantitative"}, {"field": "degree", "title": "Degree", "type": "quantitative"}, {"field": "sets", "title": "Sets", "type": "nominal"}], "x": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "intersection_id", "sort": {"field": "count", "order": "ascending"}, "title": null, "type": "nominal"}, "y": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "set_order", "title": null, "type": "nominal"}}, "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}, {"filter": "(datum['is_intersect'] === 1)"}]}], "height": 280.0, "width": 900}, {"mark": {"type": "text", "align": "center"}, "encoding": {"color": {"value": "black"}, "opacity": {"value": 1}, "text": {"field": "set_abbre", "type": "nominal"}, "y": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "set_order", "title": null, "type": "nominal"}}, "name": "view_7e8eb4ccd405999e_1", "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}], "width": 300}, {"mark": {"type": "bar", "size": 20}, "encoding": {"color": {"field": "set", "scale": {"domain": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "range": ["#55A8DB", "#3070B5", "#30363F", "#F1AD60", "#DF6234", "#BDC6CA"]}, "title": null, "type": "nominal"}, "opacity": {"value": 1}, "x": {"aggregate": "sum", "axis": {"grid": false, "tickCount": 3}, "field": "count", "title": "Set Size", "type": "quantitative"}, "y": {"axis": {"domain": false, "grid": false, "labels": false, "ticks": false}, "field": "set_order", "title": null, "type": "nominal"}}, "name": "view_518578f4fd049350_2", "transform": [{"filter": {"param": "param_a7055fbecf07007a"}}, {"pivot": "set", "value": "is_intersect", "groupby": ["intersection_id", "count"], "op": "max"}, {"aggregate": [{"op": "sum", "field": "count", "as": "count"}], "groupby": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"]}, {"calculate": "(isDefined(datum['1k TRE']) ? datum['1k TRE'] : 0)+(isDefined(datum['100k TRE']) ? datum['100k TRE'] : 0)+(isDefined(datum['Narnia']) ? datum['Narnia'] : 0)+(isDefined(datum['The Moon']) ? datum['The Moon'] : 0)+(isDefined(datum['Tingham']) ? datum['Tingham'] : 0)", "as": "degree"}, {"filter": "(datum['degree'] !== 0)"}, {"window": [{"op": "row_number", "field": "", "as": "intersection_id"}], "frame": [null, null]}, {"fold": ["1k TRE", "100k TRE", "Narnia", "The Moon", "Tingham"], "as": ["set", "is_intersect"]}, {"lookup": "set", "from": {"data": {"name": "data-3fda048d0ad9b183201b351e30a2daaf"}, "key": "set", "fields": ["set_abbre"]}}, {"lookup": "set", "from": {"data": {"name": "data-2d7d00aa35580b4197e6523e71ccb052"}, "key": "set", "fields": ["set_order"]}}, {"filter": {"param": "param_a7055fbecf07007a"}}, {"window": [{"op": "distinct", "field": "set", "as": "set_order"}], "frame": [null, 0], "sort": [{"field": "set_order"}]}, {"filter": "(datum['is_intersect'] === 1)"}], "width": 300}], "resolve": {"scale": {"y": "shared"}}, "spacing": 5}], "data": {"name": "data-bb2941412407e0b752e541772710dc76"}, "params": [{"name": "param_7421591d7e6fcfd3", "select": {"type": "point", "fields": ["intersection_id"], "on": "mouseover"}, "views": ["view_a4765cb0ebba99a5_0", "view_c6837b6556e731ed_0"]}, {"name": "param_a7055fbecf07007a", "select": {"type": "point", "fields": ["set"]}, "bind": "legend", "views": ["view_a4765cb0ebba99a5_0", "view_c6837b6556e731ed_0", "view_7e8eb4ccd405999e_1", "view_518578f4fd049350_2"]}], "spacing": 20, "title": {"text": "Codes in datasets", "subtitle": "", "fontSize": 20, "fontWeight": 500, "subtitleColor": "#3A3A3A", "subtitleFontSize": 14}, "$schema": "https://vega.github.io/schema/vega-lite/v6.1.0.json", "datasets": {"data-bb2941412407e0b752e541772710dc76": [{"intersection_id": 0, "count": 1, "degree": 0, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 6, "count": 1, "degree": 3, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 9, "count": 2, "degree": 4, "set": "1k TRE", "is_intersect": 1}, {"intersection_id": 5, "count": 3, "degree": 2, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 10, "count": 7, "degree": 2, "set": "1k TRE", "is_intersect": 1}, {"intersection_id": 7, "count": 16, "degree": 4, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 8, "count": 359, "degree": 1, "set": "1k TRE", "is_intersect": 1}, {"intersection_id": 1, "count": 921, "degree": 1, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 2, "count": 925, "degree": 2, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 3, "count": 1056, "degree": 3, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 4, "count": 8865, "degree": 1, "set": "1k TRE", "is_intersect": 0}, {"intersection_id": 0, "count": 1, "degree": 0, "set": "100k TRE", "is_intersect": 0}, {"intersection_id": 6, "count": 1, "degree": 3, "set": "100k TRE", "is_intersect": 1}, {"intersection_id": 9, "count": 2, "degree": 4, "set": "100k TRE", "is_intersect": 0}, {"intersection_id": 5, "count": 3, "degree": 2, "set": "100k TRE", "is_intersect": 1}, {"intersection_id": 10, "count": 7, "degree": 2, "set": "100k TRE", "is_intersect": 1}, {"intersection_id": 7, "count": 16, "degree": 4, "set": "100k TRE", "is_intersect": 1}, {"intersection_id": 8, "count": 359, "degree": 1, "set": "100k TRE", "is_intersect": 0}, {"intersection_id": 1, "count": 921, "degree": 1, "set": "100k TRE", "is_intersect": 0}, {"intersection_id": 2, "count": 925, "degree": 2, "set": "100k TRE", "is_intersect": 0}, {"intersection_id": 3, "count": 1056, "degree": 3, "set": "100k TRE", "is_intersect": 0}, {"intersection_id": 4, "count": 8865, "degree": 1, "set": "100k TRE", "is_intersect": 1}, {"intersection_id": 0, "count": 1, "degree": 0, "set": "Narnia", "is_intersect": 0}, {"intersection_id": 6, "count": 1, "degree": 3, "set": "Narnia", "is_intersect": 1}, {"intersection_id": 9, "count": 2, "degree": 4, "set": "Narnia", "is_intersect": 1}, {"intersection_id": 5, "count": 3, "degree": 2, "set": "Narnia", "is_intersect": 0}, {"intersection_id": 10, "count": 7, "degree": 2, "set": "Narnia", "is_intersect": 0}, {"intersection_id": 7, "count": 16, "degree": 4, "set": "Narnia", "is_intersect": 1}, {"intersection_id": 8, "count": 359, "degree": 1, "set": "Narnia", "is_intersect": 0}, {"intersection_id": 1, "count": 921, "degree": 1, "set": "Narnia", "is_intersect": 0}, {"intersection_id": 2, "count": 925, "degree": 2, "set": "Narnia", "is_intersect": 1}, {"intersection_id": 3, "count": 1056, "degree": 3, "set": "Narnia", "is_intersect": 1}, {"intersection_id": 4, "count": 8865, "degree": 1, "set": "Narnia", "is_intersect": 0}, {"intersection_id": 0, "count": 1, "degree": 0, "set": "The Moon", "is_intersect": 0}, {"intersection_id": 6, "count": 1, "degree": 3, "set": "The Moon", "is_intersect": 1}, {"intersection_id": 9, "count": 2, "degree": 4, "set": "The Moon", "is_intersect": 1}, {"intersection_id": 5, "count": 3, "degree": 2, "set": "The Moon", "is_intersect": 0}, {"intersection_id": 10, "count": 7, "degree": 2, "set": "The Moon", "is_intersect": 0}, {"intersection_id": 7, "count": 16, "degree": 4, "set": "The Moon", "is_intersect": 1}, {"intersection_id": 8, "count": 359, "degree": 1, "set": "The Moon", "is_intersect": 0}, {"intersection_id": 1, "count": 921, "degree": 1, "set": "The Moon", "is_intersect": 0}, {"intersection_id": 2, "count": 925, "degree": 2, "set": "The Moon", "is_intersect": 1}, {"intersection_id": 3, "count": 1056, "degree": 3, "set": "The Moon", "is_intersect": 1}, {"intersection_id": 4, "count": 8865, "degree": 1, "set": "The Moon", "is_intersect": 0}, {"intersection_id": 0, "count": 1, "degree": 0, "set": "Tingham", "is_intersect": 0}, {"intersection_id": 6, "count": 1, "degree": 3, "set": "Tingham", "is_intersect": 0}, {"intersection_id": 9, "count": 2, "degree": 4, "set": "Tingham", "is_intersect": 1}, {"intersection_id": 5, "count": 3, "degree": 2, "set": "Tingham", "is_intersect": 1}, {"intersection_id": 10, "count": 7, "degree": 2, "set": "Tingham", "is_intersect": 0}, {"intersection_id": 7, "count": 16, "degree": 4, "set": "Tingham", "is_intersect": 1}, {"intersection_id": 8, "count": 359, "degree": 1, "set": "Tingham", "is_intersect": 0}, {"intersection_id": 1, "count": 921, "degree": 1, "set": "Tingham", "is_intersect": 1}, {"intersection_id": 2, "count": 925, "degree": 2, "set": "Tingham", "is_intersect": 0}, {"intersection_id": 3, "count": 1056, "degree": 3, "set": "Tingham", "is_intersect": 1}, {"intersection_id": 4, "count": 8865, "degree": 1, "set": "Tingham", "is_intersect": 0}], "data-3fda048d0ad9b183201b351e30a2daaf": [{"set": "1k TRE", "set_abbre": "1k TRE"}, {"set": "100k TRE", "set_abbre": "100k TRE"}, {"set": "Narnia", "set_abbre": "Narnia"}, {"set": "The Moon", "set_abbre": "The Moon"}, {"set": "Tingham", "set_abbre": "Tingham"}], "data-2d7d00aa35580b4197e6523e71ccb052": [{"set": "1k TRE", "set_order": 1}, {"set": "100k TRE", "set_order": 2}, {"set": "Narnia", "set_order": 3}, {"set": "The Moon", "set_order": 4}, {"set": "Tingham", "set_order": 5}]}}, {"mode": "vega-lite"});
</script>


