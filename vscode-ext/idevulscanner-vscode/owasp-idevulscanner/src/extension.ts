import * as vscode from 'vscode';
import { runSpectralLint } from './spectralLint';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.workspace.onDidSaveTextDocument(document => {
        runSpectralLint(document);
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}
