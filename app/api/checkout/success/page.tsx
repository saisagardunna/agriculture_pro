"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase! Your order ID is {orderId || "N/A"}.
        {paymentId && ` Payment ID: ${paymentId}.`}
      </p>
      <Link href="/dashboard">
        <Button size="lg">Continue Shopping</Button>
      </Link>
    </div>
  </div>
  );
}