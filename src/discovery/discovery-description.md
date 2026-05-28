---
theme: air
style: ../entrust-style.css
title: Discovery Workbench Example
---
# Discovery Workbench Example

As a researcher doesn't see the data, they will need some information in order to assess the data set for suitability for their research project. We have created an example of how to do this using a discovery tool provided for use on OMOP data. This tool retrieves metadata, which can be used for this purpose. 

This demo notebook will go through using the Five Safes TES workbench to submit a query, which requests discovery, or demographic information. This information is returned from the TREs and parsed using methods provided, allowing inspection of the metadata. Typically, this includes data on the OMOP concept codes and their frequency of occurrence at each TRE. Not only can this be used to check the overall ocurrence, but also how many codes occur in both TREs, and how many records share those codes.

This tutorial can be run as a Jupyter notebook in the [5s-TES notebooks repository](https://github.com/Health-Informatics-UoN/5s-TES-notebooks/tree/main/OMOP-metadata), which also contains the utilities used to visualise OMOP metadata, and a further [demo which uses the wizards.](../wizard-examples/Bunny%20visualisations)

This kind of data can be obtained from Five Safes TES (5STES) by submitting a TES message. In this example, we create the TES message using the [workbench](/workbench/).

This section builds the TES message:

```
wb.build_tes.bunny(
    name="OMOP metadata",
    command=[
        "--body-json",
        '{"code":"GENERIC","analysis":"DISTRIBUTION","uuid":"123","collection":"test","owner":"me"}',
        "--output",
        "/outputs/output.json",
        "--no-encode",
    ],
)
```

We have provided some utilities to help users interpret the outputs of these distribution queries, importable from `omop_metadata_utils`.


The example uses the publicly available "delphi-100k" OMOP CDM dataset, held in University of Nottingham test TREs.

The workbench will handle fetching the data, just by running the correct command once the data has been approved for egress.

Initialising a `DistributionCodesets` object with a dictionary with names you recognise and the paths to the files means that visualisations etc. will keep those labels.

We demonstrate several of the features available for visualisation



```python
codesets = DistributionCodesets(metadata_paths)
```

You can look at the raw tables from the query in the `.tables` attribute.


```python

codesets.tables["Nottingham TRE 01"].head()
```

| TRE | BIOBANK | CODE | COUNT | ALTERNATIVES | DATASET | OMOP | OMOP_DESCR | CATEGORY | 
| --- | ------- | ---- | ----- | ------------ | ------- | ---- | ---------- | -------- |
| Nottingham TRE 01 | test | OMOP:31967 | 580 | NaN | NaN | 31967 | Nausea | Condition |
| Nottingham TRE 01 | test | OMOP:75576 | 150 | NaN | NaN | 75576 | Irritable bowel syndrome | Condition |
| Nottingham TRE 01 | test | OMOP:77074 | 20 | NaN | NaN | 77074 | Pain of joint | Condition |
| Nottingham TRE 01 | test | OMOP:80180 | 50 | NaN | NaN | 80180 | Osteoarthritis | Condition |
| Nottingham TRE 01 | test | OMOP:80809 | 50 | NaN | NaN | 80809 | Rheumatoid arthritis | Condition |

You can get the counts for each code on each TRE with the `counts_by_TRE` property.


```python
codesets.counts_by_TRE.head()
```

You can view how many codes your TREs have in common with the `code_intersections` property.
This example shows that Nottingham TRE 01 and Nottingham TRE 02 share 779 codes, that Nottingham TRE 01 has 17 unique codes, and the Nottingham TRE 02 has 24 unique codes.

```python
codesets.code_intersections
```

|     |     |
| --- | --- |
| \['Nottingham TRE 01', 'Nottingham TRE 02'\] | 	779 |
| \['Nottingham TRE 01'\] | 	17 |
| \[''Nottingham TRE 02'\] | 	24 |


You can plot the k codes with the highest counts using `.plot_top_k_by_count(k)`.
If you run this notebook, you can hover over the bars to get the OMOP description of that code.

```python
codesets.plot_top_k_by_count(10)
```

```js
const top10Plot = FileAttachment("../data/vega-plots/delphi-count-top-10.json").json();
```

```js
vl.render({
  spec: {
    width: 600,
    height: 400,
    data: {values: top10Plot.datasets["data-13d91ca7a11a05ede6f57552be866b43"]},
    mark: "bar",
    encoding: top10Plot.encoding
  }
})
```

If you have codes that you're interested in, you can use the `.plot_by_codes(list_of_codes)` method to get a barplot of those.


```python
codesets.plot_by_codes([3004000, 2006977])
```

```js
const countByCodes = FileAttachment("../data/vega-plots/delphi-plot-by-codes.json").json()
```

```js
vl.render({
  spec: {
    width: 600,
    height: 200,
    data: {values: countByCodes.datasets["data-829b32614b6f22fe77ac69a7071a7fe7"]},
    mark: "bar",
    encoding: countByCodes.encoding
  }
})
```


If you don't have a set of codes you want to query, but do have some substring to match, you can use the `get_codes_by_substring_match` method. This is case-insensitive and supports regular expressions.


```python
codesets.plot_by_codes(codesets.get_codes_by_substring_match("cancer|neoplasm")["OMOP"])
```

```js
const countBySubstring = FileAttachment("../data/vega-plots/delphi-get-codes-by-substring-cancer.json").json()
```

```js
vl.render({
  spec: {
    height: 800,
    width: 600,
    mark: "bar",
    data: {values: countBySubstring.datasets["data-c8659becdc5bc4d9617fbe8a2118d7ab"]},
    encoding: countBySubstring.encoding
  }
})
```


You can get a heatmap of how many codes are in each combination of datasets as a heatmap with `.plot_count_heatmap`


```python
codesets.plot_count_heatmap().properties(width=600, height=600)
```

```js
const heatmap = FileAttachment("../data/vega-plots/delphi-heatmap.json").json()
```

```js
vl.render({
  spec: {
    height: 600,
    width: 600,
    mark: heatmap.mark,
    data: {values: heatmap.datasets["data-337191ecc19bb363e2e8a02f8438dc08"]},
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
const upset = FileAttachment("../data/vega-plots/delphi-upset.json").json()
```

```js
vl.render({spec: upset})
```
