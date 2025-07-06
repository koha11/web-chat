import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { chatResolvers } from "./resolvers/chat.resolver.ts";
import { contactResolvers } from "./resolvers/contact.resolver.ts";
import { messageResolvers } from "./resolvers/message.resolver.ts";
import { userResolvers } from "./resolvers/user.resolver.ts";
import { chatTypeDefs } from "./schemas/chat.schema.ts";
import { contactTypeDefs } from "./schemas/contact.schema.ts";
import { messageTypeDefs } from "./schemas/message.schema.ts";
import { userTypeDefs } from "./schemas/user.schema.ts";
import { authTypeDefs } from "./schemas/auth.schema.ts";
import { authResolvers } from "./resolvers/auth.resolver.ts";

export const typeDefs = mergeTypeDefs([
  `type Query`,
  `type Mutation`, // base root types
  `type Subscription`,
  `type PageInfo {
    startCursor: ID
    endCursor: ID
    hasNextPage: Boolean!
  }`,
  `scalar JSONObject`,
  `scalar Date`,
  chatTypeDefs,
  messageTypeDefs,
  userTypeDefs,
  contactTypeDefs,
  authTypeDefs,
]);

export const resolvers = mergeResolvers([
  chatResolvers,
  messageResolvers,
  userResolvers,
  contactResolvers,
  authResolvers,
]);

export const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
