import * as assert from 'assert';
import * as vscode from 'vscode';
import * as cp from 'child_process';

// A test suite to check the extension functionality
suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	// Test to check if the extension registers the command correctly
	test('Extension command registration', async () => {
		// Simulate executing the command
		const result = await vscode.commands.executeCommand('owasp-idevulscanner.runner');
		assert.ok(result, 'The "owasp-idevulscanner.runner" command should execute without errors.');
	});

	// Test to ensure the terminal starts correctly when running the OWASP scanner
	test('OWASP IDE-Vulscanner Terminal Execution', (done) => {
		const mavenProcess = cp.spawn('mvn', ['-DnvdApiKey= -U org.owasp:dependency-check-maven:check']);

		// Ensure the process executes correctly
		mavenProcess.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		mavenProcess.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});

		mavenProcess.on('close', (code) => {
			assert.strictEqual(code, 0, `Maven process should exit with code 0, but it exited with code ${code}`);
			done();
		});
	});

	// Test if the HTML report is generated correctly after the Maven command runs
	test('OWASP IDE-Vulscanner Report Generation', async () => {
		const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
		const reportPath = workspaceFolder ? `${workspaceFolder}/target/dependency-check-report.html` : '';

		// Check if the report file exists
		const fileExists = await vscode.workspace.fs.stat(vscode.Uri.file(reportPath)).then(() => true).catch(() => false);
		assert.ok(fileExists, 'The OWASP Dependency-Check report file should be generated and exist.');
	});
});
