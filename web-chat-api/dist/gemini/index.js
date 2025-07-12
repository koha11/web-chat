import { GEMINI_API_KEY } from "@/config/env.js";
import Message from "@/models/Message.model.js";
import { GoogleGenAI, FunctionCallingConfigMode, } from "@google/genai";
import { getCurrentWeather, weatherFunctionDeclaration, } from "./tools/weather.tools.js";
export const gemini_promp_process = async (promp, chatId, userId) => {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const functionDeclarationTool = {
        functionDeclarations: [weatherFunctionDeclaration],
    };
    // Cấu hình cho mô hình
    const config = {
        tools: [functionDeclarationTool],
        // Buộc mô hình gọi 'any' hàm, thay vì trò chuyện.
        toolConfig: {
            functionCallingConfig: {
                mode: FunctionCallingConfigMode.AUTO,
            },
        },
        systemInstruction: "You are a cute Chat bot. Your name is Meo Meo.",
        // thinkingConfig: { thinkingBudget: 0 },
    };
    // Lấy lịch sử tin nhắn từ cơ sở dữ liệu
    const msgs = await Message.find({
        chat: chatId, // Thay bằng ID chat thực tế
    });
    const histories = msgs.map((msg) => {
        if (msg.user.toString() == userId)
            return { role: "user", parts: [{ text: msg.msgBody }] };
        return { role: "model", parts: [{ text: msg.msgBody }] };
    });
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: config,
        history: histories,
    });
    const response = await chat.sendMessage({ message: promp });
    if (response.functionCalls) {
        if (response.candidates && response.candidates[0].content) {
            histories.push(response.candidates[0].content);
            console.log(response.candidates[0].content.parts);
        }
        for (let fn of response.functionCalls) {
            let fnResult;
            if (fn.name == "get_current_weather") {
                const location = fn.args.location;
                fnResult = await getCurrentWeather(location);
            }
            histories.push({
                role: "model",
                parts: [
                    {
                        functionResponse: {
                            name: fn.name,
                            response: { output: fnResult },
                        },
                    },
                ],
            });
        }
        const finalChat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: config,
            history: histories,
        });
        const finalResponse = await finalChat.sendMessage({
            message: promp,
            config: { thinkingConfig: { thinkingBudget: 0 } },
        });
        return finalResponse.text;
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
