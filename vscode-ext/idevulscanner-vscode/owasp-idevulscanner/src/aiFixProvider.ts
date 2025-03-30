import * as vscode from "vscode";
import { fetchSpectralIssues } from "./spectralScan";
import { getAiFix } from "./utils";

export async function provideAiFixes() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
    }

    const document = editor.document;
    const spectralIssues = await fetchSpectralIssues(document);
    if (spectralIssues.length === 0) {
        vscode.window.showInformationMessage("No security issues detected.");
        return;
    }

    for (const issue of spectralIssues) {
        const fix = await getAiFix(issue);
        if (fix) {
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, issue.range, fix);
            await vscode.workspace.applyEdit(edit);
        }
    }

    vscode.window.showInformationMessage("AI-powered fixes applied successfully!");
}
