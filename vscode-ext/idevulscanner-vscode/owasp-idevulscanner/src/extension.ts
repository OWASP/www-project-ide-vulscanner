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
