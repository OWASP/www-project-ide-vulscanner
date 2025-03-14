import * as vscode from 'vscode';
import * as open from 'open';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    let NEXT_TERM_ID = 1;

    // Use the console to output diagnostic information
    console.log('Congratulations, your extension "owasp-idevulscanner" is now active!');

    let disposable = vscode.commands.registerCommand('owasp-idevulscanner.runner', async () => {
        // Ensure a workspace folder is open
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

        // Display progress bar while running the OWASP scan
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Running OWASP IDE-Vulscanner",
            cancellable: true
        }, async (progress, token) => {

            // Set up the maven process
            const mavenProcess = cp.spawn('mvn', ['-DnvdApiKey= -U org.owasp:dependency-check-maven:check'], {
                cwd: workspaceFolder,
                shell: true
            });

            let dataOutput = '';
            let errorOutput = '';

            mavenProcess.stdout.on('data', (data) => {
                dataOutput += data;
            });

            mavenProcess.stderr.on('data', (data) => {
                errorOutput += data;
            });

            mavenProcess.on('close', (code) => {
                // If the command finishes successfully
                if (code === 0) {
                    console.log('Maven command executed successfully.');
                    vscode.window.showInformationMessage('OWASP IDE-Vulscanner completed successfully!');

                    // Path to the generated report
                    const reportPath = path.join(workspaceFolder, 'target', 'dependency-check-report.html');
                    if (fs.existsSync(reportPath)) {
                        const htmlContent = fs.readFileSync(reportPath, 'utf8');
                        const panel = vscode.window.createWebviewPanel(
                            'htmlViewer',
                            'dependency-check-report',
                            vscode.ViewColumn.One,
                            {}
                        );
                        panel.webview.html = htmlContent;
                    } else {
                        vscode.window.showErrorMessage('The report file does not exist.');
                    }
                } else {
                    vscode.window.showErrorMessage(`Maven command failed with code ${code}`);
                    console.error('Maven command failed:', errorOutput);
                }
            });

            // If the user cancels the progress bar, kill the process
            token.onCancellationRequested(() => {
                console.log('Progress cancelled by user.');
                mavenProcess.kill();
            });

            // Report progress
            let progressInterval = setInterval(() => {
                progress.report({ increment: 10 });
            }, 500);

            // Wait for the process to end
            await new Promise(resolve => mavenProcess.on('close', resolve));

            clearInterval(progressInterval); // Clear progress interval after completion
        });
    });

    // Add the command to the extension's disposables
    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
