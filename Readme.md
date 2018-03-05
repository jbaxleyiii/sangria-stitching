# NYTExample

This repo shows how to use a node server to try out Engine with an existing Sangria backend. It is made up of two parts:

1. A simple Sangria [example app](https://github.com/sangria-graphql/sangria-akka-http-example)
2. A basic Apollo Server app with Engine

## Running instructions

- [  ] start the sangria app in a terminal window via `sbt run` in the sangria-akka-http-example folder
- [  ] create a service on [engine](https://engine.apollographql.com) and copy the API key
- [  ] replace `process.env.ENGINE_API_KEY` on line 17 of `apollo-engine-example/index.js` with the key from the previous step
- [  ] run `npm install` in the apollo-engine-example folder
- [  ] run `npm start` in the apollo-engine-example folder
- [  ] open [GraphiQL](http://localhost:3000/graphiql) to run the following query:

```graphql
query DroidWithTracing {
  droid(id: "2001") {
    id
    name
    appearsIn
    friends {
      __typename
      id
      name
    }
  }
}
```
### View in Engine

Now you should be able to open the service in [Engine](https://engine.apollographql.com) to see trace data!
