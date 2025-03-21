import * as vscode from 'vscode';
import * as spectral from '@stoplight/spectral-core';
import { Spectral } from '@stoplight/spectral-core';
import { SpectralDocument } from '@stoplight/spectral-runtime';

async function runSpectralLinting(document: vscode.TextDocument, spectralInstance: Spectral) {
  // Ensure we are only linting JSON files (can modify the condition for other formats)
  if (document.languageId !== 'json') {
    return; // Limit linting to JSON files or modify as needed
  }

  const doc = new SpectralDocument(document.getText());
  await spectralInstance.run(doc);

  // Display linting issues in the Problems panel
  const diagnostics: vscode.Diagnostic[] = [];

  doc.errors.forEach((error) => {
    const range = new vscode.Range(
      new vscode.Position(error.range.start.line, error.range.start.character),
      new vscode.Position(error.range.end.line, error.range.end.character)
    );

    const diagnostic = new vscode.Diagnostic(
      range,
      error.message,
      vscode.DiagnosticSeverity.Warning
    );
    diagnostics.push(diagnostic);
  });

  // Set diagnostics to update the Problems panel in VS Code
  vscode.languages.getDiagnostics(document.uri); // Optional: Retrieve existing diagnostics
  vscode.languages.setDiagnostics(document.uri, diagnostics); // Set new diagnostics
}

export function activate(context: vscode.ExtensionContext) {
  const spectralInstance = new Spectral();

  // Register event listeners for file open and save
  vscode.workspace.onDidOpenTextDocument((document) => {
    runSpectralLinting(document, spectralInstance);
  });

  vscode.workspace.onDidSaveTextDocument((document) => {
    runSpectralLinting(document, spectralInstance);
  });

  // Optional: Adding a manual command to trigger linting from Command Palette
  let disposable = vscode.commands.registerCommand('extension.runSpectralLinting', (document: vscode.TextDocument) => {
    runSpectralLinting(document, spectralInstance);
  });

  context.subscriptions.push(disposable); // Ensure the command is properly disposed of when the extension is deactivated
}

export function deactivate() {
  // Clean up if necessary when the extension is deactivated
}
