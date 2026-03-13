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




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>TRE</th>
      <th>BIOBANK</th>
      <th>CODE</th>
      <th>COUNT</th>
      <th>ALTERNATIVES</th>
      <th>DATASET</th>
      <th>OMOP</th>
      <th>OMOP_DESCR</th>
      <th>CATEGORY</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1k TRE</td>
      <td>test</td>
      <td>OMOP:0</td>
      <td>580</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>0</td>
      <td>No matching concept</td>
      <td>Condition</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1k TRE</td>
      <td>test</td>
      <td>OMOP:28060</td>
      <td>150</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>28060</td>
      <td>Streptococcal sore throat</td>
      <td>Condition</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1k TRE</td>
      <td>test</td>
      <td>OMOP:75036</td>
      <td>20</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>75036</td>
      <td>Localized, primary osteoarthritis of the hand</td>
      <td>Condition</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1k TRE</td>
      <td>test</td>
      <td>OMOP:78272</td>
      <td>50</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>78272</td>
      <td>Sprain of wrist</td>
      <td>Condition</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1k TRE</td>
      <td>test</td>
      <td>OMOP:80502</td>
      <td>50</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>80502</td>
      <td>Osteoporosis</td>
      <td>Condition</td>
    </tr>
  </tbody>
</table>
</div>



You can get the counts for each code on each TRE with the `counts_by_TRE` property.


```python
codesets.counts_by_TRE.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th>TRE</th>
      <th>100k TRE</th>
      <th>1k TRE</th>
      <th>Narnia</th>
      <th>The Moon</th>
      <th>Tingham</th>
    </tr>
    <tr>
      <th>OMOP</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>8507</th>
      <td>49740.0</td>
      <td>570.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>8515</th>
      <td>1920.0</td>
      <td>70.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>8516</th>
      <td>2020.0</td>
      <td>80.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>8527</th>
      <td>2020.0</td>
      <td>840.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>8532</th>
      <td>50260.0</td>
      <td>560.0</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>



You can view how many codes your TREs have in common with the `code_intersections` property.
This example shows that the 100k and 1k TREs share 7 codes, that "100k TRE" has 8885 unique codes, and the "1k TRE" has 361 unique codes.


```python
codesets.code_intersections
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>0</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>['100k TRE', '1k TRE']</th>
      <td>7</td>
    </tr>
    <tr>
      <th>['100k TRE', 'Narnia', 'The Moon', 'Tingham']</th>
      <td>16</td>
    </tr>
    <tr>
      <th>['100k TRE', 'Narnia', 'The Moon']</th>
      <td>1</td>
    </tr>
    <tr>
      <th>['100k TRE', 'Tingham']</th>
      <td>3</td>
    </tr>
    <tr>
      <th>['100k TRE']</th>
      <td>8865</td>
    </tr>
    <tr>
      <th>['1k TRE', 'Narnia', 'The Moon', 'Tingham']</th>
      <td>2</td>
    </tr>
    <tr>
      <th>['1k TRE']</th>
      <td>359</td>
    </tr>
    <tr>
      <th>['Narnia', 'The Moon', 'Tingham']</th>
      <td>1056</td>
    </tr>
    <tr>
      <th>['Narnia', 'The Moon']</th>
      <td>925</td>
    </tr>
    <tr>
      <th>['Tingham']</th>
      <td>921</td>
    </tr>
    <tr>
      <th>[]</th>
      <td>1</td>
    </tr>
  </tbody>
</table>
</div>



You can plot the $k$ codes with the highest counts using `.plot_top_k_by_count(k)`.
If you run this notebook, you can hover over the bars to get the OMOP description of that code.


```python
codesets.plot_top_k_by_count(10)
```





<style>
  #altair-viz-fb372d5c7874410197a5702f52942700.vega-embed {
    width: 100%;
    display: flex;
  }

  #altair-viz-fb372d5c7874410197a5702f52942700.vega-embed details,
  #altair-viz-fb372d5c7874410197a5702f52942700.vega-embed details summary {
    position: relative;
  }
