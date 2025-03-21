import { Spectral } from '@stoplight/spectral-core';
import { SpectralDocument } from '@stoplight/spectral-runtime';
import * as vscode from 'vscode';

// Function to run Spectral linting on the given document
export const runSpectralLint = async (doc: vscode.TextDocument): Promise<vscode.Diagnostic[]> => {
    const spectral = new Spectral();
    const results = await spectral.run(doc.getText());

    const diagnostics: vscode.Diagnostic[] = [];

    results.forEach((result) => {
        const problem = new vscode.Diagnostic(
            new vscode.Range(
                new vscode.Position(result.range.start.line, result.range.start.character),
                new vscode.Position(result.range.end.line, result.range.end.character)
            ),
            result.message,
            vscode.DiagnosticSeverity.Warning
        );
        diagnostics.push(problem);
    });

    return diagnostics;
};
