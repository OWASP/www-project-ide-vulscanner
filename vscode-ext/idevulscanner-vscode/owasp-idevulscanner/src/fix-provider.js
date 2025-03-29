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
exports.SpectralFixProvider = void 0;
const vscode = require("vscode");
class SpectralFixProvider {
    provideCodeActions(document, range) {
        return this.getFixes(document, range);
    }
    getFixes(document, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const diagnostics = vscode.languages.getDiagnostics(document.uri);
            const relevantDiagnostics = diagnostics.filter(d => d.range.intersection(range));
            const fixes = [];
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
        });
    }
}
exports.SpectralFixProvider = SpectralFixProvider;
