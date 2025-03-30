import * as vscode from "vscode";
import { getOutputChannel } from "./outputChannel";
import { processLintResults } from "./problemMatcher";
import { exec } from "child_process";

export function runSecurityScan() {
  const outputChannel = getOutputChannel();
  outputChannel.appendLine("Starting security scan...");

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active file open. Please open a file to scan.");
    return;
  }

  const filePath = editor.document.fileName;

  exec(`spectral lint ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      outputChannel.appendLine(`Error: ${stderr}`);
      vscode.window.showErrorMessage("Security scan failed. Check output for details.");
      return;
    }

    outputChannel.appendLine(stdout);
    processLintResults(stdout);
    vscode.window.showInformationMessage("Security scan completed.");
  });
}
