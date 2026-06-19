require("dotenv").config({ path: ".env.local" })
const mongoose = require("mongoose")
const User = require("../models/User")

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    const exists = await User.findOne({ email: "admin@bansangfun.com" })
    if (exists) {
      console.log("⚠️ Admin already exists")
      process.exit(0)
    }

    await User.create({
      email: "admin@bansangfun.com",
      password: "admin123",
      name: "ผู้ดูแลระบบ",
      role: "admin",
    })

    console.log("✅ Admin created successfully")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

createAdmin()
