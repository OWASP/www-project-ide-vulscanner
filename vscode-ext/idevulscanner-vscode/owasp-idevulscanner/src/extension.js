"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const spectralLint_1 = require("./spectralLint");
function activate(context) {
    let disposable = vscode.workspace.onDidSaveTextDocument(document => {
        (0, spectralLint_1.runSpectralLint)(document);
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
