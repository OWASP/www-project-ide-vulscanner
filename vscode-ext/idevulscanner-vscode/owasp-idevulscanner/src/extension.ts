import * as vscode from "vscode";
import { Spectral } from "@stoplight/spectral-core";
import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler";
import * as fs from "fs";
import * as path from "path";
import { DiagnosticCollection } from "./diagnostics";

export function activate(context: vscode.ExtensionContext) {
  const spectral = new Spectral();
  const diagnostics = vscode.languages.createDiagnosticCollection("spectral");
  context.subscriptions.push(diagnostics);

  const lintCommand = vscode.commands.registerCommand(
    "extension.lintWithSpectral",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const document = editor.document;
      const text = document.getText();

      try {
        const rulesetPath = path.join(context.extensionPath, "spectral.yml");
        if (!fs.existsSync(rulesetPath)) {
          vscode.window.showErrorMessage("Spectral ruleset not found.");
          return;
        }

        const ruleset = await bundleAndLoadRuleset(rulesetPath, { fs });
        await spectral.setRuleset(ruleset);

        const results = await spectral.run(text);
        DiagnosticCollection.updateDiagnostics(document, results, diagnostics);
      } catch (error) {
        vscode.window.showErrorMessage(`Spectral error: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(lintCommand);
}

export function deactivate() {}
