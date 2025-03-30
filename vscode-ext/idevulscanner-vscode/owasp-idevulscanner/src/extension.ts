import * as vscode from 'vscode';
import { runSpectralLinting } from './linter';
import { Logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('ide-vulscanner.runSecurityScan', async () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        Logger.warn('No active editor found.');
        vscode.window.showWarningMessage('No file open to scan.');
        return;
      }

      Logger.info('Starting security scan...');
      await runSpectralLinting(editor.document);
      Logger.info('Security scan completed.');

    } catch (error) {
      Logger.error('An unexpected error occurred while running the scan.', error);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  Logger.info('IDE-Vulscanner extension deactivated.');
}
