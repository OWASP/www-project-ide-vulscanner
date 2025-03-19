import * as assert from "assert";
import * as vscode from "vscode";
import * as myExtension from "../../extension";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Starting all tests.");

  test("Extension should be present", () => {
    const extension = vscode.extensions.getExtension("your-extension-id");
    assert.ok(extension, "Extension is not installed.");
  });

  test("Check if vulnerability scan function exists", () => {
    assert.strictEqual(
      typeof myExtension.scanForVulnerabilities,
      "function",
      "scanForVulnerabilities function is missing."
    );
  });

  test("Verify vulnerability report includes severity", async () => {
    const results = await myExtension.scanForVulnerabilities("sampleCode");

    assert.ok(Array.isArray(results), "Results should be an array.");
    assert.ok(results.length > 0, "No vulnerabilities detected.");

    results.forEach((vuln) => {
      assert.ok(vuln.severity, "Severity level is missing.");
      assert.ok(
        ["Critical", "High", "Medium", "Low"].includes(vuln.severity),
        `Invalid severity level: ${vuln.severity}`
      );
      assert.ok(vuln.fixSuggestion, "Fix suggestion is missing.");
      assert.ok(vuln.owaspLink, "OWASP reference is missing.");
    });
  });
});
