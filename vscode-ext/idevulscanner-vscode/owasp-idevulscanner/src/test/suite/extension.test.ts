import * as assert from "assert";
import * as vscode from "vscode";
import { provideAiFixes } from "../../aiFixProvider";

suite("AI Fix Provider Tests", () => {
    test("Should apply AI fixes correctly", async () => {
        const editor = await vscode.workspace.openTextDocument({ content: "const apiKey = '123456';" });
        await provideAiFixes();
        assert.strictEqual(editor.getText().includes("apiKey"), false);
    });
});
