const Resource = require('../models/Resource');

const createResource = async (req, res) => {
    try {
        const { title, description, category, specifications, brand, model, price } = req.body;

        const parsedSpecs = specifications ? JSON.parse(specifications) : {};
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newResource = new Resource({
            title,
            description,
            category,
            brand,
            model,
            price,
            specifications: parsedSpecs,
            imageUrl
        });

        await newResource.save();

        res.status(201).json({ message: 'Товар успішно додано!', resource: newResource });
    } catch (e) {
        console.error("Помилка при додаванні товару:", e);
        res.status(500).json({ message: 'Помилка на сервері при додаванні товару' });
    }
};

module.exports = { createResource };