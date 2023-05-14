// import the necessary components
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const routes = require("./routes");

// creates an instance of the Express application
const app = express();

// checks to see if a port is defined by heroku and if not, defaults to 3001
const PORT = process.env.PORT || 3001;

// creates new instance of ApolloServer
const server = new ApolloServer({
  // server accepts object containing typeDefs & resolvers as a parameter
  typeDefs,
  resolvers,
  // context allows authMiddleware to be executed for each resolver
  context: authMiddleware,
});

// adds middleware to express app so it can parse URL-encoded data from incoming requests
// 'extended: true' allows the parsing of nested objects
app.use(express.urlencoded({ extended: true }));

// adds middleware to express app for parsing JSON data from incoming requests
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// applying routes middleware to the express app
app.use(routes);

const startApolloServer = async (typeDefs, resolvers) => {
  // 'await' starts the ApolloServer asynchronously
  await server.start();
  // applies middlware to the express app so it can handle GraphQL requests
  server.applyMiddleware({ app });

  // 'once' method sets an eventlistener to execute a function when the database is opened
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// call function to start server
startApolloServer(typeDefs, resolvers);
