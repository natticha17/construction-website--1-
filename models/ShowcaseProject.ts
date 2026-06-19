import mongoose from "mongoose"

const ShowcaseProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        housePlanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HousePlan",
        },
        location: String,
        description: String,
        images: [String],
        completionDate: Date,
        price: Number,
        bedrooms: Number,
        bathrooms: Number,
        kitchens: Number,
        livingRooms: Number,
        parking: Number,
        area: Number,
        ownerName: String,
        subImages: [String],
    },
    { timestamps: true }
)

// Force model cleanup to ensure schema updates work in dev mode
if (mongoose.models.ShowcaseProject) {
    delete mongoose.models.ShowcaseProject
}

export default mongoose.model("ShowcaseProject", ShowcaseProjectSchema)
