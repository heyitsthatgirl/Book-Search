const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: id
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Books]
  }
  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth

    addUser(username: String!, email: String!, password: String!): Auth

    saveBook(
      authors: [String]
      description: String!
      bookId: String!
      image: String
      link: String
    ): User

    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
