const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Additive = require('../models/Additive');
const additivesData = require('../data/additives.json');

dotenv.config();

const seedAdditives = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        const count = await Additive.countDocuments();
        if (count === 0) {
            console.log('Seeding Additives...');
            // Transform data if needed to match new schema structure (groupWarnings)
            // Assuming json is already updated or we map it here
            const info = await Additive.insertMany(additivesData);
            console.log(`Seeded ${info.length} additives.`);
        } else {
            console.log(`Additives already exist (${count}). Skipping seed.`);
        }
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedAdditives();
