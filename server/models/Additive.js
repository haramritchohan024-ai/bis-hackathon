const mongoose = require('mongoose');

const AdditiveSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // E.g., "E300", "INS 300"
    name: { type: String, required: true },
    category: { type: String }, // Preservative, Color, etc.
    typicalUse: { type: String },
    safetyStatus: { type: String, enum: ['Permitted', 'Restricted', 'Controversial', 'Banned', 'Unknown'], default: 'Unknown' },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    groupWarnings: { type: Map, of: String, default: {} }, // Key: tag (e.g. "BP"), Value: Warning message
    description: { type: String } // Renamed from notes or serving as description
}, { timestamps: true });

module.exports = mongoose.model('Additive', AdditiveSchema);
