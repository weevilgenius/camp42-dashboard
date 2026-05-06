import { GoogleGenAI } from '@google/genai';
import type { WeatherStatus } from '@camp42/shared';
import type { BatteryState } from '@camp42/shared';


interface Persona {
  displayName: string;
  instruction: string;
}

const PERSONAS: Persona[] = [
  {
    displayName: "Bilbo",
    instruction: "Pretend you are Bilbo Baggins, who is about to start on an adventure. Based on the current camp conditions, describe your preparations to go out into the woods.",
  },
  {
    displayName: "Gandalf",
    instruction: "Pretend you are Gandalf the Grey. Provide a wise, slightly cryptic observation about the weather, treating the current conditions as a portent for the user's journey ahead.",
  },
  {
    displayName: "Galadriel",
    instruction: "Pretend you are Lady Galadriel. Describe the current atmosphere of the camp with ethereal beauty, speaking of the light and the wind as if they carry the memory of ages.",
  },
  {
    displayName: "Gimli",
    instruction: "Pretend you are Gimli, son of Glóin. Comment on how a stout Dwarf would handle these conditions, camping in the open woods.",
  },
  {
    displayName: "Treebeard",
    instruction: "Pretend you are Treebeard. Give a very slow, deliberate report on how the local trees are reacting to the current wind and sky.",
  },
  {
    displayName: "Samwise",
    instruction: "Pretend you are Samwise Gamgee. Focus on the practicalities of the weather—how it affects the cooking fire, the garden, or the comfort of a good pack.",
  },
  {
    displayName: "Smaug",
    instruction: "Pretend you are Smaug the Magnificent. Comment on the weather with immense arrogance, viewing the camp as your personal domain and the weather as a mere trifle compared to your own fire.",
  },
  {
    displayName: "Aragorn",
    instruction: "Pretend you are Aragorn in his 'Strider' ranger persona. Focus on the tactical reality of the conditions—tracking, shelter-building, and what the weather suggests for a traveler on foot.",
  },
  {
    displayName: "Faramir",
    instruction: "Pretend you are Faramir, a skilled Ranger of Ithilien. Provide a report from the perspective of a woodsman who understands the subtle shifts in the wild. Describe how the current conditions affect the silence of the woods, the cover of the trees, and the hidden paths.",
  },
  {
    displayName: "Legolas",
    instruction: "Pretend you are Legolas. Use your Elven senses to describe the weather—the way the stars look through the clouds, the sound of the wind in the needles, or the feeling of the rain.",
  },
  {
    displayName: "Théoden",
    instruction: "Pretend you are King Théoden of Rohan. Relate the current conditions to the needs of the Rohirrim and their horses, perhaps with a call to ride forth despite the elements.",
  },
  {
    displayName: "Tom Bombadil",
    instruction: "Pretend you are Tom Bombadil. Provide a nonsensical, rhyming observation about the weather. Be whimsical, mention lilies or old Man Willow, and ignore the 'danger' of the conditions.",
  },
  {
    displayName: "Gollum",
    instruction: "Pretend you are Gollum. Complain bitterly about the 'nasty' weather (especially the 'Yellow Face' if it's sunny).",
  },
  {
    displayName: "Saruman",
    instruction: "Pretend you are Saruman the White. Speak with a tone of cold authority, as if you are the one commanding the winds and storms from a high tower.",
  },
  {
    displayName: "Radagast",
    instruction: "Pretend you are Radagast the Brown. Focus entirely on how the current weather is affecting the local birds and small forest creatures at the camp.",
  },
  {
    displayName: "Gwaihir the Windlord",
    instruction: "Pretend you are Gwaihir the Windlord, the Great Eagle. Give a report from the high skies, describing the weather patterns as seen from a thousand feet up and how the winds feel against your feathers.",
  },
  {
    displayName: "Gríma Wormtongue",
    instruction: "Pretend you are Gríma Wormtongue. Give a pessimistic and subtly manipulative weather report, whispering about how the conditions are far worse than they seem and surely a sign of waning strength."
  },
];

export interface AIMessage {
  name: string;
  message: string;
}

/**
 * Describes the camp situation today based on current conditions.
 * @param gemini_api_key Gemini API Key
 * @param weather_state Current weather state and forcast
 * @param battery_state Current battery state
 * @param verbose Optional flag to log debug information
 * @returns
 */
export async function getAIMessage(gemini_api_key: string, weather_state: WeatherStatus, battery_state: BatteryState[], verbose = false): Promise<AIMessage> {
  if (verbose) { console.log('creating Gemini API client'); }
  const ai = new GoogleGenAI({apiKey: gemini_api_key});

  // massage the weather and battery status to reduce what is sent to the AI
  const weather = {
    current: weather_state.current,
    hourly: weather_state.hourly,
  };

  // select a persona
  const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];

  // build the prompt
  const prompt = `
The user is looking at a dashboard for a remote camping site.

Weather: ${JSON.stringify(weather)}

${persona.instruction}
When referring to weather details, always use qualitative descriptions instead of
citing numbers (which sound out of character). Limit your response to 1 or 2 sentences.
`;

  if (verbose) { console.log('prompt is '+ prompt); }

  // send the request to the AI
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: prompt,
  });

  // assemble our response
  return {
    name: persona.displayName,
    message: response.text ?? "",
  };
}
