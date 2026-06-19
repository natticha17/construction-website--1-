import mongoose, { Schema } from "mongoose"

const HousePlanSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    area: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    kitchens: { type: Number, default: 1 },
    livingRooms: { type: Number, default: 1 },
    parking: { type: Number, default: 1 },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      default: "1 ชั้น"
    },
    style: {
      type: String,
      required: true,
      default: "Modern"
    },
    floorPlanImages: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
)

// Ensure virtual fields are serialized
HousePlanSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete (ret as any)._id
    delete (ret as any).__v
  },
})

// Force model cleanup to ensure schema updates work
if (mongoose.models.HousePlan) {
  delete mongoose.models.HousePlan
}

export default mongoose.model("HousePlan", HousePlanSchema)
