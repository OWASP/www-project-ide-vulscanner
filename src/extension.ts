import * as vscode from "vscode";
import { runSpectralLinting } from "./commands";
import { provideAIRecommendations } from "./aiFix";
import { Logger } from "./logger";

export function activate(context: vscode.ExtensionContext) {
    Logger.info("OWASP IDE-Vulscanner activated!");

    // Run Spectral Linting on Save & Open
    vscode.workspace.onDidOpenTextDocument(runSpectralLinting);
    vscode.workspace.onDidSaveTextDocument(runSpectralLinting);

    // Register Command Palette command for manual scan
    let disposableScan = vscode.commands.registerCommand("owasp.scan", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage("Open a file to scan for vulnerabilities.");
            return;
        }
        runSpectralLinting(editor.document);
    });

    // Register AI Fix Command
    let disposableAI = vscode.commands.registerCommand("owasp.fixAI", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage("Open a file to analyze security vulnerabilities.");
            return;
        }
        provideAIRecommendations(editor.document);
    });

    context.subscriptions.push(disposableScan, disposableAI);
}

export function deactivate() {
    Logger.info("OWASP IDE-Vulscanner deactivated!");
}
