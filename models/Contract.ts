import mongoose from "mongoose"

const AddressSchema = new mongoose.Schema({
    houseNo: String,
    village: String,
    road: String,
    subDistrict: String, // Tambon
    district: String,    // Amphoe
    province: String
}, { _id: false });

const ContractSchema = new mongoose.Schema(
    {
        contractNumber: String,
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        customerName: String,
        customerAddress: String, // Legacy string address
        customerAddressStructured: AddressSchema,
        customerPhone: String,
        contractorName: { type: String, default: "นายอาคม เจริญผล" },
        contractorAddress: String,
        contractorAddressStructured: AddressSchema,

        quotationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quotation",
        },
        housePlanName: String,
        houseImage: String,
        floorPlanImages: [String],

        projectName: { type: String, required: true },
        projectDetails: String,
        projectLocation: String, // Legacy string address
        projectLocationStructured: AddressSchema,

        contractSignedDate: Date, // New: Date shown in header

        contractValue: Number,
        constructionPeriod: String,
        startDate: Date,
        endDate: Date,

        // Material List from Quotation
        items: [{
            id: String,
            category: String,
            materialName: String,
            quantity: Number,
            unit: String,
            materialPrice: Number,
            laborPrice: Number,
            pricePerUnit: Number,
            totalPrice: Number
        }],

        // Cost Summary
        totalMaterial: { type: Number, default: 0 },
        totalLabor: { type: Number, default: 0 },

        // New: Dynamic Installments
        installments: [{
            installmentNumber: Number,
            amount: Number,
            dueDate: String, // Can be date or text description (e.g. "within 7 days of...")
            description: String,
            tasks: [String]
        }],

        // New: Legal Conditions
        warrantyDetails: String,
        finePolicy: String,
        amendmentPolicy: String,

        status: {
            type: String,
            enum: ["pending", "accepted", "completed"],
            default: "pending",
        },
        acceptedAt: Date,
    },
    { timestamps: true }
)

ContractSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete (ret as any)._id
        delete (ret as any).__v
    },
})

// Force model refresh to ensure schema updates are applied
if (mongoose.models.Contract_v2) {
    delete mongoose.models.Contract_v2
}

export default mongoose.model("Contract_v2", ContractSchema, "contracts")
