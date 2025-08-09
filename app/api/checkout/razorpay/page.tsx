"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Define Razorpay interface based on docs
interface RazorpayPrefill {
  name: string;
  email: string;
  contact: string;
}

interface RazorpayTheme {
  color: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount?: number; // in paise
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: any) => void;
  prefill: RazorpayPrefill;
  theme: RazorpayTheme;
}

export default function RazorpayCheckout() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Invalid order ID",
        variant: "destructive",
      });
      return;
    }

    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Client-side safe public key
        currency: "INR",
        order_id: orderId,
        name: "Your Store Name",
        description: "Order Payment",
        handler: function (response: any) {
          // Handle successful payment
          window.location.href = `/checkout/success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`;
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Fetch order details to populate amount and customer info
      fetch(`/api/order?orderId=${orderId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            options.amount = data.order.amount; // ✅ now allowed
            options.prefill.name = data.order.notes?.customer_name || "";
            options.prefill.email = data.order.notes?.customer_email || "";
            options.prefill.contact = data.order.notes?.customer_contact || "";

            // Initialize Razorpay checkout
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          } else {
            toast({
              title: "Error",
              description: "Failed to load order details",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          toast({
            title: "Error",
            description: "Failed to initiate payment",
            variant: "destructive",
          });
        });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [orderId, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Processing Payment...</h1>
        <p className="text-gray-600">
          Please wait while we load the payment gateway.
        </p>
      </div>
    </div>
  );
}
