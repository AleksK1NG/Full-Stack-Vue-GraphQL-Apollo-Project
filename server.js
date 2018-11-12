const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

// Import Environments and Mongoose Models
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to MLab Database
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('DB Connected'))
  .catch(err => console.error(err));

// Verify jwt token passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session has end, Please login again.'
      );
    }
  }
};

// Create Apollo/GraphQL Server using typeDefs, resolvers and context object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers['authorization'];

    return {
      User,
      Post,
      currentUser: await getUser(token)
    };
  },
  formatError: error => {
    return { name: error.name, message: error.message.replace('Content creation failed', '') };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server Listening ${url}`);
});
