import mongoose from "mongoose"

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

// Index for faster queries
adminSchema.index({ email: 1 })
adminSchema.index({ isActive: 1 })

export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema)
