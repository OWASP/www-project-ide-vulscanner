import * as vscode from 'vscode';

export class Logger {
  private static outputChannel = vscode.window.createOutputChannel('IDE-Vulscanner');

  static info(message: string) {
    this.outputChannel.appendLine(`INFO: ${message}`);
    console.log(`INFO: ${message}`);
  }

  static warn(message: string) {
    this.outputChannel.appendLine(`WARNING: ${message}`);
    console.warn(`WARNING: ${message}`);
  }

  static error(message: string, error?: unknown) {
    this.outputChannel.appendLine(`ERROR: ${message}`);
    console.error(`ERROR: ${message}`, error);
    vscode.window.showErrorMessage(`IDE-Vulscanner: ${message}`);
  }
}
