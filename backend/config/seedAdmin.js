import bcrypt from "bcryptjs";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Admin";

    if (!email || !password) {
      console.log("⚠️  ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("ℹ️  Admin user already exists:", email);
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role: "admin" });

    console.log("✅ Seeded admin user:", email);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
};

export default seedAdmin;