</style>
<div id="altair-viz-fb372d5c7874410197a5702f52942700"></div>
<script type="text/javascript">
  var VEGA_DEBUG = (typeof VEGA_DEBUG == "undefined") ? {} : VEGA_DEBUG;
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-fb372d5c7874410197a5702f52942700") {
      outputDiv = document.getElementById("altair-viz-fb372d5c7874410197a5702f52942700");
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
  })({"config": {"view": {"continuousWidth": 300, "continuousHeight": 300}}, "data": {"name": "data-a728793463941ee04eb23777eacf1e87"}, "mark": {"type": "bar"}, "encoding": {"color": {"field": "TRE", "type": "nominal"}, "tooltip": {"field": "OMOP_DESCR", "type": "nominal"}, "x": {"field": "Count", "type": "quantitative"}, "y": {"field": "OMOP", "sort": "-x", "type": "nominal"}}, "$schema": "https://vega.github.io/schema/vega-lite/v6.1.0.json", "datasets": {"data-a728793463941ee04eb23777eacf1e87": [{"OMOP": 8532, "TRE": "100k TRE", "Count": 50260.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "1k TRE", "Count": 560.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8507, "TRE": "100k TRE", "Count": 49740.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "1k TRE", "Count": 570.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "MALE"}, {"OMOP": 38003563, "TRE": "100k TRE", "Count": 49960.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "1k TRE", "Count": 110.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003564, "TRE": "100k TRE", "Count": 50040.0, "OMOP_DESCR": "Not Hispanic or Latino"}, {"OMOP": 38003564, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Not Hispanic or Latino"}, {"OMOP": 38003564, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Not Hispanic or Latino"}, {"OMOP": 38003564, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Not Hispanic or Latino"}, {"OMOP": 38003564, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Not Hispanic or Latino"}, {"OMOP": 1001962, "TRE": "100k TRE", "Count": 4290.0, "OMOP_DESCR": "During the past 4 weeks, I have the feeling I am taken seriously by people in my working environment [Quality of Working Life Questionnaire for Cancer Survivors]"}, {"OMOP": 1001962, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "During the past 4 weeks, I have the feeling I am taken seriously by people in my working environment [Quality of Working Life Questionnaire for Cancer Survivors]"}, {"OMOP": 1001962, "TRE": "Narnia", "Count": 8841.0, "OMOP_DESCR": "During the past 4 weeks, I have the feeling I am taken seriously by people in my working environment [Quality of Working Life Questionnaire for Cancer Survivors]"}, {"OMOP": 1001962, "TRE": "The Moon", "Count": 8498.0, "OMOP_DESCR": "During the past 4 weeks, I have the feeling I am taken seriously by people in my working environment [Quality of Working Life Questionnaire for Cancer Survivors]"}, {"OMOP": 1001962, "TRE": "Tingham", "Count": 8295.0, "OMOP_DESCR": "During the past 4 weeks, I have the feeling I am taken seriously by people in my working environment [Quality of Working Life Questionnaire for Cancer Survivors]"}, {"OMOP": 2730954, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Bypass Right Common Iliac Artery to Right Renal Artery with Nonautologous Tissue Substitute, Open Approach"}, {"OMOP": 2730954, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Bypass Right Common Iliac Artery to Right Renal Artery with Nonautologous Tissue Substitute, Open Approach"}, {"OMOP": 2730954, "TRE": "Narnia", "Count": 8978.0, "OMOP_DESCR": "Bypass Right Common Iliac Artery to Right Renal Artery with Nonautologous Tissue Substitute, Open Approach"}, {"OMOP": 2730954, "TRE": "The Moon", "Count": 9756.0, "OMOP_DESCR": "Bypass Right Common Iliac Artery to Right Renal Artery with Nonautologous Tissue Substitute, Open Approach"}, {"OMOP": 2730954, "TRE": "Tingham", "Count": 9665.0, "OMOP_DESCR": "Bypass Right Common Iliac Artery to Right Renal Artery with Nonautologous Tissue Substitute, Open Approach"}, {"OMOP": 36518276, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Mullerian mixed tumor of connective, Subcutaneous and other soft tissues of thorax"}, {"OMOP": 36518276, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Mullerian mixed tumor of connective, Subcutaneous and other soft tissues of thorax"}, {"OMOP": 36518276, "TRE": "Narnia", "Count": 9495.0, "OMOP_DESCR": "Mullerian mixed tumor of connective, Subcutaneous and other soft tissues of thorax"}, {"OMOP": 36518276, "TRE": "The Moon", "Count": 9532.0, "OMOP_DESCR": "Mullerian mixed tumor of connective, Subcutaneous and other soft tissues of thorax"}, {"OMOP": 36518276, "TRE": "Tingham", "Count": 8811.0, "OMOP_DESCR": "Mullerian mixed tumor of connective, Subcutaneous and other soft tissues of thorax"}, {"OMOP": 42936729, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Sulindac 200 MG [CLIDOL]"}, {"OMOP": 42936729, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Sulindac 200 MG [CLIDOL]"}, {"OMOP": 42936729, "TRE": "Narnia", "Count": 9821.0, "OMOP_DESCR": "Sulindac 200 MG [CLIDOL]"}, {"OMOP": 42936729, "TRE": "The Moon", "Count": 8700.0, "OMOP_DESCR": "Sulindac 200 MG [CLIDOL]"}, {"OMOP": 42936729, "TRE": "Tingham", "Count": 9265.0, "OMOP_DESCR": "Sulindac 200 MG [CLIDOL]"}, {"OMOP": 41168568, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "celecoxib 100 MG Oral Capsule [Celecoxib Al] Box of 20 by Aliud"}, {"OMOP": 41168568, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "celecoxib 100 MG Oral Capsule [Celecoxib Al] Box of 20 by Aliud"}, {"OMOP": 41168568, "TRE": "Narnia", "Count": 7952.0, "OMOP_DESCR": "celecoxib 100 MG Oral Capsule [Celecoxib Al] Box of 20 by Aliud"}, {"OMOP": 41168568, "TRE": "The Moon", "Count": 9917.0, "OMOP_DESCR": "celecoxib 100 MG Oral Capsule [Celecoxib Al] Box of 20 by Aliud"}, {"OMOP": 41168568, "TRE": "Tingham", "Count": 9789.0, "OMOP_DESCR": "celecoxib 100 MG Oral Capsule [Celecoxib Al] Box of 20 by Aliud"}, {"OMOP": 21359525, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Sigvaris Coton (15-20mmHg) thigh length closed toe with grip top lymphoedema garment male long extra large"}, {"OMOP": 21359525, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Sigvaris Coton (15-20mmHg) thigh length closed toe with grip top lymphoedema garment male long extra large"}, {"OMOP": 21359525, "TRE": "Narnia", "Count": 9510.0, "OMOP_DESCR": "Sigvaris Coton (15-20mmHg) thigh length closed toe with grip top lymphoedema garment male long extra large"}, {"OMOP": 21359525, "TRE": "The Moon", "Count": 9303.0, "OMOP_DESCR": "Sigvaris Coton (15-20mmHg) thigh length closed toe with grip top lymphoedema garment male long extra large"}, {"OMOP": 21359525, "TRE": "Tingham", "Count": 8556.0, "OMOP_DESCR": "Sigvaris Coton (15-20mmHg) thigh length closed toe with grip top lymphoedema garment male long extra large"}]}}, {"mode": "vega-lite"});
