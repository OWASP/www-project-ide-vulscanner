import * as vscode from 'vscode';
import { Spectral } from '@stoplight/spectral-core';

export function activate(context: vscode.ExtensionContext) {
    const spectral = new Spectral();
    
    // Function to run Spectral Linting
    const runSpectralLint = async (doc: vscode.TextDocument) => {
        const results = await spectral.run(doc.getText());
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

    // Register the fix command
    context.subscriptions.push(vscode.commands.registerCommand('extension.addSecurityHeader', (doc: vscode.TextDocument, range: vscode.Range) => {
        const edit = new vscode.WorkspaceEdit();
        const headerText = `// Add Security Headers`;
        edit.insert(doc.uri, range.start, headerText);

        vscode.workspace.applyEdit(edit).then(() => {
            vscode.window.showInformationMessage('Security Header Added.');
        });
    }));
}

export function deactivate() {}
