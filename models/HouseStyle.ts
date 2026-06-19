
import mongoose, { Schema } from "mongoose"

const HouseStyleSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
)

export default mongoose.models.HouseStyle || mongoose.model("HouseStyle", HouseStyleSchema)
