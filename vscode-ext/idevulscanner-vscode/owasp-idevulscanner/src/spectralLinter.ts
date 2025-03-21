import * as vscode from 'vscode';
import { Spectral } from '@stoplight/spectral-core';
import { SpectralDocument } from '@stoplight/spectral-runtime';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const spectral = new Spectral();

    // Function to run Spectral Linting
    const runSpectralLint = async (doc: vscode.TextDocument) => {
        const spectralDoc = new SpectralDocument(doc.getText(), { raw: true });
        const results = await spectral.run(spectralDoc);
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('spectral');
        const diagnostics: vscode.Diagnostic[] = [];

        results.forEach((result) => {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(
                    new vscode.Position(result.range.start.line, result.range.start.character),
                    new vscode.Position(result.range.end.line, result.range.end.character)
                ),
                result.message,
                vscode.DiagnosticSeverity.Warning
            );

            diagnostics.push(diagnostic);

            // Register Code Action for quick fix
            const fixAction = new vscode.CodeAction('Add Missing Security Header', vscode.CodeActionKind.QuickFix);
            fixAction.command = {
                title: 'Fix Security Header',
                command: 'extension.addSecurityHeader',
                arguments: [doc, result.range]
            };

            diagnostic.codeActions = [fixAction];
        });

        // Display results in the Problems Panel
        diagnosticCollection.set(doc.uri, diagnostics);
    };

    // Register event listeners for file save and open
    vscode.workspace.onDidSaveTextDocument(runSpectralLint);
    vscode.workspace.onDidOpenTextDocument(runSpectralLint);

    // Register the fix command for adding security header
    context.subscriptions.push(vscode.commands.registerCommand('extension.addSecurityHeader', (doc: vscode.TextDocument, range: vscode.Range) => {
        const edit = new vscode.WorkspaceEdit();
        const headerText = `// Add Security Headers\n`;
        edit.insert(doc.uri, range.start, headerText);

        vscode.workspace.applyEdit(edit).then(() => {
            vscode.window.showInformationMessage('Security Header Added.');
        });
    }));

    // Register the command for manual Spectral Linting via Command Palette
    context.subscriptions.push(vscode.commands.registerCommand('extension.runSpectralLint', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }
        await runSpectralLint(editor.document);
    }));
}

// This method is called when your extension is deactivated
export function deactivate() {}