</script>



If you have codes that you're interested in, you can use the `.plot_by_codes(list_of_codes)` method to get a barplot of those.


```python
codesets.plot_by_codes([28060, 3000905])
```





<style>
  #altair-viz-af850e57ed5e4da4a0184b771fbdd30a.vega-embed {
    width: 100%;
    display: flex;
  }

  #altair-viz-af850e57ed5e4da4a0184b771fbdd30a.vega-embed details,
  #altair-viz-af850e57ed5e4da4a0184b771fbdd30a.vega-embed details summary {
    position: relative;
  }
</style>
<div id="altair-viz-af850e57ed5e4da4a0184b771fbdd30a"></div>
<script type="text/javascript">
  var VEGA_DEBUG = (typeof VEGA_DEBUG == "undefined") ? {} : VEGA_DEBUG;
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-af850e57ed5e4da4a0184b771fbdd30a") {
      outputDiv = document.getElementById("altair-viz-af850e57ed5e4da4a0184b771fbdd30a");
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
  })({"config": {"view": {"continuousWidth": 300, "continuousHeight": 300}}, "data": {"name": "data-e89cded756829d18dd1becc550a02ca3"}, "mark": {"type": "bar"}, "encoding": {"color": {"field": "TRE", "type": "nominal"}, "tooltip": {"field": "OMOP_DESCR", "type": "nominal"}, "x": {"field": "Count", "type": "quantitative"}, "y": {"field": "OMOP", "sort": "-x", "type": "nominal"}}, "$schema": "https://vega.github.io/schema/vega-lite/v6.1.0.json", "datasets": {"data-e89cded756829d18dd1becc550a02ca3": [{"OMOP": 28060, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Streptococcal sore throat"}, {"OMOP": 28060, "TRE": "1k TRE", "Count": 150.0, "OMOP_DESCR": "Streptococcal sore throat"}, {"OMOP": 28060, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Streptococcal sore throat"}, {"OMOP": 28060, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Streptococcal sore throat"}, {"OMOP": 28060, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Streptococcal sore throat"}, {"OMOP": 3000905, "TRE": "100k TRE", "Count": 4470.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "1k TRE", "Count": 1120.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}]}}, {"mode": "vega-lite"});
</script>



You can combine this method with ways of generating lists of codes, for example, getting the list of codes that are shared between some TREs, using the `.get_codes_by_membership` method.
These are the codes shared by both of the synthetic datasets.


```python
codesets.plot_by_codes(codesets.get_codes_by_membership("['100k TRE', '1k TRE']")["OMOP"])
```





<style>
  #altair-viz-dfb74fe5d98b44e283df4d81b8c63c37.vega-embed {
    width: 100%;
    display: flex;
  }

  #altair-viz-dfb74fe5d98b44e283df4d81b8c63c37.vega-embed details,
  #altair-viz-dfb74fe5d98b44e283df4d81b8c63c37.vega-embed details summary {
    position: relative;
  }
