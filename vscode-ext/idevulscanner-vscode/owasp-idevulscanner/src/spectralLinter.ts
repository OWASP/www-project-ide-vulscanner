<<<<<<< HEAD
import { Spectral } from "@stoplight/spectral";
import { readFileSync } from "fs";
import { URI } from "vscode-uri";
import * as vscode from "vscode";
import { parse } from "@stoplight/yaml";

export async function runSpectralLint(document: vscode.TextDocument) {
  const spectral = new Spectral();
  try {
    // Load Spectral rules
    const spectralConfig = readFileSync(vscode.workspace.rootPath + "/spectral.yaml", "utf8");
    spectral.setRuleset(parse(spectralConfig));

    // Run Spectral Linting
    const results = await spectral.run(document.getText(), {
      resolve: { documentUri: URI.file(document.uri.fsPath).toString() },
    });

    // Convert Spectral results to VS Code Diagnostics
    const diagnostics: vscode.Diagnostic[] = results.map((result) => {
      const range = new vscode.Range(
        result.range.start.line,
        result.range.start.character,
        result.range.end.line,
        result.range.end.character
      );

      return new vscode.Diagnostic(range, result.message, vscode.DiagnosticSeverity.Warning);
    });

    // Update Problems Panel
    const diagnosticCollection = vscode.languages.createDiagnosticCollection("spectral");
    diagnosticCollection.set(document.uri, diagnostics);

    vscode.window.showInformationMessage(`Spectral Linting found ${results.length} issues.`);
  } catch (error) {
    vscode.window.showErrorMessage("Spectral linting error: " + error.message);
=======
import { Spectral } from "@stoplight/spectral-core";
import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler";
import * as fs from "fs";

export class SpectralLinter {
  private spectral: Spectral;

  constructor() {
    this.spectral = new Spectral();
  }

  async loadRuleset(rulesetPath: string) {
    if (!fs.existsSync(rulesetPath)) {
      throw new Error("Ruleset file not found.");
    }

    const ruleset = await bundleAndLoadRuleset(rulesetPath, { fs });
    await this.spectral.setRuleset(ruleset);
  }

  async lint(documentText: string) {
    return await this.spectral.run(documentText);
>>>>>>> spectral-linting-integration
  }
}
