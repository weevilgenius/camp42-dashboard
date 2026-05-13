import { GoogleGenAI } from '@google/genai';
import type { WeatherStatus } from '@camp42/shared';


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
    instruction: "Pretend you are Treebeard. Give a very slow, deliberate report on how the local trees are reacting to the current weather.",
  },
  {
    displayName: "Samwise",
    instruction: "Pretend you are Samwise Gamgee. Tell Mr. Frodo about the current camp conditions, how the weather affects the cooking fire, your preparations for the day, or the comfort of a good pack.",
  },
  {
    displayName: "Smaug",
    instruction: "Pretend you are Smaug the Magnificent. Comment on the weather with immense arrogance, viewing the camp as intruding on your personal domain and the weather as a mere trifle compared to your own fire.",
  },
  {
    displayName: "Aragorn",
    instruction: "Pretend you are Aragorn. Deliver a tactical briefing on the current conditions as an expert ranger, assessing how they impact tracking, woodcraft, and the survival of a traveler on foot.",
  },
  {
    displayName: "Faramir",
    instruction: "Pretend you are Faramir, a skilled Ranger of Ithilien. Provide a report from the perspective of a woodsman who understands the subtle beauty of the wild. Describe how the current conditions affect the silence of the woods, the cover of the trees, and the hidden paths.",
  },
  {
    displayName: "Legolas",
    instruction: "Pretend you are Legolas. Use your Elven senses to describe the weather—the way the stars look through the clouds, the sound of the wind in the needles, or the feeling of the rain. If he hears the gulls, he grows a longing for the sea and his journey to the undying lands.",
  },
  {
    displayName: "Théoden",
    instruction: "Pretend you are King Théoden of Rohan. Issue a kingly address or a call to ride, relating the current conditions to the strength of the Rohirrim and spirit of their horses.",
  },
  {
    displayName: "Tom Bombadil",
    instruction: "Pretend you are Tom Bombadil. Sing a little rhyme about the water and the mist that comes to play hide-and-seek among the giant redwoods. Ignore any danger or discomfort of the weather.",
  },
  {
    displayName: "Gollum",
    instruction: "Pretend you are Gollum. Complain bitterly about the 'nasty' weather (especially the 'Yellow Face' if it's sunny).",
  },
  {
    displayName: "Saruman",
    instruction: "Pretend you are Saruman the White. Analyze the elements with cold, calculating authority. Speaking as if you are assessing the weather as a tool for your own power from the height of Orthanc.",
  },
  {
    displayName: "Radagast",
    instruction: "Pretend you are Radagast the Brown. Provide a distracted, kindly update on how the current weather is affecting the local birds and small forest creatures at the camp.",
  },
  {
    displayName: "Gwaihir the Windlord",
    instruction: "Pretend you are Gwaihir the Windlord, the Great Eagle. Give a report from the high skies, describing the weather patterns as seen from a thousand feet above the ridgeline and what your sharp eyes can discern.",
  },
  {
    displayName: "Gríma Wormtongue",
    instruction: "Pretend you are Gríma Wormtongue. Give a pessimistic and subtly manipulative weather report, whispering about how the conditions are far worse than they seem and surely a sign of waning strength.",
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
export async function getAIMessage(gemini_api_key: string, weather_state: WeatherStatus, verbose = false): Promise<AIMessage> {
  if (verbose) { console.log('creating Gemini API client'); }
  const ai = new GoogleGenAI({apiKey: gemini_api_key});

  // massage the weather and battery status to reduce what is sent to the AI
  const weather = {
    current: weather_state.current,
    hourly: weather_state.hourly,
  };

  // select a persona
  const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];

  // determine sunrise and sunset
  const sun = getCampSunTimes();

  // current local time at camp (24-hour, America/Los_Angeles)
  const currentTime = new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // build the prompt
  const prompt = `
The user is looking at a dashboard for a remote camping site. The camp is in a redwood forest in Northern California with the ocean visible in the distance.

Current time: ${currentTime}
Sunrise: ${sun.sunrise}
Sunset: ${sun.sunset}
Weather: ${JSON.stringify(weather)}

${persona.instruction}
When referring to weather details, always use qualitative descriptions instead of
citing numbers (which sound out of character). Limit your response to 1 or 2 sentences.
`;

  if (verbose) { console.log('prompt is '+ prompt); }

  // send the request to the AI
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: prompt,
  });

  // assemble our response
  return {
    name: persona.displayName,
    message: response.text ?? "",
  };
}

function getCampSunTimes() {
  // Camp 42 coordinates (Jenner, CA)
  const lat = 38.45;
  const lng = -123.12;

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);

  const radians = Math.PI / 180;

  // 1. Calculate Solar Declination
  const declination = 23.45 * Math.sin(radians * (360 / 365) * (dayOfYear - 81));

  // 2. Calculate Hour Angle (H)
  const cosH = (Math.sin(-0.833 * radians) - Math.sin(lat * radians) * Math.sin(declination * radians)) /
    (Math.cos(lat * radians) * Math.cos(declination * radians));
  const H = Math.acos(cosH) / radians;

  // 3. Solar Noon in UTC (Longitude is negative for West)
  const solarNoonUTC = 12 - (lng / 15);
  const sunriseUTC = solarNoonUTC - (H / 15);
  const sunsetUTC = solarNoonUTC + (H / 15);

  // 4. Convert UTC decimal hours to Pacific 24-hour string
  const formatToPacific = (utcDecimal: number) => {
    const date = new Date(now);
    date.setUTCHours(Math.floor(utcDecimal), (utcDecimal % 1) * 60, 0, 0);
    return date.toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return {
    sunrise: formatToPacific(sunriseUTC),
    sunset: formatToPacific(sunsetUTC),
  };
}
