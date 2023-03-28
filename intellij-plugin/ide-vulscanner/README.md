# IDE-VulScanner
![Build](https://github.com/mwalter/MavenDependencyChecker/workflows/Build/badge.svg)
---
<!-- Plugin description -->
IDE-VulScanner is an open source IDE plugin tool to analyze an application’s components. It is built on top of [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/), which scans your application's component vulnerabilities during implementation phase.

### Features

* Vulnerability code scan during implementation phase
* Save security patch & maintenance costs
* Low overall high & critical vulnerabilities counts
* IDE agonistic, compatible to known IDE i.e. IntelliJ, eclipse, VS Code etc

<!-- Plugin description end -->
### Installation

- Using IDE built-in plugin system:

  <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>Marketplace</kbd> > <kbd>Search for "OWASP IDE-VulScanner"</kbd> >
  <kbd>Install Plugin</kbd>

- Manually:

  Download the [latest release](https://plugins.jetbrains.com/files/21353/312461/OWASP_IDE-VulScanner-1.0.1.zip) and install it manually using
  <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>⚙️</kbd> > <kbd>Install plugin from disk...</kbd>


---
Plugin based on the [IntelliJ Platform Plugin Template][template].

[template]: https://github.com/JetBrains/intellij-platform-plugin-template