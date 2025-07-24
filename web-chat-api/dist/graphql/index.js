import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { chatResolvers } from "./resolvers/chat.resolver.js";
import { contactResolvers } from "./resolvers/contact.resolver.js";
import { messageResolvers } from "./resolvers/message.resolver.js";
import { userResolvers } from "./resolvers/user.resolver.js";
import { chatTypeDefs } from "./schemas/chat.schema.js";
import { contactTypeDefs } from "./schemas/contact.schema.js";
import { messageTypeDefs } from "./schemas/message.schema.js";
import { userTypeDefs } from "./schemas/user.schema.js";
import { authTypeDefs } from "./schemas/auth.schema.js";
import { authResolvers } from "./resolvers/auth.resolver.js";
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
    `scalar Upload`,
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
