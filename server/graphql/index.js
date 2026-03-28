const Resource = require('../models/resource');

const typeDefs = `#graphql
  type Specifications {
    formFactor: String
    capacity: String
    voltage: String
    power: String
    waveType: String
    inputVoltage: String
  }

  type Resource {
    _id: ID!
    title: String!
    category: String!
    brand: String
    model: String
    price: Float     
    imageUrl: String
    specifications: Specifications
    description: String
  }

  type Query {
    getResources: [Resource]
    getResource(id: ID!): Resource
  }

  type Mutation {
    addResource(title: String!, category: String!, brand: String!, model: String!, price: Float!, imageUrl: String, description: String): Resource
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