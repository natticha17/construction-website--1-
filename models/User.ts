import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: String,
        phone: String,
        address: String, // Keep for backward compatibility or summary
        houseNo: String,
        village: String,
        road: String,
        subDistrict: String,
        district: String,
        province: String,
        customerType: {
            type: String,
            enum: ["general", "project_owner"],
            default: "general",
        },
        role: {
            type: String,
            enum: ["admin", "customer"],
            required: true,
            default: "customer",
        },
    },
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
