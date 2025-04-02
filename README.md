Overview
OWASP IDE-Vulscanner is a Visual Studio Code extension that helps developers detect and fix security vulnerabilities in their code. It integrates Spectral Linting, AI-powered fix suggestions, custom OWASP security rules, and logging/debugging features.

This extension is designed to:
✅ Scan files automatically for vulnerabilities on open/save.
✅ Provide real-time fix suggestions using AI and VS Code’s Code Actions API.
✅ Allow manual security scans via the Command Palette.
✅ Log security warnings & errors for debugging.

 Features
1️⃣ Spectral Linting (Automated Security Scans)

Uses Spectral to scan your files for security vulnerabilities.

Runs automatically when you open or save a file.

Detects common security flaws like XSS, SQL Injection, and hardcoded API keys.

Supports custom security rules (you can define your own in ruleset.yaml).          

2️⃣  Custom Security Rules (OWASP Guidelines)

Pre-configured security rules based on OWASP Best Practices.

Detects:

Hardcoded API keys (prevents secret leaks).

SQL Injection patterns (checks for risky SQL queries).

Insecure API endpoints (flags sensitive API exposure).

Rules are stored in ruleset.yaml and can be customized.

3️⃣ AI-Powered Fix Suggestions

Uses OpenAI API to analyze and suggest fixes for security issues.

Provides code refactoring suggestions to enhance security.

Can be triggered manually from the Command Palette.

4️⃣ Command Palette Integration

Run a manual security scan anytime using:

Shortcut: Ctrl + Shift + P → Select "Run Security Scan".

Command: owasp.scan.

Get AI Fix Suggestions using:

Shortcut: Ctrl + Shift + P → Select "AI Fix Suggestions".

Command: owasp.fixAI.

5️⃣ Logging & Debugging

Logs all security issues & errors in the VS Code Output Panel.

Stores logs in a local file (logs.txt) for debugging.

How to Use
✅ Auto Security Scan
The extension automatically runs security scans when you open or save a file.

Any detected vulnerabilities are displayed in the VS Code Problems Panel.

🛠️ Manually Run a Security Scan
Open the Command Palette (Ctrl + Shift + P).

Type "Run Security Scan" and select it.

The scan results appear in the Output Panel & Problems Panel.

🤖 Get AI Fix Suggestions
Open the Command Palette (Ctrl + Shift + P).

Type "AI Fix Suggestions" and select it.

The AI will analyze your code and suggest security improvements.

📝Customizing Security Rules

You can add or modify security rules in the ruleset.yaml file.

Example: Block Hardcoded API Keys
rules:
  no-hardcoded-api-keys:
    description: "Detects hardcoded API keys"
    severity: error
    given: "$.paths[*].security[*]"
    then:
      function: pattern
      functionOptions:
        match: "sk-[a-zA-Z0-9]+"  # Matches API keys

Example: SQL Injection Protection
rules:
  sql-injection-check:
    description: "Detects possible SQL injection vulnerabilities"
    severity: error
    given: "$.paths[*].parameters[*].name"
    then:
      function: pattern
      functionOptions:
        match: ".*(SELECT|DROP|DELETE|INSERT).*"

📌 Running Tests
🔹 Run Spectral Linting
npx spectral lint test.yml

🔹 Run VS Code Extension Tests
npm test

Checks:

If the extension is activated.

If commands (owasp.scan, owasp.fixAI) are registered.

🔹 Test AI Fix Suggestions (Command Line)

curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Authorization: Bearer your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Detect security vulnerabilities in this code: console.log('Hello World');"}],
    "temperature": 0.7
  }'

🛠️ Troubleshooting
Issue	                        Solution

Spectral linting doesn’t run	Ensure you have Node.js and Spectral installed (npm install)
AI Fix doesn’t work	            Check if your OpenAI API key is correct in aiFix.ts
No security warnings appear	    Ensure you are scanning supported file types (YAML, JSON, JS, etc.)
Logs are missing	            Open ~/.vscode/extensions/owasp-ide-vulscanner/logs.txt to check errors