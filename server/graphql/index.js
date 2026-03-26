const Resource = require('../models/resource');

const typeDefs = `#graphql
  type Specifications {
    voltage: Int
    capacity: String
    weight: Float
  }

  type Resource {
    id: ID!
    title: String!
    category: String!
    brand: String!
    price: Float!
    specifications: Specifications
    description: String
  }

  type Query {
    getResources: [Resource]
    getResource(id: ID!): Resource
  }

  type Mutation {
    addResource(title: String!, category: String!, brand: String!, price: Float!, description: String): Resource
    deleteResource(id: ID!): String
  }
`;

const resolvers = {
    Query: {
        getResources: async () => {
            return await Resource.find();
        },
        getResource: async (_, { id }) => {
            return await Resource.findById(id);
        }
    },
    Mutation: {
        addResource: async (_, args) => {
            const newResource = new Resource(args);
            return await newResource.save();
        },
        deleteResource: async (_, { id }) => {
            await Resource.findByIdAndDelete(id);
            return "Item was successfully deleted.";
        }
    }
};

module.exports = { typeDefs, resolvers };