import * as vscode from "vscode";

export class Logger {
    static info(message: string) {
        vscode.window.showInformationMessage(`[IDE-Vulscanner]: ${message}`);
        console.log(`[INFO]: ${message}`);
    }

    static error(message: string, error?: any) {
        vscode.window.showErrorMessage(`[IDE-Vulscanner]: ${message}`);
        console.error(`[ERROR]: ${message}`, error);
    }
}
