import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start testing OWASP IDE-Vulscanner...");

    test("Extension should be present", async () => {
        const extension = vscode.extensions.getExtension("your.extension.id");
        assert.ok(extension);
    });

    test("Commands should be registered", async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes("owasp.scan"));
        assert.ok(commands.includes("owasp.fixAI"));
    });
});
