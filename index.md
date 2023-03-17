---

layout: col-sidebar
title: OWASP IDE-VulScanner
level: 2
type: 
pitch: Checks code vulnerability during implementation phase

---
![IDE-VulScanner](/assets/images/logo-small.png)
---
IDE-VulScanner is a IDE agnostic tool for developers to identify vulnerable code dependencies during implementation phase, which in-tern would save huge security patching cost identified via CI/CD pipelines otherwise.

### Features
* Vulnerability code scan during implementation phase
* Save security patch & maintenance cost
* Low overall high & critical vulnerabilities
* Works for all the know IDEs i.e. Intellij, eclipse, VS Code etc.

### How it works
* Tool uses [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/), which is a software compisition analysis (SCA) tool
* Any dependency used within code can be anlysed from a developer's IDE during implementation phase to identify a potential security risk
* Plugins suppoting common IDE i.e. eclipse, intellij, vscode are easy to install and gives user a comprehensive view of all the vulnerable dependencies used within code with recommended fix

### Examples
* A vulneability report within vscode editor
![vscode](/assets/images/vscode.png)

* A vulnerability report within intellij editor
![intellij](/assets/images/intellij.png)

