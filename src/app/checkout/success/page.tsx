"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, MapPin, Phone, Mail, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image: string;
    category: string;
  } | null;
}

function SuccessReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No order reference provided.");
      setLoading(false);
      return;
    }

    async function loadReceipt() {
      try {
        setLoading(true);
        // 1. Fetch Order Header
        const { data: orderData, error: orderErr } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderErr || !orderData) {
          throw new Error(orderErr?.message || "Order not found.");
        }

        setOrder(orderData);

        // 2. Fetch Order Line Items joined with Product metadata
        const { data: itemsData, error: itemsErr } = await supabase
          .from("order_items")
          .select(`
            id,
            quantity,
            price,
            products (
              name,
              image,
              category
            )
          `)
          .eq("order_id", orderId);

        if (itemsErr) {
          console.error("Failed to load order line items:", itemsErr);
        } else if (itemsData) {
          setItems(itemsData as any);
        }

      } catch (err: any) {
        console.error("Receipt loading failed:", err);
        setError(err.message || "Failed to load order information.");
      } finally {
        setLoading(false);
      }
    }

    loadReceipt();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white dark:bg-zinc-950 min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-serif text-lg">Polishing your order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-955 min-h-screen py-24 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-red-200 rounded-lg p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Receipt Not Found
            </h1>
            <p className="text-gray-500 text-sm">
              We couldn't retrieve the receipt details for the specified order reference: {orderId || "Missing"}
            </p>
          </div>
          <Link
            href="/shop"
            className="block w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary transition-colors text-sm"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-955 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Card */}
        <div className="bg-white dark:bg-zinc-900 border border-primary/20 rounded-t-lg p-8 shadow-sm text-center border-b-0 space-y-4">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-955/20 rounded-full flex items-center justify-center text-green-500 mx-auto border border-green-100 dark:border-green-900/30">
            <CheckCircle className="h-10 w-10 fill-current text-green-500 dark:text-green-400 bg-white dark:bg-zinc-900 rounded-full" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full">
              Payment Confirmed
            </span>
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mt-4">
              Thank you, {order.first_name}!
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Your crown is in good hands. We have received your order and our hair specialists are already preparing your premium bundle package!
            </p>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-gray-400">
            <span>Order ID: <span className="font-bold text-gray-700 dark:text-gray-200 select-all">{order.id}</span></span>
            <span className="hidden sm:inline">•</span>
            <span>Placed: <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span></span>
          </div>
        </div>

        {/* Invoice Receipt Body */}
        <div className="bg-white dark:bg-zinc-900 border border-primary/20 p-8 shadow-sm border-t border-dashed border-gray-205 dark:border-zinc-800 space-y-8">
          
          {/* Shipping Address Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" /> Delivery Information
            </h3>
            
            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-lg p-5 border border-primary/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="space-y-2">
                <p className="font-bold text-gray-900 dark:text-white">
                  {order.first_name} {order.last_name}
                </p>
                <p className="leading-relaxed">
                  {order.address}<br />
                  {order.city}, {order.postal_code}
                </p>
              </div>
              <div className="space-y-2 flex flex-col justify-center">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" /> {order.phone}
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" /> {order.email}
                </p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
              <Package className="h-4 w-4 mr-2 text-primary" /> Ordered Crown Selection
            </h3>

            <div className="border border-gray-100 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      {item.products?.image && (
                        <div className="w-12 h-16 relative rounded overflow-hidden bg-gray-100 border flex-shrink-0">
                          <Image
                            src={item.products.image}
                            alt={item.products.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.products?.name || "Premium Extensions"}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Category: {item.products?.category || "Extensions"} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Total */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500 font-medium">Status</span>
              <p className="text-sm font-bold text-green-600 flex items-center mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 inline-block"></span>
                Processing Shipment
              </p>
            </div>
            
            <div className="text-right space-y-1">
              <span className="text-xs text-gray-500 font-medium">Total Paid</span>
              <p className="text-2xl font-bold text-primary">
                ${Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Success Footer Navigation Card */}
        <div className="bg-gray-100/50 dark:bg-zinc-900/50 border border-primary/20 border-t-0 rounded-b-lg p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm text-center sm:text-left">
            Have questions about shipping or tracking your package? Feel free to contact our customer glow team at support@afroessence.com.
          </p>
          <Link
            href="/shop"
            className="bg-primary text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-secondary transition-all duration-300 shadow-md inline-flex items-center"
          >
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white dark:bg-zinc-950 min-h-screen">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-gray-500 font-serif text-lg">Polishing your order details...</p>
        </div>
      }
    >
      <SuccessReceiptContent />
    </Suspense>
  );
}
