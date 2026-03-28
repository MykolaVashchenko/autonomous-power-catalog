const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const parsedSpecs = req.body.specifications ? JSON.parse(req.body.specifications) : {};
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const resource = new Resource({
            title: req.body.title,
            category: req.body.category,
            brand: req.body.brand,
            model: req.body.model,
            price: req.body.price,
            specifications: parsedSpecs,
            description: req.body.description,
            imageUrl: imageUrl
        });

        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) {
        console.error("Помилка збереження:", err);
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const existingResource = await Resource.findById(req.params.id);
        if (!existingResource) {
            return res.status(404).json({ message: 'Товар не знайдено' });
        }

        const parsedSpecs = req.body.specifications ? JSON.parse(req.body.specifications) : {};

        const updateData = {
            title: req.body.title,
            category: req.body.category,
            brand: req.body.brand,
            model: req.body.model,
            price: req.body.price,
            specifications: parsedSpecs,
            description: req.body.description
        };

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;

            if (existingResource.imageUrl) {
                const oldFileName = path.basename(existingResource.imageUrl);
                const oldFilePath = path.join(__dirname, '../uploads', oldFileName);

                fs.unlink(oldFilePath, (err) => {
                    if (err) {
                        console.error("Не вдалося видалити старе фото з диска:", err);
                    } else {
                        console.log("Старе фото успішно замінено та видалено!");
                    }
                });
            }
        }

        const updatedResource = await Resource.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedResource);
    } catch (err) {
        console.error("Помилка при оновленні:", err);
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Item was not found' });
        }

        if (resource.imageUrl) {
            const fileName = path.basename(resource.imageUrl);

            const filePath = path.join(__dirname, '../uploads', fileName);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Не вдалося видалити файл з диска (можливо, його вже немає):", err);
                } else {
                    console.log("Файл картинки успішно видалено з сервера!");
                }
            });
        }

        await Resource.findByIdAndDelete(req.params.id);

        res.json({ message: 'Item was deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Item was not found' });
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;