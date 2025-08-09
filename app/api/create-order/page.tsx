"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const PaymentPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const AMOUNT = 100; // INR (for testing)

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Fetch user data (replace with actual user data from your auth system)
      const customer = {
        name: "John Doe", // Replace with authenticated user data
        email: "johndoe@example.com",
        contact: "+919999999999",
      };

      // Call backend to create order and get payment link
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include Authorization header if needed
        },
        credentials: "include",
        body: JSON.stringify({
          items: [{ name: "Sample Item", qty: 1, price: AMOUNT, productId: "sample_id" }],
          totalAmount: AMOUNT * 100, // Convert to paise
          customer,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to create order");
      }

      const data = await res.json();
      if (!data.paymentUrl) {
        throw new Error("No payment URL returned from server");
      }

      // Redirect to Razorpay payment link
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Something went wrong");
      toast({
        title: "Payment Error",
        description: err.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
        <p className="mb-4">Amount to pay: ₹{AMOUNT}</p>
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;