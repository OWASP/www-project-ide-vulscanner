---

layout: col-sidebar
title: OWASP IDE-VulScanner
level: 2
type: 
pitch: Checks code vulnerability during implementation phase

---
![IDE-VulScanner](/assets/images/logo-small.png)
---
IDE-VulScanner is an IDE agnostic tool for developers to identify vulnerable code dependencies during implementation phase, which in-tern would save huge security patching and maintenance costs. This usually is caught during CI/CD build phase.

### Features
* Vulnerability code scan during implementation phase
* Save security patch & maintenance costs
* Low overall high & critical vulnerabilities counts
* IDE agonistic, compatible to known IDE i.e. IntelliJ, eclipse, VS Code etc

### How it works
* Tool uses [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/), which is a software compisition analysis (SCA) tool
* Any third party dependency used within code can be analyzed from a developer's IDE. This would prevent overall code from a potential security risk
* Plugins supporting common IDEs i.e. eclipse, IntelliJ, vscode are easy to install. Gives a developer a comprehensive view of all the vulnerable dependencies used within code with recommended fix

### Preview

[![intelliJ](/assets/images/intellij-plugin.png)]

[Video Link](https://www.youtube.com/watch?v=T2tFPMnX94c "OWASP IDE-VulScanner")



