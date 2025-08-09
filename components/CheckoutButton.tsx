"use client";

import React from "react";

// Interfaces for type safety
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Customer {
  name: string;
  email: string;
  contact: string;
}

interface CheckoutButtonProps {
  cartItems: CartItem[];
  totalAmount: number;
  customer: Customer;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ cartItems, totalAmount, customer }) => {
  const proceedToCheckout = async (cartItems: CartItem[], totalAmount: number, customer: Customer) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, totalAmount, customer }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect user to Razorpay rzp.io link
        window.location.href = data.paymentUrl;
      } else {
        alert("Failed to create payment link");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded"
      onClick={() => proceedToCheckout(cartItems, totalAmount, customer)}
    >
      Proceed to Checkout
    </button>
  );
};

export default CheckoutButton;
