"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    let NEXT_TERM_ID = 1;
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "owasp-idevulscanner" is now active!');
    //vscode.commands.executeCommand('mvn clean package');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('owasp-idevulscanner.runner', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
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
        const mavenProcess = cp.spawn('mvn', ['-DnvdApiKey=f2809d74-f55f-46fa-b36f-da67050d0a1c -U org.owasp:dependency-check-maven:check'], {
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
            //progress.report({ increment: 500 });
            mavenProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                if (code === 0) {
                    // Maven command executed successfully, load the HTML file
                    const reportPath = path.join(workspaceFolder, 'target', 'dependency-check-report.html');
                    const htmlContent = fs.readFileSync(reportPath, 'utf8');
                    const panel = vscode.window.createWebviewPanel('htmlViewer', 'dependency-check-report', vscode.ViewColumn.One, {});
                    panel.webview.html = htmlContent;
                }
                else {
                    vscode.window.showErrorMessage(`Maven command failed with code ${code}`);
                }
            });
            progress.report({ increment: 1000 });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function selectTerminal() {
    const terminals = vscode.window.terminals;
    const items = terminals.map(t => {
        return {
            label: `name: ${t.name}`,
            terminal: t
        };
    });
    return vscode.window.showQuickPick(items).then(item => {
        return item ? item.terminal : undefined;
    });
}
function ensureTerminalExists() {
    if (vscode.window.terminals.length === 0) {
        vscode.window.showErrorMessage('No active terminals');
        return false;
    }
    return true;
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map