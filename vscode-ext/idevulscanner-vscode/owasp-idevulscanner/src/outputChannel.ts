import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel | null = null;

export function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("OWASP VulScanner");
  }
  outputChannel.show(true);
  return outputChannel;
}
