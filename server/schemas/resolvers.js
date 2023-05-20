const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        try {
          const userData = await User.findOne({
            _id: context.user._id,
          })
            .select("-__v-password")
            .populate("books");

          return userData;
        } catch (err) {
          console.log(err);
        }
      }
      throw new AuthenticationError("Log in first");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },

    loginUser: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("Invalid Login");
        }
        const correctPassword = await user.isCorrectPassword(password);

        if (!correctPassword) {
          throw new AuthenticationError("Invalid Login");
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },

    saveBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args.input } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
        }
      }
      throw new AuthenticationError("Unable to save book");
    },

    removeBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
        }
      }
      throw new AuthenticationError("Unable to delete book");
    },
  },
};
module.exports = resolvers;
