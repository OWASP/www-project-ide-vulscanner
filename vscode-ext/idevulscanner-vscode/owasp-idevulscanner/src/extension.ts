<<<<<<< HEAD
import * as vscode from 'vscode';
import { runSpectralLint } from './spectralLint';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.workspace.onDidSaveTextDocument(document => {
        runSpectralLint(document);
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}
=======
import * as vscode from "vscode";
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
}
>>>>>>> spectral-linting-integration
