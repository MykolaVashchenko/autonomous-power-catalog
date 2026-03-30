const Resource = require('../models/Resource');

const typeDefs = `#graphql
  type Resource {
    _id: ID!
    name: String!
    target: String!
    bodyPart: String!
    equipment: String!
    difficulty: String!
    secondaryMuscles: [String]
    exerciseTypes: [String]
    overview: String!
    instructions: [String]
    gifUrl: String!
    cardImageUrl: String!
    youtubeLink: String
    isActive: Boolean
  }

  type Query {
    getResources: [Resource]
    getResource(id: ID!): Resource
  }

  type Mutation {
    addResource(name: String!, target: String!, bodyPart: String!, equipment: String!, difficulty: String!, secondaryMuscles: [String],exerciseTypes: [String], overview: String!, instructions: [String], gifUrl: String!, cardImageUrl: String!, youtubeLink: String): Resource
    deleteResource(id: ID!): String
    toggleResourceStatus(id: ID!): Resource
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
        },
        toggleResourceStatus: async (_, { id }) => {
            const resource = await Resource.findById(id);
            resource.isActive = !resource.isActive;
            return await resource.save();
        }
    }
};

module.exports = { typeDefs, resolvers };