const Resource = require('../models/Resource');

const createResource = async (req, res) => {
    try {
        const {
            name,
            target,
            bodyPart,
            equipment,
            difficulty,
            secondaryMuscles,
            exerciseTypes,
            overview,
            instructions,
            gifUrl,
            cardImageUrl,
            youtubeLink
        } = req.body;

        const newResource = new Resource({
            name,
            target,
            bodyPart,
            equipment,
            difficulty,
            secondaryMuscles,
            exerciseTypes,
            overview,
            instructions,
            gifUrl,
            cardImageUrl,
            youtubeLink,
            isActive: false
        });

        const savedResource = await newResource.save();

        res.status(201).json({ message: 'Exercise successfully added', resource: savedResource });
    } catch (error) {
        console.error("Error adding exercise:", error);
        res.status(500).json({ message: 'Server error while adding exercise' });
    }
};

module.exports = { createResource };