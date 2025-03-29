import { getOpenAIResponse } from "./aiUtils";

export async function aiRemediation(issue: any): Promise<string> {
  const prompt = `Provide a fix for the following API linting issue: ${issue.description}`;
  const response = await getOpenAIResponse(prompt);
  return response;
}
