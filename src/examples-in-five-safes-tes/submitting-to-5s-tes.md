---
theme: air
style: ../entrust-style.css
title: Submitting to Five Safes TES
---

# Submitting to Five Safes TES
Researchers interact with Five Safes TES (5S-TES) using the submission layer.
The submission layer ensures [two of the Five Safes](/examples-in-five-safes-tes#the-five-safes): **<span style="color:#204F90">Safe People</span>** and **<span style="color:#204F90">Safe Projects</span>**.
This means you have to become a user, and be added to a project.
The submission layer has an HTTP API which accepts [TES messages](./5s-tes-messages.md). For convenience a [web application](#web-application) and [Python client library](#workbench) have been provided.

## Background
### Projects
5s-TES users do not interact directly with Trusted Research Environments (TREs).
Instead, data access in TREs is scoped by a project, which has a defined time for which it is valid, and defined data users can access through it.
This means that you have to request, and be approved for, permission to make submissions to a project.

### Submissions
A submission means sending a [Five safes TES message](5s-tes-messages) to the submission layer.
The submission layer then uses [tags](5s-tes-messages#use-of-tags-in-5s-tes) to assign the task to a project and which TREs should run it.

### Authentication
If you are making submissions to 5s-TES using the web application, those interactions are authenticated when you log in.
If you are making submissions programmatically, you will have to authenticate your requests using an API token.
To get an access token, select "API access token" in the top ribbon of the Submission layer web application and copy it to your clipboard.

<div class="note">

Tokens expire.
The time and date at which your current token expires are shown above the token
</div>

## Preparing for a submission

<div class="steps-container">

  <div class="step complete">
    <div class="step-indicator">
      <div class="step-num">✓</div>
    </div>
    <div class="step-body">
      <p class="step-title">Are you a Submission layer user?</p>
      <p class="step-desc">If you are not already a user, an administrator will have to <a href="https://docs.federated-analytics.ac.uk/submission/guides/submissionManagerAddingNewPerson">add a new researcher</a></p>
    </div>
  </div>

  <div class="step complete">
    <div class="step-indicator">
      <div class="step-num">✓</div>
    </div>
    <div class="step-body">
      <p class="step-title">Are you assigned to a project?</p>
      <p class="step-desc">If not, you cannot make submissions. An administrator will have to <a href="https://docs.federated-analytics.ac.uk/submission/guides/submissionManagerSetupNewProject#add-people-to-the-project">add you to a project</a></p>
    </div>
  </div>

  <div class="step complete">
    <div class="step-indicator">
      <div class="step-num">✓</div>
    </div>
    <div class="step-body">
      <p class="step-title">(Optional) Do you have an access key?</p>
      <p class="step-desc">If you aren't submitting through the web application, you'll need to get your access key as described above</a></p>
    </div>
  </div>

</div>

## Methods
### Workbench

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

### Web application
