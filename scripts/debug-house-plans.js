
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const HousePlanSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        area: { type: String, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        style: { type: String, required: true },
    },
    { timestamps: true }
);

const HousePlan = mongoose.models.HousePlan || mongoose.model("HousePlan", HousePlanSchema);

async function inspectData() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env.local');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const plans = await HousePlan.find({});
        console.log(`Found ${plans.length} house plans:`);
        plans.forEach(plan => {
            console.log(`- ID: ${plan._id}, Name: "${plan.name}", Type: "${plan.type}" (Length: ${plan.type.length}), Style: "${plan.style}" (Length: ${plan.style.length})`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

inspectData();
