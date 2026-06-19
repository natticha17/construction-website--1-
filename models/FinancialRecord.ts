import mongoose from "mongoose"

const FinancialRecordSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProjectProgress",
            required: true
        },
        projectName: String,
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        category: String,
        description: String,
        amount: Number,
        date: Date,
        referenceId: String, // Store milestone ID for syncing
        receiptImage: String,
    },
    { timestamps: true }
)

FinancialRecordSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete (ret as any)._id
        delete (ret as any).__v
    },
})

// Force model refresh to update schema
if (mongoose.models.FinancialRecord) {
    delete (mongoose.models as any).FinancialRecord
}

export default mongoose.model("FinancialRecord", FinancialRecordSchema)
