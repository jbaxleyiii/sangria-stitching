const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { HttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const {
  makeRemoteExecutableSchema,
  introspectSchema,
} = require("graphql-tools");
const { ApolloEngine } = require("apollo-engine");

const link = new HttpLink({ uri: "http://localhost:8080/graphql", fetch });

const PORT = 3000;
const app = express();
const engine = new ApolloEngine({
  apiKey: process.env.ENGINE_API_KEY,
});
const start = async () => {
  const sangria = await introspectSchema(link);

  const schema = makeRemoteExecutableSchema({ schema: sangria, link });

  // bodyParser is needed just for POST.
  app.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress({ schema, tracing: true })
  );
  app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

  engine.listen({ port: PORT, expressApp: app }, () => {
    console.log(`Engine is running on port ${PORT}`);
  });
};
start().catch(console.error);
