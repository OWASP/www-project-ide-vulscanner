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

<!-- Plugin description end -->
### Installation

- Using IDE built-in plugin system:

  <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>Marketplace</kbd> > <kbd>Search for "OWASP IDE-VulScanner"</kbd> >
  <kbd>Install Plugin</kbd>

- Manually:

  Download the [latest release](https://plugins.jetbrains.com/plugin/21353-owasp-ide-vulscanner/versions) and install it manually using
  <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>⚙️</kbd> > <kbd>Install plugin from disk...</kbd>


---
Plugin based on the [IntelliJ Platform Plugin Template][template].

[template]: https://github.com/JetBrains/intellij-platform-plugin-template