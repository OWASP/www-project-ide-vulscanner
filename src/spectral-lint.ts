import * as vscode from 'vscode';
import { exec } from 'child_process';

/**
 * Runs Spectral linting on the given file and returns diagnostics.
 */
export function runSpectralLint(
    document: vscode.TextDocument,
    spectralDiagnostics: vscode.DiagnosticCollection
) {
    const filePath = document.fileName;

    exec(`npx spectral lint ${filePath} -f json`, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error running Spectral: ${stderr}`);
            return;
        }

        try {
            const results = JSON.parse(stdout);
            spectralDiagnostics.clear();
            const diagnostics: vscode.Diagnostic[] = [];

            results.forEach((issue: any) => {
                if (!issue.range) return; // Ensure range exists

                const range = new vscode.Range(
                    new vscode.Position(issue.range.start.line - 1, issue.range.start.character),
                    new vscode.Position(issue.range.end.line - 1, issue.range.end.character)
                );

                const diagnostic = new vscode.Diagnostic(
                    range,
                    `[${issue.code}] ${issue.message}`,
                    vscode.DiagnosticSeverity.Warning
                );

                diagnostics.push(diagnostic);
            });

            spectralDiagnostics.set(document.uri, diagnostics);
            vscode.window.showInformationMessage(
                `Spectral Linting Completed. Found ${diagnostics.length} issue(s).`
            );
        } catch (parseError) {
            vscode.window.showErrorMessage(`Failed to parse Spectral output.`);
        }
    });
}
