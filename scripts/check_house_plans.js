
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const dns = require("dns");

// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Relaxed schema to allow seeing everything
const HousePlanSchema = new mongoose.Schema({
}, { strict: false, timestamps: true });

const HousePlan = mongoose.models.HousePlan || mongoose.model("HousePlan", HousePlanSchema);

async function run() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is missing");
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const plans = await HousePlan.find({});
    console.log(`Found ${plans.length} plans`);

    plans.forEach(p => {
        const doc = p.toObject();
        console.log("--- Plan ---");
        console.log("ID:", doc._id);
        console.log("Name:", doc.name);
        console.log("Type:", doc.type, "(type of:", typeof doc.type + ")");
        console.log("Style:", doc.style, "(type of:", typeof doc.style + ")");

        if (typeof doc.type === 'string') {
            console.log("Type Hex:", Buffer.from(doc.type).toString('hex'));
        }
        if (typeof doc.style === 'string') {
            console.log("Style Hex:", Buffer.from(doc.style).toString('hex'));
        }
    });

    process.exit(0);
}

run().catch(console.error);
