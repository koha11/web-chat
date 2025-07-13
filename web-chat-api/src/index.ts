import Express from "express";
import http from "http";

import cors from "cors";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { typeDefs, resolvers, graphqlSchema } from "./graphql/index.js";
import { ENVIRONMENT, HOST, PORT } from "./config/env.js";
import { connectDB } from "./db/index.js";
import { ITokenPayload } from "./interfaces/auth/tokenPayload.interface.js";
import { PubsubEvents } from "./interfaces/socket/pubsubEvents.js";
import { route } from "./routes/index.js";
import authService from "./services/AuthService.js";
import userService from "./services/UserService.js";

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

const app = Express();
const server = http.createServer(app);

const pubsub = new PubSub<PubsubEvents>();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req.headers.authorization;

    let user = null;

    if (auth?.startsWith("Bearer ")) {
      const token = auth.slice(7);
      if (token == "undefined") return;
      user = authService.verifyToken(token);
      if (!user) {
        return {};
        throw new Error("Missing auth token");
      }
    }

    return { pubsub, user };
  },
});

await connectDB();

await apollo.start();

apollo.applyMiddleware({ app, path: "/graphql" });
app.use(cors());

// xu li file tinh

app.use(Express.static("node_modules"));

//xu li du lieu tu form (dua vao middleware duoc xay dung san cua express js)
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

//middleware giup ghi de` cac phthuc khac len pthuc post hoac get cua form
app.use(methodOverride("_method"));

//middleware giup giai ma cookies
app.use(cookieParser());

route(app);

const graphqlWSS = new WebSocketServer({
  noServer: true,
});

const rtcWSS = new WebSocketServer({
  noServer: true,
});

useServer(
  {
    schema: graphqlSchema,
    context: async (ctx, msg, args) => {
      const token = ctx.connectionParams?.authToken as string;

      let user = null;

      if (!token) {
        return;
        throw new Error("no token provided");
      }

      user = authService.verifyToken(token);

      if (!user) throw new Error("Missing auth token");

      return { pubsub, user };
    },
    onConnect: async (ctx) => {
      if (!ctx.connectionParams?.authToken) {
        return;
      }

      const token = ctx.connectionParams?.authToken as string;
      const user = authService.verifyToken(token);

      await userService.setOnlineStatus(user.id.toString());

      console.log(user.username + " is online");
    },
    onDisconnect: async (ctx) => {
      if (!ctx.connectionParams?.authToken) {
        return;
      }

      const token = ctx.connectionParams?.authToken as string;
      const user = authService.verifyToken(token);

      await userService.setOfflineStatus(user.id.toString());

      console.log(user.username + " is offline");
    },
  },
  graphqlWSS
);

// upgrade socket endpoint
server.on("upgrade", (request, socket, head) => {
  const { url } = request;

  if (url === "/subscriptions") {
    graphqlWSS.handleUpgrade(request, socket, head, (ws) => {
      graphqlWSS.emit("connection", ws, request);
    });
  } else if (url === "/rtc-signal") {
    rtcWSS.handleUpgrade(request, socket, head, (ws) => {
      rtcWSS.emit("connection", ws, request);
    });
  } else {
    socket.destroy(); // unknown path
  }
});

rtcWSS.on("connection", (ws) => {
  console.log(`RTC client connected`);

  ws.on("message", (msg) => {
    const msgText = msg.toString();

    // Relay tin nhắn cho tất cả peer khác
    rtcWSS.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msgText);
      }
    });
  });

  ws.on("close", () => {
    console.log("RTC client disconnected");
  });
});

console.log("MongoDB is connected");

server.listen(PORT, () => {
  console.log(
    `Server running on ${
      ENVIRONMENT == "DEV" ? `http://${HOST}:${PORT}` : `https://${HOST}`
    }`
  );
  console.log(
    `GraphQL endpoint: ${
      ENVIRONMENT == "DEV"
        ? `http://${HOST}:${PORT}/graphql`
        : `https://${HOST}/graphql`
    }`
  );
  console.log(
    `GraphQL WS endpoint: ${
      ENVIRONMENT == "DEV"
        ? `ws://${HOST}:${PORT}/subscriptions`
        : `wss://${HOST}/subscriptions`
    }`
  );
  console.log(
    `RTC Signal WS endpoint: ${
      ENVIRONMENT == "DEV"
        ? `ws://${HOST}:${PORT}/rtc-signal`
        : `wss://${HOST}/rtc-signal`
    }`
  );
});
