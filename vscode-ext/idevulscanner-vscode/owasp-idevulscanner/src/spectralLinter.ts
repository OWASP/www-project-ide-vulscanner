import { Spectral, Document, isOpenApiv2, isOpenApiv3 } from "@stoplight/spectral";
import { readFileSync } from "fs";
import { URI } from "vscode-uri";
import * as vscode from "vscode";
import { parse } from "@stoplight/yaml";

export async function runSpectralLint(document: vscode.TextDocument) {
  const spectral = new Spectral();
  try {
    // Load OWASP security rules from spectral.yaml
    const spectralConfig = readFileSync(vscode.workspace.rootPath + "/spectral.yaml", "utf8");
    spectral.setRuleset(parse(spectralConfig));

    // Run linting on the document content
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

      const diagnostic = new vscode.Diagnostic(
        range,
        result.message,
        vscode.DiagnosticSeverity.Warning
      );

      // Attach Fix Suggestion (if available)
      if (result.rule && result.rule["x-fix"]) {
        (diagnostic as any).fixSuggestion = result.rule["x-fix"];
      }

      return diagnostic;
    });

    // Update VS Code Problems Panel
    const diagnosticCollection = vscode.languages.createDiagnosticCollection("spectral");
    diagnosticCollection.set(document.uri, diagnostics);
  } catch (error) {
    vscode.window.showErrorMessage("Spectral linting error: " + error.message);
  }
}
