import * as vscode from 'vscode';
import { Spectral } from '@stoplight/spectral-core';
import { fs } from '@stoplight/spectral-utils';
import * as path from 'path';

let spectral: Spectral;

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeSecure extension is now active!');

    spectral = new Spectral();

    // Load custom rules (spectral.yaml)
    const spectralConfigPath = path.join(context.extensionPath, 'spectral.yaml');
    spectral.setRuleset(spectralConfigPath);

    // Register the linting command when a file is opened
    vscode.workspace.onDidOpenTextDocument((document) => {
        runSpectralLinting(document);
    });

    // Register the linting command when a file is saved
    vscode.workspace.onDidSaveTextDocument((document) => {
        runSpectralLinting(document);
    });

    // Command to run Spectral manually from Command Palette
    let disposable = vscode.commands.registerCommand('codesecure.runSpectral', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            runSpectralLinting(editor.document);
        }
    });

    context.subscriptions.push(disposable);
}

// Spectral Linting Logic
async function runSpectralLinting(document: vscode.TextDocument) {
    const filePath = document.uri.fsPath;

    if (path.extname(filePath) !== '.yaml' && path.extname(filePath) !== '.json') {
        vscode.window.showWarningMessage('Spectral only supports YAML/JSON files for linting.');
        return;
    }

    const results = await lintFile(filePath);

    // Display Linting Results in Problems Panel
    showProblems(results);
}

// Lint the file with Spectral
async function lintFile(filePath: string) {
    try {
        const document = await fs.readFile(filePath, 'utf8');
        const results = await spectral.run(document, { filePath });

        return results;
    } catch (error) {
        console.error('Error running Spectral:', error);
        return [];
    }
}

// Show linting results in VSCode Problems Panel
function showProblems(results: any) {
    const diagnostics: vscode.Diagnostic[] = results.map((result: any) => {
        const range = new vscode.Range(
            new vscode.Position(result.range.start.line, result.range.start.column),
            new vscode.Position(result.range.end.line, result.range.end.column)
        );

        return new vscode.Diagnostic(
            range,
            result.message,
            vscode.DiagnosticSeverity.Warning
        );
    });

    vscode.languages.createDiagnosticCollection('spectral').set(
        vscode.window.activeTextEditor?.document.uri,
        diagnostics
    );
}

export function deactivate() {}
