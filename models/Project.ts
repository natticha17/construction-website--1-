import mongoose from "mongoose"

const MilestoneSchema = new mongoose.Schema({
  name: String,
  progressPercentage: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
})

const ProjectSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: String,
    overallProgress: Number,
    milestones: [MilestoneSchema],
  },
  { timestamps: true }
)

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema)
