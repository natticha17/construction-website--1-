
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const HousePlanSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        style: { type: String, required: true },
    },
    { strict: false } // flexible schema for migration
);

const HousePlan = mongoose.models.HousePlan || mongoose.model("HousePlan", HousePlanSchema);

async function migrateData() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env.local');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const mappings = {
            "1 ชั้น": "แบบบ้าน 1 ชั้น",
            "1.5 ชั้น": "แบบบ้าน 1.5 ชั้น",
            "2 ชั้น": "แบบบ้าน 2 ชั้น"
        };

        const plans = await HousePlan.find({});
        console.log(`Found ${plans.length} plans to check.`);

        let updatedCount = 0;

        for (const plan of plans) {
            if (mappings[plan.type]) {
                console.log(`Updating "${plan.type}" to "${mappings[plan.type]}" for plan ID: ${plan._id}`);
                plan.type = mappings[plan.type];
                await plan.save();
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} plans.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

migrateData();
