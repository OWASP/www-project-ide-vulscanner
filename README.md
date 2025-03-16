# OWASP IDE-VulScanner

![IDE-VulScanner](./assets/images/pluginIcon.png)

OWASP IDE-VulScanner is an open-source IDE plugin designed to analyze an application's dependencies and identify security vulnerabilities. It is built on top of [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/) to provide developers with real-time security insights.

---

## 🚀 Features

- **🔍 Enhanced Execution Flow** – Optimized the scanning process for improved efficiency and speed.
- **📦 Improved Dependency Scanning** – More accurate detection of security risks in dependencies.
- **🛠️ Environment Variable Handling** – Enhanced configuration flexibility for different IDE setups.
- **✅ Comprehensive Test Suite** – Unit and integration tests added to ensure stability and reliability.
- **📄 Improved Documentation** – Clearer installation, usage, and contribution guidelines.

---

## 🛠️ Installation

### **Using IDE Plugin System**
1. Open **Settings/Preferences** → **Plugins** → **Marketplace**.
2. Search for **"OWASP IDE-VulScanner"**.
3. Click **Install** and restart your IDE.

### **Manual Installation**
1. Download the [latest release](https://plugins.jetbrains.com/plugin/21353-owasp-ide-vulscanner/versions).
2. Open **Settings/Preferences** → **Plugins**.
3. Click **⚙️ (Gear Icon)** → **Install Plugin from Disk**.
4. Select the downloaded `.jar` file and install.

---

## 📝 Usage

1. **Open any project in your IDE**.
2. **Right-click the project folder** → Select **"Scan with OWASP IDE-VulScanner"**.
3. View **vulnerability report** in the **OWASP Security Panel**.
4. Get **fix recommendations** to resolve detected security issues.

---

## 🧪 Running Tests

To ensure the stability of the plugin, we have added **unit and integration tests**. You can run them using:

```sh
npm install  # Install dependencies
npm run test # Run all tests
```

---

## 💡 Contribute

We welcome contributions! If you have experience with **IDE plugins** for any of the following, feel free to contribute:

- **Eclipse**
- **VS Code**
- **IntelliJ IDEA**

### **Steps to Contribute**
1. Fork the repository.
2. Clone your fork and create a new feature branch.
3. Make improvements and test them locally.
4. Submit a pull request with a clear description of the changes.

For discussions or queries, reach out to **jitu.ranjan@owasp.org**.

---

## 📜 License
This project is licensed under the **Apache License 2.0**. See the `LICENSE` file for details.

---

## 📌 Acknowledgments
We appreciate all contributors who help improve OWASP IDE-VulScanner. 🙌

---

**Maintained by:** The OWASP Community 🚀
