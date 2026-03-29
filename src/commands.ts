import * as vscode from "vscode";
import { exec } from "child_process";
import { Logger } from "./logger";

export function runSpectralLinting(document: vscode.TextDocument) {
    const filePath = document.uri.fsPath;
    Logger.info(`Running Spectral scan on: ${filePath}`);

    exec(`npx spectral lint ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Spectral Linting Error: ${stderr}`);
            Logger.error(stderr);
            return;
        }
        vscode.window.showInformationMessage(`Spectral Scan Results:\n${stdout}`);
        Logger.info(stdout);
    });
}
