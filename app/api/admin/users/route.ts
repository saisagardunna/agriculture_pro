import mongoose, { Schema, model, models, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  role: "customer" | "admin"
  createdAt: Date
  updatedAt: Date
  isEmailVerified: boolean
  isPhoneVerified: boolean
  lastLogin?: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
})

export const User = models.User || model<IUser>("User", UserSchema)
