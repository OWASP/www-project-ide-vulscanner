import * as vscode from "vscode";
import { runSpectralLint } from "./spectral-lint";

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidOpenTextDocument(runSpectralLint);
  vscode.workspace.onDidSaveTextDocument(runSpectralLint);

  context.subscriptions.push(
    vscode.commands.registerCommand("owasp-vulscanner.runSpectralLint", async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        await runSpectralLint(editor.document);
        vscode.window.showInformationMessage("Spectral Linting Completed!");
      }
    })
  );
}

export function deactivate() {}
