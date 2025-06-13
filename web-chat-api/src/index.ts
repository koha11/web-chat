import Express from "express";
import http from "http";
import { PORT } from "./config/env";
import { connectSocketIo } from "./socket";
import { connectDB } from "./db";

const app = Express();
const server = http.createServer(app);

connectSocketIo(server);

connectDB().then(() => {
  console.log("MongoDB is connected");
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
