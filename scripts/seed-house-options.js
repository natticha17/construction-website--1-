
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Define Schemas locally for script execution
const HouseTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const HouseStyleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const HouseType = mongoose.models.HouseType || mongoose.model("HouseType", HouseTypeSchema);
const HouseStyle = mongoose.models.HouseStyle || mongoose.model("HouseStyle", HouseStyleSchema);

const INITIAL_TYPES = ["1 ชั้น", "1.5 ชั้น", "2 ชั้น"];
const INITIAL_STYLES = ["Modern", "Contemporary"];

async function seed() {
    if (!process.env.MONGODB_URI) { console.error("Missing MONGODB_URI"); process.exit(1); }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Seed Types
        for (const name of INITIAL_TYPES) {
            const exists = await HouseType.findOne({ name });
            if (!exists) {
                await HouseType.create({ name });
                console.log(`Created Type: ${name}`);
            } else {
                console.log(`Type exists: ${name}`);
            }
        }

        // Seed Styles
        for (const name of INITIAL_STYLES) {
            const exists = await HouseStyle.findOne({ name });
            if (!exists) {
                await HouseStyle.create({ name });
                console.log(`Created Style: ${name}`);
            } else {
                console.log(`Style exists: ${name}`);
            }
        }

        console.log("Seeding completed.");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seed();
