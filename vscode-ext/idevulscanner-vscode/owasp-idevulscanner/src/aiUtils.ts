import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "your-api-key",
});

const openai = new OpenAIApi(config);

export async function getOpenAIResponse(prompt: string): Promise<string> {
  try {
    const completion = await openai.createCompletion({
      model: "gpt-4",
      prompt,
      max_tokens: 100,
    });
    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error("AI Remediation Error:", error);
    return "Error generating AI remediation.";
  }
}
