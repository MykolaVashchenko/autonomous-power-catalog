const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

router.get('/', async (req, res) => {
    try {
        const filter = req.query.role === 'admin' ? {} : { isActive: true };
        const resources = await Resource.find(filter);
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/toggle-status', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        resource.isActive = !resource.isActive;
        await resource.save();

        res.json({ message: 'Status updated successfully', resource });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newResource = new Resource({
            name: req.body.name,
            target: req.body.target,
            bodyPart: req.body.bodyPart,
            equipment: req.body.equipment,
            difficulty: req.body.difficulty,
            secondaryMuscles: req.body.secondaryMuscles,
            exerciseTypes: req.body.exerciseTypes,
            overview: req.body.overview,
            instructions: req.body.instructions,
            gifUrl: req.body.gifUrl,
            cardImageUrl: req.body.cardImageUrl,
            youtubeLink: req.body.youtubeLink,
            isActive: false
        });

        const savedResource = await newResource.save();
        res.status(201).json(savedResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const existingResource = await Resource.findById(req.params.id);
        if (!existingResource) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        const updateData = {
            name: req.body.name,
            target: req.body.target,
            bodyPart: req.body.bodyPart,
            equipment: req.body.equipment,
            difficulty: req.body.difficulty,
            secondaryMuscles: req.body.secondaryMuscles,
            exerciseTypes: req.body.exerciseTypes,
            overview: req.body.overview,
            instructions: req.body.instructions,
            gifUrl: req.body.gifUrl,
            cardImageUrl: req.body.cardImageUrl,
            youtubeLink: req.body.youtubeLink
        };

        const updatedResource = await Resource.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        await Resource.findByIdAndDelete(req.params.id);

        res.json({ message: 'Exercise deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Exercise not found' });
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;