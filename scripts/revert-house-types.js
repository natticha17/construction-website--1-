
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const HousePlanSchema = new mongoose.Schema({}, { strict: false });
const HousePlan = mongoose.models.HousePlan || mongoose.model("HousePlan", HousePlanSchema);

async function revertData() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const plans = await HousePlan.find({});
        console.log(`Found ${plans.length} plans.`);

        const mappings = {
            "แบบบ้าน 1 ชั้น": "1 ชั้น",
            "แบบบ้าน 1.5 ชั้น": "1.5 ชั้น",
            "แบบบ้าน 2 ชั้น": "2 ชั้น"
        };

        let updatedCount = 0;

        for (const plan of plans) {
            const type = plan.get('type');
            if (mappings[type]) {
                console.log(`Reverting "${type}" to "${mappings[type]}" on ${plan._id}`);
                plan.set('type', mappings[type]);
                await plan.save();
                updatedCount++;
            }
        }

        console.log(`Revert complete. Updated ${updatedCount} plans.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

revertData();
