
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
let mongoUri = process.env.MONGODB_URI;

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('MONGODB_URI=')) {
            mongoUri = line.substring('MONGODB_URI='.length).trim();
            // Remove quotes if present
            if ((mongoUri.startsWith('"') && mongoUri.endsWith('"')) || (mongoUri.startsWith("'") && mongoUri.endsWith("'"))) {
                mongoUri = mongoUri.slice(1, -1);
            }
            break;
        }
    }
}

if (!mongoUri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
}

const MilestoneSchema = new mongoose.Schema({
    id: String,
    phase: Number,
    description: String,
    progressPercentage: Number,
    checklist: [{
        task: String,
        completed: { type: Boolean, default: false }
    }],
    images: [String],
    updatedAt: Date,
    report: String,
    paymentAmount: Number,
    paymentStatus: {
        type: String,
        enum: ["pending", "waiting_verification", "paid"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "transfer"],
    },
    paymentSlip: String,
    transferDate: Date,
    paidAt: Date,
    checkedAt: Date,
});

const ProjectProgressSchema = new mongoose.Schema(
    {
        contractId: mongoose.Schema.Types.ObjectId,
        customerId: mongoose.Schema.Types.ObjectId,
        projectName: String,
        overallProgress: { type: Number, default: 0 },
        status: { type: String, default: "progress" },
        milestones: [MilestoneSchema],
    },
    { timestamps: true }
);

// Prevent overwriting model if it exists
const ProjectProgress = mongoose.models.ProjectProgress || mongoose.model("ProjectProgress", ProjectProgressSchema);

async function main() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to DB");

        const id = new mongoose.Types.ObjectId();
        const contractId = new mongoose.Types.ObjectId();
        const customerId = new mongoose.Types.ObjectId();

        console.log("Creating test project...");
        const created = await ProjectProgress.create({
            _id: id,
            contractId: contractId,
            customerId: customerId,
            projectName: "Test JS Project",
            milestones: [{
                id: "m1",
                phase: 1,
                description: "Test",
                progressPercentage: 100,
                paymentStatus: "paid",
                transferDate: new Date("2023-01-01"),
            }]
        });

        console.log("Created. Original Transfer Date:", created.milestones[0].transferDate);

        // Update using findByIdAndUpdate with STRING date
        const newDateStr = "2024-12-25T00:00:00.000Z";
        const updates = {
            milestones: [{
                id: "m1",
                phase: 1,
                description: "Test",
                progressPercentage: 100,
                paymentStatus: "paid",
                transferDate: newDateStr, // Pass string!
                updatedAt: new Date(),
            }]
        };

        console.log("Updating with string date:", newDateStr);

        // Using { new: true } returns the modified document BUT we want to see if it persisted in DB
        // actually findByIdAndUpdate returns the doc
        const updated = await ProjectProgress.findByIdAndUpdate(id, updates, { new: true });

        console.log("Updated doc returned from findByIdAndUpdate:");
        console.log("Transfer Date (in memory):", updated.milestones[0].transferDate);
        console.log("Type of Transfer Date:", typeof updated.milestones[0].transferDate);
        console.log("Is instance of Date?", updated.milestones[0].transferDate instanceof Date);

        // Fetch again to be sure
        const refetched = await ProjectProgress.findById(id);
        console.log("Refetched from DB:");
        console.log("Transfer Date:", refetched.milestones[0].transferDate);

        if (refetched.milestones[0].transferDate.toISOString() === newDateStr) {
            console.log("SUCCESS: Date updated correctly.");
        } else {
            console.log("FAILURE: Date mismatch.");
            console.log("Expected:", newDateStr);
            console.log("Actual:  ", refetched.milestones[0].transferDate.toISOString());
        }

        // Cleanup
        await ProjectProgress.findByIdAndDelete(id);
        console.log("Cleaned up");

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

main();
