
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const HousePlanSchema = new mongoose.Schema({}, { strict: false });
const HousePlan = mongoose.models.HousePlan || mongoose.model("HousePlan", HousePlanSchema);

async function repairData() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const plans = await HousePlan.find({});
        console.log(`Found ${plans.length} plans to check.`);

        let updatedCount = 0;

        for (const plan of plans) {
            let needsUpdate = false;
            const currentType = plan.get('type');
            const currentStyle = plan.get('style');

            if (!currentType) {
                console.log(`Plan ${plan._id} missing type. Setting to "แบบบ้าน 1 ชั้น"`);
                plan.set('type', 'แบบบ้าน 1 ชั้น');
                needsUpdate = true;
            } else if (currentType === "1 ชั้น") { // Catch old values too just in case
                plan.set('type', 'แบบบ้าน 1 ชั้น');
                needsUpdate = true;
            } else if (currentType === "1.5 ชั้น") {
                plan.set('type', 'แบบบ้าน 1.5 ชั้น');
                needsUpdate = true;
            } else if (currentType === "2 ชั้น") {
                plan.set('type', 'แบบบ้าน 2 ชั้น');
                needsUpdate = true;
            }

            if (!currentStyle) {
                console.log(`Plan ${plan._id} missing style. Setting to "Modern Style"`);
                plan.set('style', 'Modern Style');
                needsUpdate = true;
            }

            if (needsUpdate) {
                await plan.save();
                updatedCount++;
            }
        }

        console.log(`Repair complete. Updated ${updatedCount} plans.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

repairData();
