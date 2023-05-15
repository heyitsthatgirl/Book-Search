// import the necessary components
const express = require("express");
const path = require("path");

const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");

const { authMiddleware } = require("./utils/auth");

const db = require("./config/connection");
const routes = require("./routes");

// checks to see if a port is defined by heroku and if not, defaults to 3001
const PORT = process.env.PORT || 3001;
// creates an instance of the Express application
const app = express();

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async () => {
  // creates new instance of ApolloServer
  const server = new ApolloServer({
    // server accepts object containing typeDefs & resolvers as a parameter
    typeDefs,
    resolvers,
    // context allows authMiddleware to be executed for each resolver
    context: authMiddleware,
  });
  // 'await' starts the ApolloServer asynchronously
  await server.start();
  // applies middlware to the express app so it can handle GraphQL requests
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  // call function to start server
};
startApolloServer();

// 'once' method sets an eventlistener to execute a function when the database is opened
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});
