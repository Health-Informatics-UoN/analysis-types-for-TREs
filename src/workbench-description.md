---
theme: air
style: entrust-style.css
title: Workbench
---
# Workbench

Five Safes TES workbench is a python library of tools designed to make interacting with Five Safes TES simpler and easier, available on [Github](https://github.com/federated-research/5S-TES-Workbench) and [PyPi](https://pypi.org/project/five-safes-tes-workbench/). Its main functions are to assist with creation and submission of TES messages, as well as retrieval of results.

The typical workflow consists of four steps:

 - Validate: Provide your infrastructure configuration and credentials.
 - Build: Choose a task template and supply your analysis parameters.
 - Submit: Send the task to the TES endpoint.
 - Fetch Results: Fetch output files from MinIO storage once the task completes.

 There are several ways to pass the configuration and authorisation information to workbench. Information can be passed in directly, or it can be put into a config.yml file. The file is the recommended method, as it means that the file can be reused, rather than copying the information in every time. We also recommend using keycloak credentials over the token, where possible as tokens have a short lifetime.

There is a Jupyter [notebook](https://github.com/federated-research/5S-TES-Workbench/blob/main/src/five_safes_tes_workbench/notebooks/workbench-example.ipynb) demonstrating the workbench's main functions.



 ```
 # ----- Five Safes TES Workbench — Example Configuration ------

config:

  # ---- Required Configuration ----

  project: "your-project-name"
  tes_base_url: "http://localhost:5034"
  minio_sts_endpoint: "http://your-minio-endpoint:9000/sts"
  minio_endpoint: "your-minio-endpoint:9000"
  minio_output_bucket: "your-output-bucket-name"
  tres:
    - "Your-TRE1"
    - "Add more TREs as needed"


auth:
  # ---- Option 1: Access Token ----
  # (Use Access Token if you have one from the Submission UI.)

  access_token: "your-access-token-here"

  # ---- Option 2: Keycloak Credentials ----
  # (Use Keycloak credentials if you want the Workbench to obtain an access token on your behalf.)

  client_id: "your-keycloak-client-id"
  client_secret: "your-keycloak-client-secret"
  username: "your-keycloak-username"
  password: "your-keycloak-password"
  keycloak_url: "http://localhost:your-keycloak-port/"
  ```