import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface OrderDoc extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  razorpayPaymentLinkId?: string; // Changed from razorpayOrderId
  paymentUrl?: string;
  shippingAddress?: ShippingAddress;
  customer: { name: string; email: string; contact: string };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentId: String,
    razorpayPaymentLinkId: String, // Changed from razorpayOrderId
    paymentUrl: String,
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      contact: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Order =
  (models.Order as mongoose.Model<OrderDoc>) || model<OrderDoc>('Order', OrderSchema);