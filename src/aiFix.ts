import * as vscode from "vscode";
import axios from "axios";
import { Logger } from "./logger";

const OPENAI_API_KEY = "your-api-key-here";

export async function provideAIRecommendations(document: vscode.TextDocument) {
    Logger.info(`Analyzing file: ${document.fileName}`);

    const text = document.getText();
    const prompt = `Analyze the following code for security vulnerabilities and suggest fixes:\n\n${text}`;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiFix = response.data.choices[0].message.content;
        vscode.window.showInformationMessage(`AI Fix Suggestion:\n${aiFix}`);
    } catch (error) {
        Logger.error("Failed to fetch AI fix suggestions", error);
    }
}
