// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as open from 'open';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let NEXT_TERM_ID = 1;
	console.log('OWASP IDE-Vulscanner is now active!');

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

		// Execute OWASP Dependency Check with Maven
		const mavenProcess = cp.spawn('mvn', ['-DnvdApiKey= -U org.owasp:dependency-check-maven:check'], {
			cwd: workspaceFolder,
			shell: true
		});

		mavenProcess.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
			processVulnerabilityReport(data.toString());
		});

		mavenProcess.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});

		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Running OWASP IDE-Vulscanner",
			cancellable: false
		}, async (progress) => {
			mavenProcess.on('close', (code) => {
				console.log(`Process exited with code ${code}`);
				if (code === 0) {
					const reportPath = path.join(workspaceFolder, 'target', 'dependency-check-report.html');
					if (fs.existsSync(reportPath)) {
						const htmlContent = fs.readFileSync(reportPath, 'utf8');
						const panel = vscode.window.createWebviewPanel(
							'htmlViewer',
							'Vulnerability Report',
							vscode.ViewColumn.One,
							{}
						);
						panel.webview.html = htmlContent;
					} else {
						vscode.window.showErrorMessage('No report generated. Check logs.');
					}
				} else {
					vscode.window.showErrorMessage(`Maven command failed with code ${code}`);
				}
			});
			progress.report({ increment: 100 });
		});
	});

	context.subscriptions.push(disposable);
}

function processVulnerabilityReport(reportData: string) {
	const vulnerabilities = extractVulnerabilities(reportData);
	if (vulnerabilities.length > 0) {
		let message = 'Vulnerabilities Found:\n';
		vulnerabilities.forEach((vuln) => {
			message += `\n[${vuln.severity}] ${vuln.name}\nCWE: ${vuln.cwe}\nCVE: ${vuln.cve}\nFix: ${vuln.fix}\n`;
		});
		vscode.window.showWarningMessage(message);
	} else {
		vscode.window.showInformationMessage('No vulnerabilities detected!');
	}
}

function extractVulnerabilities(reportData: string) {
	const vulnerabilities = [];
	const regex = /CVE-(\d{4}-\d{4,})|CWE-(\d{1,4})/g;
	let match;
	while ((match = regex.exec(reportData)) !== null) {
		const severity = determineSeverity(match[1] || match[2]);
		const fix = suggestFix(match[1] || match[2]);
		vulnerabilities.push({
			name: match[0],
			cve: match[1] || 'N/A',
			cwe: match[2] || 'N/A',
			severity,
			fix,
		});
	}
	return vulnerabilities;

	
}

function determineSeverity(id: string) {
	if (id.includes('CVE')) return 'Critical';
	if (id.includes('CWE')) return 'High';
	return 'Medium';
}

function suggestFix(id: string) {
	if (id.includes('CVE')) return 'Upgrade dependency or apply patch.';
	if (id.includes('CWE')) return 'Follow secure coding guidelines.';
	return 'Investigate further.';
}

export function deactivate() {}
