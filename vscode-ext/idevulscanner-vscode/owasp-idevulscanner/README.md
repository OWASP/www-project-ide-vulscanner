# IDE-VulScanner
![Build](https://github.com/mwalter/MavenDependencyChecker/workflows/Build/badge.svg)
---
<!-- Plugin description -->
IDE-VulScanner is an IDE agnostic tool for developers to identify vulnerable code dependencies during implementation phase, which in-tern would save huge security patching and maintenance costs. This usually is caught during CI/CD build phase.

### Features

* Vulnerability code scan during implementation phase
* Save security patch & maintenance costs
* Low overall high & critical vulnerabilities counts
* IDE agonistic, compatible to known IDE i.e. IntelliJ, eclipse, VS Code etc

### Getting started

* Launch VSCode and open extension settings
* Search for OWASP IDE-VulScanner and click install
* Open a Maven project in your IDEA
* Wait for the project to load fine, and click on the pom.xml file to enable OWASP IDE-VulScanner on your navbar
![image](https://github.com/OWASP/www-project-ide-vulscanner/raw/main/vscode-ext/idevulscanner-vscode/owasp-idevulscanner/Usage.PNG)
* Click on OWASP IDE-VulScanner icon and wait for the html report to get loaded in your editor 
---
**NOTE**

First time users it takes time to download relevant NVE dependency and might take time.

---
* You can obtain additional logs by navigating to Help > Toggle Developer Tools, and opening the Console tab for more verbose output.