"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCart, CartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetchUser() {
      try {
        const authRes = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (!authRes.ok) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);

        const userRes = await fetch("/api/auth/user", {
          credentials: "include",
        });
        if (userRes.ok) {
          const user = await userRes.json();
          setName(user.name || "");
          setEmail(user.email || "");
          setContact(user.phone || "");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    }
    checkAuthAndFetchUser();
  }, []);

  // Calculate total with integers only
  const calculateTotal = () => {
    const subtotal = Math.floor(getTotalPrice()); // floor subtotal
    const shipping = 50;
    const tax = Math.floor(subtotal * 0.18);
    return subtotal + shipping + tax;
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      toast({ title: "Valid email is required", variant: "destructive" });
      return;
    }
    if (!contact || !/^\+?\d{10,15}$/.test(contact)) {
      toast({
        title: "Valid contact number is required",
        description: "Phone number should be 10-15 digits, e.g., +919999999999",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = calculateTotal() * 100; // totalAmount in paise, integer only
      const customer = { name, email, contact };
      const payload = {
        items: items.map((item: CartItem) => ({
          productId: item.id,
          name: item.name,
          price: Math.floor(item.price), // integer price
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount,
        customer,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("Checkout Request:", {
        url: res.url,
        status: res.status,
        statusText: res.statusText,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Checkout error response body:", text);
        let errorData;
        try {
          errorData = text.trim() ? JSON.parse(text) : {};
        } catch {
          throw new Error(`Checkout failed: Invalid response format (Status: ${res.status})`);
        }
        throw new Error(errorData.message || `Checkout failed with status ${res.status}`);
      }

      const data = await res.json();
      if (!data || typeof data !== "object") {
        throw new Error("Checkout failed: Invalid response data");
      }

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || "No payment URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error.message);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast({ title: "Cart cleared" });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto mb-6 text-gray-400" size={96} />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products yet.</p>
          <Link href="/dashboard">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items ({items.length})</h2>
              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center gap-4 border rounded p-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">₹{Math.floor(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{Math.floor(item.price * item.quantity)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{Math.floor(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹50</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{Math.floor(getTotalPrice() * 0.18)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+919999999999"
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing || !isAuthenticated}
              >
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <Button variant="outline" className="w-full mt-2" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
