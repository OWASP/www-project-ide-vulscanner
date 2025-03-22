import * as vscode from "vscode";
import { SpectralFixProvider } from "./fix-provider";
import { runSpectralLinting } from "./spectral-lint";

export function activate(context: vscode.ExtensionContext) {
    const spectralDiagnostics = vscode.languages.createDiagnosticCollection("spectral");

    vscode.workspace.onDidOpenTextDocument(async document => {
        if (document.languageId === "yaml" || document.languageId === "json") {
            const diagnostics = await runSpectralLinting(document.getText());
            spectralDiagnostics.set(document.uri, diagnostics);
        }
    });

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { scheme: "file", language: "yaml" },
            new SpectralFixProvider(),
            { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
        )
    );
}

export function deactivate() {}
