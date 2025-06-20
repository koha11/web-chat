import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { chaResolvers } from './resolvers/chat.resolver';
import { chatTypeDefs } from './schemas/chat.schema';


export const typeDefs = mergeTypeDefs([
  `type Query`, `type Mutation`, // base root types
  chatTypeDefs,
]);

export const resolvers = mergeResolvers([
  chaResolvers
]);