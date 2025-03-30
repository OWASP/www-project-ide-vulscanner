import * as vscode from "vscode";
<<<<<<< HEAD
import { runSpectralLint } from "./spectral-lint";
import { SpectralFixProvider } from "./fix-provider";

export function activate(context: vscode.ExtensionContext) {
  // Run Spectral Linting on file open/save
  vscode.workspace.onDidOpenTextDocument(runSpectralLint);
  vscode.workspace.onDidSaveTextDocument(runSpectralLint);

  // Command Palette: Run Spectral Linting Manually
  const spectralLintCommand = vscode.commands.registerCommand("owasp-vulscanner.runSpectralLint", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("Open a file to run Spectral Linting.");
      return;
    }

    await runSpectralLint(editor.document);
    vscode.window.showInformationMessage("Spectral Linting Completed!");
  });

  context.subscriptions.push(spectralLintCommand);

  // Register Fix Provider for Quick Fixes
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: "file", language: "yaml" },
      new SpectralFixProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    )
  );
=======
import { registerSpectralLinting } from "./spectralScan";
import { provideAiFixes } from "./aiFixProvider";

export function activate(context: vscode.ExtensionContext) {
    console.log("OWASP IDE-Vulscanner activated!");

    // Register Spectral linting
    registerSpectralLinting(context);

    // Register AI-Powered Fix Suggestions
    let aiFixCommand = vscode.commands.registerCommand("vulscanner.aiFix", async () => {
        await provideAiFixes();
    });

    context.subscriptions.push(aiFixCommand);
}

export function deactivate() {
    console.log("OWASP IDE-Vulscanner deactivated!");
>>>>>>> spectral-linting-integration
}

export function deactivate() {}
