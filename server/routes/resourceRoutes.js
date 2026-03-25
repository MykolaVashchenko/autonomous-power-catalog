const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const resource = new Resource({
        title: req.body.title,
        category: req.body.category,
        brand: req.body.brand,
        price: req.body.price,
        specifications: req.body.specifications,
        description: req.body.description
    });

    try {
        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedResource) return res.status(404).json({ message: 'Item was not found' });
        res.json(updatedResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedResource = await Resource.findByIdAndDelete(req.params.id);

        if (!deletedResource) {
            return res.status(404).json({ message: 'Item was not found' });
        }

        res.json({ message: 'Item was deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;