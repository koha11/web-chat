import { GEMINI_API_KEY } from "@/config/env.js";
import Message from "@/models/Message.model.ts";
import {
  GoogleGenAI,
  FunctionCallingConfigMode,
  mcpToTool,
  Type,
  GenerateContentConfig,
  Content,
} from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export const gemini_promp_process = async (promp: string) => {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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

  // Define the grounding tool
  const groundingTool = {
    googleSearch: {},
  };

  const functionDeclarationTool = {
    functionDeclarations: [weatherFunctionDeclaration],
  };

  const contents = [
    {
      role: "user",
      parts: [{ text: promp }],
    },
  ] as any;

  // const config = {
  //   tools: [
  //     {
  //       functionDeclarations: [weatherFunctionDeclaration],
  //     },
  //   ],
  // };

  const config = {
    tools: [functionDeclarationTool],
    systemInstruction: "You are a cute Chat bot. Your name is Meo Meo.",
  } as GenerateContentConfig;

  // Send request with function declarations
  // const response = await ai.models.generateContent({
  //   model: "gemini-2.5-flash",
  //   contents: contents,
  //   config: config,
  // });

  const msgs = await Message.find({
    chat: "68663b38b432e39dd6f68902",
    user: "684d9cf16cda6f875d523d82",
  });

  const histories = msgs.map((msg) => {
    return {
      role: "user",
      parts: [{ text: msg.msgBody }],
    };
  }) as Content[];

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: config,
    history: histories,
  });

  const response = await chat.sendMessage({ message: promp });

  // Check for function calls in the response

  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0]; // Assuming one function call
    console.log(`Function to call: ${functionCall.name}`);
    console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
    // In a real app, you would call your actual function here:
    let result;

    if (functionCall.name === "get_current_temperature") {
      result = "36 deg";
      console.log(`Function execution result: ${JSON.stringify(result)}`);
    }
    // Create a function response part
    const function_response_part = {
      name: functionCall.name,
      response: { result },
    };

    // Append function call and   result of the function execution to contents
    if (response.candidates && response.candidates[0].content)
      histories.push(response.candidates[0].content);

    histories.push({
      role: "user",
      parts: [{ functionResponse: function_response_part }],
    });

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: config,
      history: histories,
    });

    const final_response = await chat.sendMessage({ message: promp });

    return final_response.text;
  } else {
    console.log("No function call found in the response.");
    console.log(response.text);
  }

  return response.text;
};

// Using MCP (TESTING)
// export const gemini_promp_process = async (promp: string) => {
//   // Create server parameters for stdio connection
//   const serverParams = new StdioClientTransport({
//     command: "npx", // Executable
//     args: ["-y", "@philschmid/weather-mcp"], // MCP Server
//   });

//   const client = new Client({
//     name: "example-client",
//     version: "1.0.0",
//   });

//   // Configure the client
//   const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

//   // Initialize the connection between client and server
//   await client.connect(serverParams);

//   // Send request to the model with MCP tools
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: promp,
//     config: {
//       tools: [mcpToTool(client)], // uses the session, will automatically call the tool
//       // Uncomment if you **don't** want the sdk to automatically call the tool
//       // automaticFunctionCalling: {
//       //   disable: true,
//       // },
//     },
//   });

//   console.log(response.text);

//   // Close the connection
//   // await client.close();

//   // return response.text;
// };
