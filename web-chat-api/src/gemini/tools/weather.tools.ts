import { OPEN_WEATHER_API_KEY } from "@/config/env.ts";
import { Type } from "@google/genai";

// Define the function declaration for the model
export const weatherFunctionDeclaration = {
  name: "get_current_weather",
  description: "Gets the current weather for a given location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city name, e.g. San Francisco",
      },
    },
    required: ["location"],
  },
};

export const getCurrentWeather = async (location: string) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${OPEN_WEATHER_API_KEY}&units=metric`
  );

  const data = await res.text();

  return data;
};
