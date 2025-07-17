const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Define the Admin schema and model directly in the script for simplicity
// In a real application, you would import it from your models directory
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin", "super_admin"],
    },
    permissions: [
      {
        type: String,
        enum: [
          "manage_products",
          "manage_orders",
          "manage_users",
          "view_analytics",
          "manage_categories",
          "manage_admins",
          "system_settings",
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
    },
    department: {
      type: String,
      enum: ["products", "sales", "marketing", "support", "management"],
      default: "management",
    },
  },
  {
    timestamps: true,
  },
)

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema)

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://damerasrimanthreddy:1234@agri.4aqzbx2.mongodb.net/?retryWrites=true&w=majority&appName=agri"

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    const email = "saisagardunna2004@gmail.com"
    const password = "Saisagar@123" // This will be hashed
    const name = "Saisagar Dunna"

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists. Skipping creation.`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      permissions: [
        "manage_products",
        "manage_orders",
        "manage_users",
        "view_analytics",
        "manage_categories",
        "manage_admins",
        "system_settings",
      ],
      isActive: true,
      createdAt: new Date(),
    })

    console.log(`Admin user "${admin.email}" created successfully!`)
  } catch (error) {
    console.error("Error seeding admin:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

seedAdmin()
