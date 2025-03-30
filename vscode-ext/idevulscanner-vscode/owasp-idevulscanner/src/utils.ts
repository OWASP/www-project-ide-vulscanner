import axios from "axios";

const OPENAI_API_KEY = "your-api-key"; // Replace with actual API Key

export async function getAiFix(issue: any): Promise<string | null> {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a security expert." },
                    { role: "user", content: `Fix this issue: ${issue.message}` }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API error:", error);
        return null;
    }
}
