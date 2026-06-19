import mongoose from "mongoose"

const QuotationItemSchema = new mongoose.Schema({
  category: { type: String, default: "อนื่นๆ" }, // BOQ Category
  materialName: String,
  quantity: Number,
  unit: String,
  materialPrice: { type: Number, default: 0 }, // Material Cost per Unit
  laborPrice: { type: Number, default: 0 },    // Labor Cost per Unit
  pricePerUnit: Number, // Legacy support / Display total per unit if needed
  totalPrice: Number,   // (materialPrice + laborPrice) * quantity
})

const QuotationSchema = new mongoose.Schema(
  {
    quotationNumber: String,
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: String, // Denormalized for convenience
    housePlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HousePlan",
      required: true
    },
    housePlanName: String,
    houseImage: String,
    floorPlanImages: [String],
    area: Number,
    budget: String,
    additionalRequirements: String,
    items: [QuotationItemSchema],

    // Cost Summary
    totalMaterial: { type: Number, default: 0 }, // Sum of all items material cost
    totalLabor: { type: Number, default: 0 },    // Sum of all items labor cost

    laborCost: Number,     // Legacy / Override if needed
    operationCost: Number, // Overhead (e.g. 15%)
    tax: Number,
    subtotal: Number,
    grandTotal: Number,

    notes: String,
    conditions: String,
    revisionNote: String,
    status: {
      type: String,
      enum: ["pending", "proposed", "approved", "rejected", "revision_requested", "revised"],
      default: "pending",
    },
  },
  { timestamps: true }
)

QuotationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete (ret as any)._id
    delete (ret as any).__v
  },
})

// Force delete model in development to ensure schema updates are applied
if (process.env.NODE_ENV === "development") {
  delete (mongoose.models as any).Quotation
}

const Quotation = mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema)
export default Quotation
