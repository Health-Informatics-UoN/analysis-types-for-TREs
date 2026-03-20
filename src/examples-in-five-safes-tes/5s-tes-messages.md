---
theme: air
style: ../entrust-style.css
title: Five Safes TES messages
---

# TES messages for 5s-TES

<div class="tip">

The information included here is not essential, but can help you understand what's going under the hood of tools like [the wizards](examples-in-five-safes-tes/submission-layer-wizards)

</div>

The reference documentation for TES messages specifies the standard for [creating a task](https://ga4gh.github.io/task-execution-schemas/docs/#tag/TaskService/operation/CreateTask).
5s-TES accepts this format, but some fields are treated differently because of how the [submission layer](examples-in-five-safes-tes#submission-layer) processes messages before they're sent to a TES engine.

## TES fields

<!--The 5s-TES docs include a 'state' field
Is this documented? Not part of the TES spec-->
| | |
|---|---|
| `name` | User provided task name |
| `description` | User provided task description |
| `inputs` | In a TES message, you can specify files which you would like the engine to download and use in your task. Whether these inputs will be downloaded when your task is running depends on the TRE; some will not allow inputs to be downloaded for security. |
| `outputs` | In TES messages, this specifies where outputs should be stored. This is amended by the TRE agent. |
| `resources` | In a TES message, you can specify the computing resources you would like to have for your task. A TRE may choose what resources you are given, rather than following this. |
| `executors` | A list of containers to run. The images available will depend on what TREs allow. |
| `volumes` | Shared volumes that the containers can use to share data among themselves |
| `tags` | optional in TES, but important for orchestration by the submission layer |

## Use of tags in 5s-TES
In TES, the `tags` field is "used to store meta-data and annotations about a task".
However, in 5s-TES, this has been overloaded so that two tags are essential.

A `Project` tag must contain the name of an approved project in the submission layer

A `tres` tag must contain a list of TREs that should run the task, separated by a pipe character (|).

An example of the `tags` field is:

```json
"tags": {
            "Project": "NottinghamDemo",
            "tres": "Nottingham TRE 01|Nottingham TRE 02"
         },
```