</style>
<div id="altair-viz-dfb74fe5d98b44e283df4d81b8c63c37"></div>
<script type="text/javascript">
  var VEGA_DEBUG = (typeof VEGA_DEBUG == "undefined") ? {} : VEGA_DEBUG;
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-dfb74fe5d98b44e283df4d81b8c63c37") {
      outputDiv = document.getElementById("altair-viz-dfb74fe5d98b44e283df4d81b8c63c37");
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
  })({"config": {"view": {"continuousWidth": 300, "continuousHeight": 300}}, "data": {"name": "data-c04c945ec29ce9a29b27390dd3cde0d6"}, "mark": {"type": "bar"}, "encoding": {"color": {"field": "TRE", "type": "nominal"}, "tooltip": {"field": "OMOP_DESCR", "type": "nominal"}, "x": {"field": "Count", "type": "quantitative"}, "y": {"field": "OMOP", "sort": "-x", "type": "nominal"}}, "$schema": "https://vega.github.io/schema/vega-lite/v6.1.0.json", "datasets": {"data-c04c945ec29ce9a29b27390dd3cde0d6": [{"OMOP": 8507, "TRE": "100k TRE", "Count": 49740.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "1k TRE", "Count": 570.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8507, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "MALE"}, {"OMOP": 8515, "TRE": "100k TRE", "Count": 1920.0, "OMOP_DESCR": "Asian"}, {"OMOP": 8515, "TRE": "1k TRE", "Count": 70.0, "OMOP_DESCR": "Asian"}, {"OMOP": 8515, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Asian"}, {"OMOP": 8515, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Asian"}, {"OMOP": 8515, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Asian"}, {"OMOP": 8516, "TRE": "100k TRE", "Count": 2020.0, "OMOP_DESCR": "Black or African American"}, {"OMOP": 8516, "TRE": "1k TRE", "Count": 80.0, "OMOP_DESCR": "Black or African American"}, {"OMOP": 8516, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Black or African American"}, {"OMOP": 8516, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Black or African American"}, {"OMOP": 8516, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Black or African American"}, {"OMOP": 8527, "TRE": "100k TRE", "Count": 2020.0, "OMOP_DESCR": "White"}, {"OMOP": 8527, "TRE": "1k TRE", "Count": 840.0, "OMOP_DESCR": "White"}, {"OMOP": 8527, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "White"}, {"OMOP": 8527, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "White"}, {"OMOP": 8527, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "White"}, {"OMOP": 8532, "TRE": "100k TRE", "Count": 50260.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "1k TRE", "Count": 560.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 8532, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "FEMALE"}, {"OMOP": 3000905, "TRE": "100k TRE", "Count": 4470.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "1k TRE", "Count": 1120.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 38003563, "TRE": "100k TRE", "Count": 49960.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "1k TRE", "Count": 110.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Hispanic or Latino"}, {"OMOP": 38003563, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Hispanic or Latino"}]}}, {"mode": "vega-lite"});
</script>



Or if you don't have a set of codes you want to query, but do have some substring to match, you can use the `get_codes_by_substring_match` method. This is case-insensitive and supports regular expressions.


```python
codesets.plot_by_codes(codesets.get_codes_by_substring_match("leuko")["OMOP"])
```





<style>
  #altair-viz-81f174cc10814f3cbacef1a76cb863d3.vega-embed {
    width: 100%;
    display: flex;
  }

  #altair-viz-81f174cc10814f3cbacef1a76cb863d3.vega-embed details,
  #altair-viz-81f174cc10814f3cbacef1a76cb863d3.vega-embed details summary {
    position: relative;
  }
