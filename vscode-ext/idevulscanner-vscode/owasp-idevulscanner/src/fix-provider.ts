import * as vscode from "vscode";
import { runSpectralLinting } from "./spectral-lint";

export class SpectralFixProvider implements vscode.CodeActionProvider {
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
        return this.getFixes(document, range);
    }

    private async getFixes(document: vscode.TextDocument, range: vscode.Range): Promise<vscode.CodeAction[]> {
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const relevantDiagnostics = diagnostics.filter(d => d.range.intersection(range));

        const fixes: vscode.CodeAction[] = [];

        for (const diagnostic of relevantDiagnostics) {
            if (diagnostic.code && diagnostic.code.toString().startsWith("spectral")) {
                const fixSuggestion = diagnostic.message.split(". Fix: ")[1];
                if (fixSuggestion) {
                    const fix = new vscode.CodeAction(`Fix: ${fixSuggestion}`, vscode.CodeActionKind.QuickFix);
                    fix.edit = new vscode.WorkspaceEdit();
                    fix.edit.replace(document.uri, range, fixSuggestion);
                    fixes.push(fix);
                }
            }
        }

        return fixes;
    }
}
