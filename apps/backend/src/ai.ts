import { GoogleGenAI } from '@google/genai';
import type { WeatherStatus } from '@camp42/shared';
import type { BatteryState } from '@camp42/shared';

/**
 * Describes the camp situation today based on current conditions.
 * @param gemini_api_key Gemini API
 * @returns
 */
export async function getAIMessage(gemini_api_key: string, weather: WeatherStatus, batteries: [hank: BatteryState, bertha: BatteryState], verbose = false): Promise<string> {
  if (verbose) { console.log('creating Gemini API client'); }
  const ai = new GoogleGenAI({apiKey: gemini_api_key});
  const prompt = `
The user is looking at a dashboard for a camping site.

Weather: ${JSON.stringify(weather)}
Battery State: ${JSON.stringify(batteries)}

Write a haiku informing them if today is a good day for camping.
`;

  if (verbose) { console.log('prompt is '+ prompt); }

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: prompt,
  });
  return response.text ?? "";
}
