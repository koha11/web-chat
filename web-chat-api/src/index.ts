import Express from "express";
import http from "http";
import { PORT } from "./config/env";
import { connectSocketIo } from "./socket";
import { connectDB } from "./db";
import { route } from "./routes";
import cors from "cors";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import path from "path";
import { ITokenPayload } from "./interfaces/auth/tokenPayload.interface";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./graphql";

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

const app = Express();
const server = http.createServer(app);

app.use(cors());

// xu li file tinh
app.use(
  Express.static(path.join(__dirname.slice(0, __dirname.length - 4), "public"))
);

app.use(Express.static("node_modules"));

//xu li du lieu tu form (dua vao middleware duoc xay dung san cua express js)
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

//middleware giup ghi de` cac phthuc khac len pthuc post hoac get cua form
app.use(methodOverride("_method"));

//middleware giup giai ma cookies
app.use(cookieParser());

route(app);

connectSocketIo(server);

const apollo = new ApolloServer({ typeDefs, resolvers });

Promise.all([connectDB(), apollo.start()])
  .then(() => {
    apollo.applyMiddleware({ app, path: "/graphql" });
    console.log("MongoDB is connected");

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
