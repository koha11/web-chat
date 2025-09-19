# Web Chat App

A real-time web chat application built with modern technologies for seamless communication.

## Features
- Real-time messaging with text, file attachments (all types), emoji reactions, threaded replies, forwards, and voice messages
- Supported DMs and group chats, with cursor-based pagination for both conversation lists and message history.
- Implemented 1-to-1 calling, real-time presence/typing indicators, and delivery/read states using WebSocket/Pusher.
- Designed a GraphQL API with subscriptions for live updates; structured connections/edges for efficient pagi-
nation and cache friendliness.
- Added global search across messages, conversations, and users
- Integrated a personal chatbot powered by Gemini API with Google search augmentation for quick info lookups
inside the chat.
- Secured the platform with JWT authentication, guarded resolvers, and upload authorization; stored media via
Cloudinary

## Tech Stack

- **Frontend:** ReactJS, TypeScript, Tailwindcss, shadcnUI
- **Backend:** NodeJS, GraphQL, Gemini API
- **Real-time:** WebSocket
- **Database:** MongoDB
- **Other**: Cloudinary, Pusher

## Getting Started

## License

MIT
