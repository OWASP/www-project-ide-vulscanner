"use strict";
<<<<<<< HEAD
=======
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
>>>>>>> spectral-linting-integration
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
<<<<<<< HEAD
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
=======
exports.SpectralLinter = void 0;
const spectral_core_1 = require("@stoplight/spectral-core");
const spectral_ruleset_bundler_1 = require("@stoplight/spectral-ruleset-bundler");
const fs = __importStar(require("fs"));
class SpectralLinter {
    constructor() {
        this.spectral = new spectral_core_1.Spectral();
    }
    loadRuleset(rulesetPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(rulesetPath)) {
                throw new Error("Ruleset file not found.");
            }
            const ruleset = yield (0, spectral_ruleset_bundler_1.bundleAndLoadRuleset)(rulesetPath, { fs });
            yield this.spectral.setRuleset(ruleset);
        });
    }
    lint(documentText) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.spectral.run(documentText);
        });
    }
}
exports.SpectralLinter = SpectralLinter;
>>>>>>> spectral-linting-integration
