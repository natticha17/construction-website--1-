import mongoose from "mongoose"

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
})

const ProjectProgressSchema = new mongoose.Schema(
    {
        contractId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contract",
            required: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        projectName: String,
        overallProgress: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["pending", "progress", "completed"],
            default: "progress",
        },
        milestones: [MilestoneSchema],
    },
    { timestamps: true }
)

ProjectProgressSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete (ret as any)._id
        delete (ret as any).__v
    },
})

// Force model refresh to update enum values
if (mongoose.models.ProjectProgress) {
    delete (mongoose.models as any).ProjectProgress
}

export default mongoose.model("ProjectProgress", ProjectProgressSchema)
