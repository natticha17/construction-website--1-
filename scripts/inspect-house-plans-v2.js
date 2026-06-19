
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const HousePlanSchema = new mongoose.Schema({}, { strict: false });
const HousePlan = mongoose.models.HousePlan || mongoose.model("HousePlan", HousePlanSchema);

async function inspectData() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const plans = await HousePlan.find({});
        console.log(`Found ${plans.length} plans:`);

        plans.forEach(plan => {
            const type = plan.get('type');
            const style = plan.get('style');
            console.log(`ID: ${plan._id}`);
            console.log(`   Type: ${type === undefined ? 'UNDEFINED' : `"${type}"`}`);
            console.log(`   Style: ${style === undefined ? 'UNDEFINED' : `"${style}"`}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

inspectData();
