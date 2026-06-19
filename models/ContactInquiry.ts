import mongoose from "mongoose"

const ContactInquirySchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    message: String,
    status: {
      type: String,
      enum: ["new", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
)

ContactInquirySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete (ret as any)._id
    delete (ret as any).__v
  },
})

export default mongoose.models.ContactInquiry ||
  mongoose.model("ContactInquiry", ContactInquirySchema)
