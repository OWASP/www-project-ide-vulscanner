<<<<<<< HEAD
import * as vscode from 'vscode';
import { Spectral, Document, Parsers } from '@stoplight/spectral-core';
import * as fs from 'fs';
import { bundleAndLoadRuleset } from '@stoplight/spectral-runtime';

export async function runSpectralLint(document: vscode.TextDocument) {
    const spectral = new Spectral();
    const rulesetPath = vscode.workspace.getConfiguration('spectral').get<string>('rulesetPath') || 'spectral.yaml';
    
    if (!fs.existsSync(rulesetPath)) {
        vscode.window.showErrorMessage(`Ruleset file not found: ${rulesetPath}`);
        return;
    }
    
    try {
        const ruleset = await bundleAndLoadRuleset(rulesetPath, { fs });
        spectral.setRuleset(ruleset);

        const results = await spectral.run(new Document(document.getText(), Parsers.Json));
        const diagnostics: vscode.Diagnostic[] = results.map(result => {
            const range = new vscode.Range(result.range.start.line, result.range.start.character, result.range.end.line, result.range.end.character);
            return new vscode.Diagnostic(range, result.message, vscode.DiagnosticSeverity.Warning);
        });

        const diagnosticsCollection = vscode.languages.createDiagnosticCollection('spectral');
        diagnosticsCollection.set(document.uri, diagnostics);
    } catch (error) {
        vscode.window.showErrorMessage(`Spectral linting failed: ${error.message}`);
    }
=======
import { Spectral } from "@stoplight/spectral-core";
import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler";
import * as fs from "fs";

export class SpectralLinter {
  private spectral: Spectral;

  constructor() {
    this.spectral = new Spectral();
  }

  async loadRuleset(rulesetPath: string) {
    if (!fs.existsSync(rulesetPath)) {
      throw new Error("Ruleset file not found.");
    }

    const ruleset = await bundleAndLoadRuleset(rulesetPath, { fs });
    await this.spectral.setRuleset(ruleset);
  }

  async lint(documentText: string) {
    return await this.spectral.run(documentText);
  }
>>>>>>> spectral-linting-integration
}
