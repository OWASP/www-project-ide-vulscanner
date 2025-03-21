import * as vscode from 'vscode';
import * as open from 'open';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';
import { Spectral } from '@stoplight/spectral-core';
import { SpectralDocument } from '@stoplight/spectral-runtime';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    let NEXT_TERM_ID = 1;
    console.log('Congratulations, your extension "owasp-idevulscanner" is now active!');

    // Spectral Linter Setup
    const spectral = new Spectral();

    // Function to run Spectral Linting
    const runSpectralLint = async (doc: vscode.TextDocument) => {
        const spectralDoc = new SpectralDocument(doc.getText(), { raw: true });
        const results = await spectral.run(spectralDoc);
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('spectral');
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

        // Display results in the Problems Panel
        diagnosticCollection.set(doc.uri, diagnostics);
    };

    // Register event listeners for file save and open
    vscode.workspace.onDidSaveTextDocument(runSpectralLint);
    vscode.workspace.onDidOpenTextDocument(runSpectralLint);

    // Existing command logic (Maven process)
    let disposable = vscode.commands.registerCommand('owasp-idevulscanner.runner', () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const workspaceFolder = workspaceFolders[0].uri.fsPath;

        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace opened.');
            return;
        }

        // Execute Maven command (e.g., 'mvn clean install')
        const mavenProcess = cp.spawn('mvn', ['-DnvdApiKey=YOUR_API_KEY -U org.owasp:dependency-check-maven:check'], {
            cwd: workspaceFolder,
            shell: true
        });

        mavenProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        mavenProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Running OWASP IDE-Vulscanner",
            cancellable: false
        }, async (progress, token) => {
            mavenProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);

                if (code === 0) {
                    // Maven command executed successfully, load the HTML file
                    const reportPath = path.join(workspaceFolder, 'target', 'dependency-check-report.html');
                    const htmlContent = fs.readFileSync(reportPath, 'utf8');
                    const panel = vscode.window.createWebviewPanel(
                        'htmlViewer',
                        'dependency-check-report',
                        vscode.ViewColumn.One,
                        {}
                    );
                    panel.webview.html = htmlContent;
                } else {
                    vscode.window.showErrorMessage(`Maven command failed with code ${code}`);
                }
            });
            progress.report({ increment: 1000 });
        });
    });

    // Register a command for Spectral linting to allow manual linting
    let spectralLintDisposable = vscode.commands.registerCommand('owasp-idevulscanner.spectralLint', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }
        await runSpectralLint(editor.document);
    });

    context.subscriptions.push(disposable, spectralLintDisposable);
}

// Function to select terminal
function selectTerminal(): Thenable<vscode.Terminal | undefined> {
    interface TerminalQuickPickItem extends vscode.QuickPickItem {
        terminal: vscode.Terminal;
    }
    const terminals = vscode.window.terminals;
    const quickPickItems: TerminalQuickPickItem[] = terminals.map((terminal) => ({
        label: terminal.name,
        terminal
    }));
    return vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select terminal to run command'
    }).then((item) => item?.terminal);
}
