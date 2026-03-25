const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Battery', 'Inverter', 'Solar Panel', 'BMS', 'Accessories'], // Обмеження категорій
        default: 'Battery'
    },
    brand: { type: String, required: true },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    specifications: {
        voltage: { type: Number },
        capacity: { type: String },
        weight: { type: Number }
    },
    description: { type: String },
    inStock: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);