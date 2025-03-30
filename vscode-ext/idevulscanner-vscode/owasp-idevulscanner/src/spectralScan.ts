import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function fetchSpectralIssues(document: vscode.TextDocument) {
    const spectralCmd = `spectral lint ${document.uri.fsPath} --json`;
    try {
        const { stdout } = await execAsync(spectralCmd);
        const results = JSON.parse(stdout);
        return results.issues || [];
    } catch (error) {
        vscode.window.showErrorMessage("Error running Spectral lint.");
        return [];
    }
}
