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
        enum: ['battery', 'inverter', 'solar_panel', 'bms', 'accessories'],
        default: 'battery'
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },

    specifications: {
        type: Object,
        default: {}
    },
    description: { type: String },
    inStock: { type: Boolean, default: true },

    imageUrl: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);