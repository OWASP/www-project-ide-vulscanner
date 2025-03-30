import * as vscode from "vscode";

export function processLintResults(stdout: string) {
  const diagnostics: vscode.Diagnostic[] = [];
  const diagnosticCollection = vscode.languages.createDiagnosticCollection("owasp-vulscanner");

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const lines = stdout.split("\n");
  lines.forEach((line) => {
    const match = line.match(/(.+):(\d+):(\d+) - (.+)/);
    if (match) {
      const [, file, lineStr, colStr, message] = match;
      const lineNum = parseInt(lineStr, 10) - 1;
      const colNum = parseInt(colStr, 10) - 1;
      const range = new vscode.Range(lineNum, colNum, lineNum, colNum + 1);
      const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
      diagnostics.push(diagnostic);
    }
  });

  diagnosticCollection.set(editor.document.uri, diagnostics);
}
