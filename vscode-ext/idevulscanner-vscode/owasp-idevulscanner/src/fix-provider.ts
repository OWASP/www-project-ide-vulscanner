import * as vscode from "vscode";

export class SpectralFixProvider implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      const fixSuggestion = (diagnostic as any).fixSuggestion;
      if (fixSuggestion) {
        const action = new vscode.CodeAction(
          `Fix: ${fixSuggestion}`,
          vscode.CodeActionKind.QuickFix
        );
        action.edit = new vscode.WorkspaceEdit();
        action.edit.replace(document.uri, range, fixSuggestion);
        actions.push(action);
      }
    }

    return actions;
  }
}
