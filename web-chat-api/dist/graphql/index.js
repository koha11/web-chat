import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { chatResolvers } from "./resolvers/chat.resolver";
import { chatTypeDefs } from "./schemas/chat.schema";
import { messageResolvers } from "./resolvers/message.resolver";
import { messageTypeDefs } from "./schemas/message.schema";
import { userTypeDefs } from "./schemas/user.schema";
import { userResolvers } from "./resolvers/user.resolver";
import { contactTypeDefs } from "./schemas/contact.schema";
import { contactResolvers } from "./resolvers/contact.resolver";
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
]);
export const resolvers = mergeResolvers([
    chatResolvers,
    messageResolvers,
    userResolvers,
    contactResolvers,
]);
export const graphqlSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
