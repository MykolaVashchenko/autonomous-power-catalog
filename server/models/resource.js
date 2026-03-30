const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    target: { type: String, required: true },
    bodyPart: { type: String, required: true },
    equipment: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    instructions: { type: [String], required: true },
    secondaryMuscles: { type: [String], default: [] },
    exerciseTypes: { type: [String], default: [] },
    overview: { type: String, required: true },
    cardImageUrl: { type: String, required: true },
    gifUrl: { type: String, required: true },

    youtubeLink: { type: String, trim: true },
    isActive: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);