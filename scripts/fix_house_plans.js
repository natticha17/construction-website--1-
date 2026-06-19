
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// No defaults here, to detect missing values
const HousePlanSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String },
        style: { type: String },
    },
    { timestamps: true, strict: false }
);

const HousePlan = mongoose.models.HousePlan || mongoose.model("HousePlan", HousePlanSchema);

async function run() {
    if (!process.env.MONGODB_URI) { console.error("Missing URI"); process.exit(1); }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected");

    const plans = await HousePlan.find({});
    for (const p of plans) {
        let dirty = false;
        // Check if value is missing or null
        if (!p.type) {
            console.log(`Fixing type for ${p.name}`);
            p.type = "1 ชั้น";
            dirty = true;
        }
        if (!p.style) {
            console.log(`Fixing style for ${p.name}`);
            p.style = "Modern Style";
            dirty = true;
        }
        if (dirty) {
            await HousePlan.updateOne({ _id: p._id }, { $set: { type: p.type, style: p.style } });
            console.log("Saved.");
        }
    }
    console.log("Done");
    process.exit(0);
}
run().catch(console.error);
