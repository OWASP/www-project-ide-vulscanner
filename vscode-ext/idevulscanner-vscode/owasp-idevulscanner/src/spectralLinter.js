"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSpectralLint = runSpectralLint;
const vscode = require("vscode");
const spectral_core_1 = require("@stoplight/spectral-core");
const fs = require("fs");
const spectral_runtime_1 = require("@stoplight/spectral-runtime");
function runSpectralLint(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const spectral = new spectral_core_1.Spectral();
        const rulesetPath = vscode.workspace.getConfiguration('spectral').get('rulesetPath') || 'spectral.yaml';
        if (!fs.existsSync(rulesetPath)) {
            vscode.window.showErrorMessage(`Ruleset file not found: ${rulesetPath}`);
            return;
        }
        try {
            const ruleset = yield (0, spectral_runtime_1.bundleAndLoadRuleset)(rulesetPath, { fs });
            spectral.setRuleset(ruleset);
            const results = yield spectral.run(new spectral_core_1.Document(document.getText(), spectral_core_1.Parsers.Json));
            const diagnostics = results.map(result => {
                const range = new vscode.Range(result.range.start.line, result.range.start.character, result.range.end.line, result.range.end.character);
                return new vscode.Diagnostic(range, result.message, vscode.DiagnosticSeverity.Warning);
            });
            const diagnosticsCollection = vscode.languages.createDiagnosticCollection('spectral');
            diagnosticsCollection.set(document.uri, diagnostics);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Spectral linting failed: ${error.message}`);
        }
    });
}
