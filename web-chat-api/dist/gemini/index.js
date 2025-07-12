const genAI = require("@google/genai");
import { Type } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env";
export const gemini_promp_process = async (promp) => {
    const ai = new genAI.GoogleGenAI({ apiKey: GEMINI_API_KEY });
    // Define the function declaration for the model
    const weatherFunctionDeclaration = {
        name: "get_current_temperature",
        description: "Gets the current temperature for a given location.",
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
    // Send request with function declarations
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promp,
        config: {
            tools: [
                {
                    functionDeclarations: [weatherFunctionDeclaration],
                },
            ],
        },
    });
    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]; // Assuming one function call
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
        // In a real app, you would call your actual function here:
        // const result = await getCurrentTemperature(functionCall.args);
    }
    else {
        console.log("No function call found in the response.");
        console.log(response.text);
    }
    return response.text;
};
