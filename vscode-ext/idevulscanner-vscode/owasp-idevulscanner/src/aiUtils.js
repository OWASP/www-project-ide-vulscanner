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
exports.getOpenAIResponse = getOpenAIResponse;
const openai_1 = require("openai");
const config = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY || "your-api-key",
});
const openai = new openai_1.OpenAIApi(config);
function getOpenAIResponse(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const completion = yield openai.createCompletion({
                model: "gpt-4",
                prompt,
                max_tokens: 100,
            });
            return completion.data.choices[0].text.trim();
        }
        catch (error) {
            console.error("AI Remediation Error:", error);
            return "Error generating AI remediation.";
        }
    });
}
