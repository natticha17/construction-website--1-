require("dotenv").config({ path: ".env.local" })
const mongoose = require("mongoose")
const User = require("../models/User")

async function createCustomer() {
  await mongoose.connect(process.env.MONGODB_URI)

  const exists = await User.findOne({ email: "customer@example.com" })
  if (exists) {
    console.log("⚠️ Customer already exists")
    return process.exit(0)
  }

  await User.create({
    email: "customer@example.com",
    password: "customer123",
    name: "ลูกค้าทดสอบ",
    role: "customer",
  })

  console.log("✅ Customer created")
  process.exit(0)
}

createCustomer()
