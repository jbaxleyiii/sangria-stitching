const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { HttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas,
} = require("graphql-tools");
const { ApolloEngine } = require("apollo-engine");

const link = new HttpLink({ uri: "http://localhost:8080/graphql", fetch });

const PORT = 3000;
const app = express();
const engine = new ApolloEngine({
  apiKey: process.env.ENGINE_API_KEY,
  stores: [
    {
      name: "publicResponseCache",
      inMemory: {
        cacheSize: 10485760,
      },
    },
  ],
  queryCache: {
    publicFullQueryStore: "publicResponseCache",
  },
});
const start = async () => {
  const sangria = await introspectSchema(link);

  const sangriaSchema = makeRemoteExecutableSchema({ schema: sangria, link });
  const cacheDefs = `
  extend type Query {
    droidWithCache(id: String!): Droid! @cacheControl(maxAge: 240)
  }`;

  const schema = mergeSchemas({
    schemas: [sangriaSchema, cacheDefs],
    resolvers: mergeInfo => ({
      Query: {
        droidWithCache: {
          resolve(parent, args, context, info) {
            return mergeInfo.delegate("query", "droid", args, context, info);
          },
        },
      },
    }),
  });

  // bodyParser is needed just for POST.
  app.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress({ schema, tracing: true, context: {}, cacheControl: true })
  );
  app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

  engine.listen({ port: PORT, expressApp: app }, () => {
    console.log(`Engine is running on port ${PORT}`);
  });
};
start().catch(console.error);