</style>
<div id="altair-viz-81f174cc10814f3cbacef1a76cb863d3"></div>
<script type="text/javascript">
  var VEGA_DEBUG = (typeof VEGA_DEBUG == "undefined") ? {} : VEGA_DEBUG;
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-81f174cc10814f3cbacef1a76cb863d3") {
      outputDiv = document.getElementById("altair-viz-81f174cc10814f3cbacef1a76cb863d3");
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
  })({"config": {"view": {"continuousWidth": 300, "continuousHeight": 300}}, "data": {"name": "data-23db58bc3def801d6732df0a39f3852e"}, "mark": {"type": "bar"}, "encoding": {"color": {"field": "TRE", "type": "nominal"}, "tooltip": {"field": "OMOP_DESCR", "type": "nominal"}, "x": {"field": "Count", "type": "quantitative"}, "y": {"field": "OMOP", "sort": "-x", "type": "nominal"}}, "$schema": "https://vega.github.io/schema/vega-lite/v6.1.0.json", "datasets": {"data-23db58bc3def801d6732df0a39f3852e": [{"OMOP": 604772, "TRE": "100k TRE", "Count": 4290.0, "OMOP_DESCR": "Human leukocyte antigen DQB1*02:02 positive"}, {"OMOP": 604772, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen DQB1*02:02 positive"}, {"OMOP": 604772, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen DQB1*02:02 positive"}, {"OMOP": 604772, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen DQB1*02:02 positive"}, {"OMOP": 604772, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen DQB1*02:02 positive"}, {"OMOP": 619739, "TRE": "100k TRE", "Count": 4290.0, "OMOP_DESCR": "No leukocytes seen in urine via microscopy"}, {"OMOP": 619739, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "No leukocytes seen in urine via microscopy"}, {"OMOP": 619739, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "No leukocytes seen in urine via microscopy"}, {"OMOP": 619739, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "No leukocytes seen in urine via microscopy"}, {"OMOP": 619739, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "No leukocytes seen in urine via microscopy"}, {"OMOP": 1988630, "TRE": "100k TRE", "Count": 4650.0, "OMOP_DESCR": "Leukocyte clumps [Presence] in Body fluid by Automated"}, {"OMOP": 1988630, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukocyte clumps [Presence] in Body fluid by Automated"}, {"OMOP": 1988630, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocyte clumps [Presence] in Body fluid by Automated"}, {"OMOP": 1988630, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocyte clumps [Presence] in Body fluid by Automated"}, {"OMOP": 1988630, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocyte clumps [Presence] in Body fluid by Automated"}, {"OMOP": 3000348, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Leukocyte esterase [Presence] in Urine by Test strip"}, {"OMOP": 3000348, "TRE": "1k TRE", "Count": 30.0, "OMOP_DESCR": "Leukocyte esterase [Presence] in Urine by Test strip"}, {"OMOP": 3000348, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocyte esterase [Presence] in Urine by Test strip"}, {"OMOP": 3000348, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocyte esterase [Presence] in Urine by Test strip"}, {"OMOP": 3000348, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocyte esterase [Presence] in Urine by Test strip"}, {"OMOP": 3000905, "TRE": "100k TRE", "Count": 4470.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "1k TRE", "Count": 1120.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3000905, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocytes [#/volume] in Blood by Automated count"}, {"OMOP": 3022407, "TRE": "100k TRE", "Count": 4470.0, "OMOP_DESCR": "Monocytes/100 leukocytes in Blood by Manual count"}, {"OMOP": 3022407, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Monocytes/100 leukocytes in Blood by Manual count"}, {"OMOP": 3022407, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Monocytes/100 leukocytes in Blood by Manual count"}, {"OMOP": 3022407, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Monocytes/100 leukocytes in Blood by Manual count"}, {"OMOP": 3022407, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Monocytes/100 leukocytes in Blood by Manual count"}, {"OMOP": 3027549, "TRE": "100k TRE", "Count": 4600.0, "OMOP_DESCR": "Eosinophils/100 leukocytes in Stool by Manual count"}, {"OMOP": 3027549, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Eosinophils/100 leukocytes in Stool by Manual count"}, {"OMOP": 3027549, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Eosinophils/100 leukocytes in Stool by Manual count"}, {"OMOP": 3027549, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Eosinophils/100 leukocytes in Stool by Manual count"}, {"OMOP": 3027549, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Eosinophils/100 leukocytes in Stool by Manual count"}, {"OMOP": 3030644, "TRE": "100k TRE", "Count": 4580.0, "OMOP_DESCR": "Segmented neutrophils/100 leukocytes in Pericardial fluid"}, {"OMOP": 3030644, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Segmented neutrophils/100 leukocytes in Pericardial fluid"}, {"OMOP": 3030644, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Segmented neutrophils/100 leukocytes in Pericardial fluid"}, {"OMOP": 3030644, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Segmented neutrophils/100 leukocytes in Pericardial fluid"}, {"OMOP": 3030644, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Segmented neutrophils/100 leukocytes in Pericardial fluid"}, {"OMOP": 3032882, "TRE": "100k TRE", "Count": 4640.0, "OMOP_DESCR": "Unidentified cells/100 leukocytes in Peritoneal fluid"}, {"OMOP": 3032882, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Unidentified cells/100 leukocytes in Peritoneal fluid"}, {"OMOP": 3032882, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Unidentified cells/100 leukocytes in Peritoneal fluid"}, {"OMOP": 3032882, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Unidentified cells/100 leukocytes in Peritoneal fluid"}, {"OMOP": 3032882, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Unidentified cells/100 leukocytes in Peritoneal fluid"}, {"OMOP": 3034854, "TRE": "100k TRE", "Count": 4530.0, "OMOP_DESCR": "Basophils/100 leukocytes in Amniotic fluid by Manual count"}, {"OMOP": 3034854, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Basophils/100 leukocytes in Amniotic fluid by Manual count"}, {"OMOP": 3034854, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Basophils/100 leukocytes in Amniotic fluid by Manual count"}, {"OMOP": 3034854, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Basophils/100 leukocytes in Amniotic fluid by Manual count"}, {"OMOP": 3034854, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Basophils/100 leukocytes in Amniotic fluid by Manual count"}, {"OMOP": 3051052, "TRE": "100k TRE", "Count": 4570.0, "OMOP_DESCR": "Adenosine deaminase [Entitic Catalytic Activity] in Leukocytes"}, {"OMOP": 3051052, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Adenosine deaminase [Entitic Catalytic Activity] in Leukocytes"}, {"OMOP": 3051052, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Adenosine deaminase [Entitic Catalytic Activity] in Leukocytes"}, {"OMOP": 3051052, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Adenosine deaminase [Entitic Catalytic Activity] in Leukocytes"}, {"OMOP": 3051052, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Adenosine deaminase [Entitic Catalytic Activity] in Leukocytes"}, {"OMOP": 3052377, "TRE": "100k TRE", "Count": 4520.0, "OMOP_DESCR": "Pork triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052377, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Pork triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052377, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Pork triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052377, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Pork triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052377, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Pork triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052675, "TRE": "100k TRE", "Count": 4460.0, "OMOP_DESCR": "Patent blue V triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052675, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Patent blue V triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052675, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Patent blue V triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052675, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Patent blue V triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 3052675, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Patent blue V triggered leukotriene release [Mass/volume] by Leukocytes"}, {"OMOP": 4010405, "TRE": "100k TRE", "Count": 4520.0, "OMOP_DESCR": "Leukocyte antibody measurement"}, {"OMOP": 4010405, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukocyte antibody measurement"}, {"OMOP": 4010405, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocyte antibody measurement"}, {"OMOP": 4010405, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocyte antibody measurement"}, {"OMOP": 4010405, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocyte antibody measurement"}, {"OMOP": 4124120, "TRE": "100k TRE", "Count": 4300.0, "OMOP_DESCR": "Human leukocyte antigen class I type antigen A1 - B57"}, {"OMOP": 4124120, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen class I type antigen A1 - B57"}, {"OMOP": 4124120, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen class I type antigen A1 - B57"}, {"OMOP": 4124120, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen class I type antigen A1 - B57"}, {"OMOP": 4124120, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen class I type antigen A1 - B57"}, {"OMOP": 4124137, "TRE": "100k TRE", "Count": 4320.0, "OMOP_DESCR": "Human leukocyte antigen A allele"}, {"OMOP": 4124137, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen A allele"}, {"OMOP": 4124137, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen A allele"}, {"OMOP": 4124137, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen A allele"}, {"OMOP": 4124137, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Human leukocyte antigen A allele"}, {"OMOP": 4147999, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Leukostasis"}, {"OMOP": 4147999, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukostasis"}, {"OMOP": 4147999, "TRE": "Narnia", "Count": 4482.0, "OMOP_DESCR": "Leukostasis"}, {"OMOP": 4147999, "TRE": "The Moon", "Count": 232.0, "OMOP_DESCR": "Leukostasis"}, {"OMOP": 4147999, "TRE": "Tingham", "Count": 7773.0, "OMOP_DESCR": "Leukostasis"}, {"OMOP": 4175950, "TRE": "100k TRE", "Count": 4580.0, "OMOP_DESCR": "alpha-L-Iduronidase measurement, leukocytes"}, {"OMOP": 4175950, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "alpha-L-Iduronidase measurement, leukocytes"}, {"OMOP": 4175950, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "alpha-L-Iduronidase measurement, leukocytes"}, {"OMOP": 4175950, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "alpha-L-Iduronidase measurement, leukocytes"}, {"OMOP": 4175950, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "alpha-L-Iduronidase measurement, leukocytes"}, {"OMOP": 4245137, "TRE": "100k TRE", "Count": 4210.0, "OMOP_DESCR": "Leukocyte poor blood preparation, nylon filter"}, {"OMOP": 4245137, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukocyte poor blood preparation, nylon filter"}, {"OMOP": 4245137, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocyte poor blood preparation, nylon filter"}, {"OMOP": 4245137, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocyte poor blood preparation, nylon filter"}, {"OMOP": 4245137, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocyte poor blood preparation, nylon filter"}, {"OMOP": 4275348, "TRE": "100k TRE", "Count": 4270.0, "OMOP_DESCR": "Urine microscopy: leukocytes - lymphs present"}, {"OMOP": 4275348, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Urine microscopy: leukocytes - lymphs present"}, {"OMOP": 4275348, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Urine microscopy: leukocytes - lymphs present"}, {"OMOP": 4275348, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Urine microscopy: leukocytes - lymphs present"}, {"OMOP": 4275348, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Urine microscopy: leukocytes - lymphs present"}, {"OMOP": 21405694, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Leukomed dressing 8cm x 15cm (BSN medical Ltd) 50 dressing"}, {"OMOP": 21405694, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukomed dressing 8cm x 15cm (BSN medical Ltd) 50 dressing"}, {"OMOP": 21405694, "TRE": "Narnia", "Count": 8813.0, "OMOP_DESCR": "Leukomed dressing 8cm x 15cm (BSN medical Ltd) 50 dressing"}, {"OMOP": 21405694, "TRE": "The Moon", "Count": 8549.0, "OMOP_DESCR": "Leukomed dressing 8cm x 15cm (BSN medical Ltd) 50 dressing"}, {"OMOP": 21405694, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukomed dressing 8cm x 15cm (BSN medical Ltd) 50 dressing"}, {"OMOP": 40758925, "TRE": "100k TRE", "Count": 4560.0, "OMOP_DESCR": "Leukocyte phosphatase [Presence] in Leukocytes"}, {"OMOP": 40758925, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukocyte phosphatase [Presence] in Leukocytes"}, {"OMOP": 40758925, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocyte phosphatase [Presence] in Leukocytes"}, {"OMOP": 40758925, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocyte phosphatase [Presence] in Leukocytes"}, {"OMOP": 40758925, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocyte phosphatase [Presence] in Leukocytes"}, {"OMOP": 40762890, "TRE": "100k TRE", "Count": 4580.0, "OMOP_DESCR": "Leukocytes in 3 hour Urine sediment by Light microscopy"}, {"OMOP": 40762890, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukocytes in 3 hour Urine sediment by Light microscopy"}, {"OMOP": 40762890, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Leukocytes in 3 hour Urine sediment by Light microscopy"}, {"OMOP": 40762890, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Leukocytes in 3 hour Urine sediment by Light microscopy"}, {"OMOP": 40762890, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukocytes in 3 hour Urine sediment by Light microscopy"}, {"OMOP": 40771542, "TRE": "100k TRE", "Count": 4500.0, "OMOP_DESCR": "Immature granulocytes/100 leukocytes in Synovial fluid"}, {"OMOP": 40771542, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Immature granulocytes/100 leukocytes in Synovial fluid"}, {"OMOP": 40771542, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Immature granulocytes/100 leukocytes in Synovial fluid"}, {"OMOP": 40771542, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Immature granulocytes/100 leukocytes in Synovial fluid"}, {"OMOP": 40771542, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Immature granulocytes/100 leukocytes in Synovial fluid"}, {"OMOP": 43055314, "TRE": "100k TRE", "Count": 4530.0, "OMOP_DESCR": "Basophils/Leukocytes [Pure number fraction] in Synovial fluid by Manual count"}, {"OMOP": 43055314, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Basophils/Leukocytes [Pure number fraction] in Synovial fluid by Manual count"}, {"OMOP": 43055314, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Basophils/Leukocytes [Pure number fraction] in Synovial fluid by Manual count"}, {"OMOP": 43055314, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Basophils/Leukocytes [Pure number fraction] in Synovial fluid by Manual count"}, {"OMOP": 43055314, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Basophils/Leukocytes [Pure number fraction] in Synovial fluid by Manual count"}, {"OMOP": 43055370, "TRE": "100k TRE", "Count": 4680.0, "OMOP_DESCR": "Monocytes/Leukocytes [Pure number fraction] in Blood by Automated count"}, {"OMOP": 43055370, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Monocytes/Leukocytes [Pure number fraction] in Blood by Automated count"}, {"OMOP": 43055370, "TRE": "Narnia", "Count": 0.0, "OMOP_DESCR": "Monocytes/Leukocytes [Pure number fraction] in Blood by Automated count"}, {"OMOP": 43055370, "TRE": "The Moon", "Count": 0.0, "OMOP_DESCR": "Monocytes/Leukocytes [Pure number fraction] in Blood by Automated count"}, {"OMOP": 43055370, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Monocytes/Leukocytes [Pure number fraction] in Blood by Automated count"}, {"OMOP": 43373630, "TRE": "100k TRE", "Count": 0.0, "OMOP_DESCR": "Leukoplast (1071) 2.5 Cm X 2.5 M Tape"}, {"OMOP": 43373630, "TRE": "1k TRE", "Count": 0.0, "OMOP_DESCR": "Leukoplast (1071) 2.5 Cm X 2.5 M Tape"}, {"OMOP": 43373630, "TRE": "Narnia", "Count": 886.0, "OMOP_DESCR": "Leukoplast (1071) 2.5 Cm X 2.5 M Tape"}, {"OMOP": 43373630, "TRE": "The Moon", "Count": 1019.0, "OMOP_DESCR": "Leukoplast (1071) 2.5 Cm X 2.5 M Tape"}, {"OMOP": 43373630, "TRE": "Tingham", "Count": 0.0, "OMOP_DESCR": "Leukoplast (1071) 2.5 Cm X 2.5 M Tape"}]}}, {"mode": "vega-lite"});
</script>



You can get a heatmap of how many codes are in each combination of datasets as a heatmap with `.plot_count_heatmap`


```python
codesets.plot_count_heatmap().properties(width=600, height=600)
```





<style>
  #altair-viz-fd5e88de960f48eaa5383b21d2fb58a2.vega-embed {
    width: 100%;
    display: flex;
  }

  #altair-viz-fd5e88de960f48eaa5383b21d2fb58a2.vega-embed details,
  #altair-viz-fd5e88de960f48eaa5383b21d2fb58a2.vega-embed details summary {
    position: relative;
  }
</style>
<div id="altair-viz-fd5e88de960f48eaa5383b21d2fb58a2"></div>
<script type="text/javascript">
  var VEGA_DEBUG = (typeof VEGA_DEBUG == "undefined") ? {} : VEGA_DEBUG;
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-fd5e88de960f48eaa5383b21d2fb58a2") {
      outputDiv = document.getElementById("altair-viz-fd5e88de960f48eaa5383b21d2fb58a2");
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
  })({"config": {"view": {"continuousWidth": 300, "continuousHeight": 300}}, "data": {"name": "data-66c0c809ab4b5af683a377e644596847"}, "mark": {"type": "rect", "cornerRadius": 20}, "encoding": {"color": {"field": "fraction", "scale": {"scheme": "greens"}, "type": "quantitative"}, "tooltip": {"field": "count", "type": "quantitative"}, "x": {"field": "tre1", "type": "nominal"}, "y": {"field": "tre2", "type": "nominal"}}, "height": 600, "width": 600, "$schema": "https://vega.github.io/schema/vega-lite/v6.1.0.json", "datasets": {"data-66c0c809ab4b5af683a377e644596847": [{"tre1": "1k TRE", "tre2": "1k TRE", "count": 368, "fraction": 1.0}, {"tre1": "1k TRE", "tre2": "100k TRE", "count": 7, "fraction": 0.019021739130434784}, {"tre1": "1k TRE", "tre2": "Narnia", "count": 2, "fraction": 0.005434782608695652}, {"tre1": "1k TRE", "tre2": "The Moon", "count": 2, "fraction": 0.005434782608695652}, {"tre1": "1k TRE", "tre2": "Tingham", "count": 2, "fraction": 0.005434782608695652}, {"tre1": "100k TRE", "tre2": "1k TRE", "count": 7, "fraction": 0.0007872244714349977}, {"tre1": "100k TRE", "tre2": "100k TRE", "count": 8892, "fraction": 1.0}, {"tre1": "100k TRE", "tre2": "Narnia", "count": 17, "fraction": 0.0019118308591992803}, {"tre1": "100k TRE", "tre2": "The Moon", "count": 17, "fraction": 0.0019118308591992803}, {"tre1": "100k TRE", "tre2": "Tingham", "count": 19, "fraction": 0.002136752136752137}, {"tre1": "Narnia", "tre2": "1k TRE", "count": 2, "fraction": 0.001}, {"tre1": "Narnia", "tre2": "100k TRE", "count": 17, "fraction": 0.0085}, {"tre1": "Narnia", "tre2": "Narnia", "count": 2000, "fraction": 1.0}, {"tre1": "Narnia", "tre2": "The Moon", "count": 2000, "fraction": 1.0}, {"tre1": "Narnia", "tre2": "Tingham", "count": 1075, "fraction": 0.5375}, {"tre1": "The Moon", "tre2": "1k TRE", "count": 2, "fraction": 0.001}, {"tre1": "The Moon", "tre2": "100k TRE", "count": 17, "fraction": 0.0085}, {"tre1": "The Moon", "tre2": "Narnia", "count": 2000, "fraction": 1.0}, {"tre1": "The Moon", "tre2": "The Moon", "count": 2000, "fraction": 1.0}, {"tre1": "The Moon", "tre2": "Tingham", "count": 1075, "fraction": 0.5375}, {"tre1": "Tingham", "tre2": "1k TRE", "count": 2, "fraction": 0.001}, {"tre1": "Tingham", "tre2": "100k TRE", "count": 19, "fraction": 0.0095}, {"tre1": "Tingham", "tre2": "Narnia", "count": 1075, "fraction": 0.5375}, {"tre1": "Tingham", "tre2": "The Moon", "count": 1075, "fraction": 0.5375}, {"tre1": "Tingham", "tre2": "Tingham", "count": 2000, "fraction": 1.0}]}}, {"mode": "vega-lite"});
</script>



You can also get an [Upset plot](https://upset.app/) for your datasets.
This is like a Venn diagram, but instead of numbers written in circles, you get bars proportional to the number of codes present in each combination of TREs.
This shows the same information as the `code_insersections` property.
If you only have a couple of TREs, this isn't terribly useful, but once you have more than three, the number of combinations is much higher, and Venn diagrams get hard to read.


```python
codesets.plot_upset()
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


