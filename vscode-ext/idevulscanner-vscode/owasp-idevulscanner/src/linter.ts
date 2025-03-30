import * as vscode from 'vscode';
import { Spectral } from '@stoplight/spectral-core';
import * as fs from 'fs';
import { Logger } from './utils/logger';

export async function runSpectralLinting(document: vscode.TextDocument) {
  try {
    const spectral = new Spectral();
    const filePath = document.uri.fsPath;
    
    if (!fs.existsSync(filePath)) {
      Logger.warn(`File does not exist: ${filePath}`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const results = await spectral.run(fileContent);

    Logger.info(`Linting completed for ${filePath} with ${results.length} issues found.`);

    // Process and display linting issues
  } catch (error) {
    Logger.error('Failed to execute Spectral linting.', error);
  }
}
