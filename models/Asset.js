// models/Asset.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: {type: String },
    purchaseDate: { type: Date },
    value: { type: Number },
    depreciationRate: { type: Number }, // Optional, could represent annual depreciation rate
    usageRate: { type: Number } // Cost of using the asset per unit/measurable metric
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
