Overview
IDE-VulScanner is a powerful, IDE-agnostic tool designed to help developers identify vulnerable code dependencies early in the development process. By detecting vulnerabilities during implementation, it reduces security patching and maintenance costs later in the project lifecycle. Unlike traditional tools that catch vulnerabilities during the CI/CD build phase, IDE-VulScanner allows you to address issues as you write code, saving time and improving security from the outset.

Key Features
Vulnerability Scanning: Identifies vulnerable code dependencies during the implementation phase to prevent future security issues.

Cost Savings: Helps reduce the costs associated with security patching and maintenance.

Low Vulnerability Count: Focuses on minimizing high and critical vulnerabilities in your code.

IDE-Agnostic: Compatible with popular IDEs such as IntelliJ, Eclipse, and VS Code.

Installation & Setup
Launch VSCode and open the extension settings.

Search for OWASP IDE-VulScanner and click Install.

Open a Maven project in your IDE.

After the project loads, click on the pom.xml file to activate OWASP IDE-VulScanner in your navbar.

Click the OWASP IDE-VulScanner icon to load an HTML report detailing your project’s security status.

Important Notes
First-Time Setup: On initial use, the tool may take some time to download the relevant NVE (National Vulnerability Database) dependencies. Please be patient.

Viewing Logs: You can access additional logs by navigating to Help > Toggle Developer Tools and opening the Console tab for more detailed output.

Recent Updates
Here is a summary of the latest enhancements and features introduced in IDE-VulScanner:

✅ PR 1: Spectral Linting Setup
Integrated Spectral Linter to automatically detect security vulnerabilities.

Configured it to run on file open/save to ensure continuous security monitoring throughout development.

✅ PR 2: Custom Security Rules (OWASP)
Added essential security rules for XSS, SQL Injection, API key leaks, and insecure APIs in the spectral.yaml configuration file.

Users can now define their own custom linting rules for even greater flexibility in addressing specific security concerns.

✅ PR 3: Real-Time Fix Suggestions
Leveraged VS Code’s Code Actions API to provide real-time security fix suggestions.

Introduced an auto-fix feature for minor issues, such as missing security headers, to streamline the development process.

✅ PR 4: Command Palette Integration
Introduced a new "Run Security Scan" command within the VS Code Command Palette for easy access to security scans.

Scan results are now displayed in both the Output Panel and Problems Panel for seamless debugging.

✅ PR 5: AI-Powered Fix Suggestions
Integrated the OpenAI API to offer AI-powered remediation strategies.

This feature includes an AI-based code refactoring tool that can help developers automatically fix vulnerabilities.

✅ PR 6: Logging, Debugging & Error Reporting
Added enhanced logging and error reporting capabilities for improved troubleshooting.

Critical issues are flagged using showErrorMessage(), and all logs are stored in the VS Code Output Panel for easy access.

✅ PR 7: Documentation Update
Thoroughly updated the README.md to reflect all the new features added in the previous PRs.

Detailed explanations on how to use Spectral linting, security rules, AI-powered fixes, and debugging tools, ensuring users can quickly take advantage of all the extension’s capabilities.

