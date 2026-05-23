"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Shield, Loader2, ShoppingBag, User as UserIcon } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/components/CurrencyContext";
import { useStoreSettings } from "@/components/StoreSettingsContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { settings } = useStoreSettings();

  const globalWholesaleMoq = settings?.global_wholesale_moq ?? 10;
  
  const hasWholesaleItems = cartItems.some(item => item.isWholesale);
  const totalWholesaleQuantity = cartItems
    .filter(item => item.isWholesale)
    .reduce((sum, item) => sum + item.quantity, 0);

  const isWholesaleMoqValid = !hasWholesaleItems || totalWholesaleQuantity >= globalWholesaleMoq;

  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto pre-fill details for logged-in users
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Order summary calculations
  const shippingThreshold = 200;
  const shippingCost = cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 15.0;
  const taxRate = 0.08; // 8% sales tax
  const taxCost = cartTotal * taxRate;
  const totalAmount = cartTotal + shippingCost + taxCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add some products before checking out.");
      return;
    }

    if (!isWholesaleMoqValid) {
      setErrorMessage(`Wholesale MOQ Not Met: You must purchase a minimum of ${globalWholesaleMoq} wholesale units in total to check out. You currently have ${totalWholesaleQuantity} units.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // 1. Stock Management Validation Check
      const productIds = cartItems.map(item => item.productId);
      const { data: dbProducts, error: dbError } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .in("id", productIds);

      if (dbError || !dbProducts) {
        throw new Error("Unable to check inventory levels. Please verify your connection and try again.");
      }

      // Create lookup dictionary
      const stockLookup = new Map<string, { name: string; stock: number }>();
      dbProducts.forEach(p => {
        stockLookup.set(p.id, { name: p.name, stock: p.stock_quantity ?? 0 });
      });

      // Verify availability
      for (const item of cartItems) {
        const productInfo = stockLookup.get(item.productId);
        if (!productInfo) continue;
        if (productInfo.stock < item.quantity) {
          throw new Error(
            `Insufficient Stock: "${productInfo.name}" only has ${productInfo.stock} items remaining in stock, but you requested ${item.quantity}. Please reduce your quantity before checking out.`
          );
        }
      }

      // 2. Insert order details into 'orders' table
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          address: address.trim(),
          city: city.trim(),
          postal_code: postalCode.trim(),
          phone: phone.trim(),
          total_amount: Number(totalAmount.toFixed(2)),
          status: "Pending",
          user_id: user?.id || null, // Associates optional logged-in user profile
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order.");
      }

      const createdOrderId = orderData.id;

      // 3. Map cart items to 'order_items' rows
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: createdOrderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: Number(item.price.toFixed(2)),
      }));

      // 4. Bulk insert order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) {
        throw new Error(itemsError.message || "Failed to save order items.");
      }

      // 5. Stock Level Deductions
      for (const item of cartItems) {
        const productInfo = stockLookup.get(item.productId);
        if (!productInfo) continue;
        const newStock = Math.max(0, productInfo.stock - item.quantity);
        
        const { error: updateStockError } = await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", item.productId);

        if (updateStockError) {
          console.error(`Warning: Failed to deduct stock for product ${item.productId}:`, updateStockError);
        }
      }

      // 6. Clear client cart
      clearCart();

      // 7. Redirect to checkout success page
      router.push(`/checkout/success?orderId=${createdOrderId}`);

    } catch (err: any) {
      console.error("Checkout order placement failed:", err);
      setErrorMessage(err.message || "There was a problem placing your order. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen py-24 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-primary/10 rounded-lg p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-500 text-sm">
              We cannot checkout with an empty shopping bag. Head over to our catalog to select your favorite products.
            </p>
          </div>
          <Link
            href="/shop"
            className="block w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary transition-colors text-sm"
          >
            Shop Hair Extensions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Catalog
          </Link>
        </div>

        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-10">Checkout</h1>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-md">
            {errorMessage}
          </div>
        )}

        {!isWholesaleMoqValid && (
          <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 text-sm font-semibold rounded-md flex items-center gap-2">
            <span>⚠️ Wholesale Requirement: Your cart must contain at least {globalWholesaleMoq} wholesale units in total to place a wholesale order. You currently have {totalWholesaleQuantity} wholesale units in your cart. Please add more wholesale items or increase their quantities to check out.</span>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          
          {/* Shipping Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-primary/10 p-6 md:p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
              Shipping & Contact Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sandra@example.com"
                  className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sandra"
                    className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mumba"
                    className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Leopards Hill Road"
                  className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                />
              </div>

              {/* City and Post Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lusaka"
                    className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Postal Code / Zip
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10101"
                    className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+260 97 1234567"
                  className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-3 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                />
              </div>

              {/* Payment (Mockup Details) */}
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-5 mt-8 space-y-4">
                <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                  <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-primary" /> Mockup Payment Gateway
                  </span>
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded font-bold">GUEST MODE</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your transaction is fully simulated. Placing the order will write records directly to our Supabase database and clear your cart. No actual credit card charge will be made.
                </p>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting || !isWholesaleMoqValid}
                className="w-full bg-primary text-white py-4 rounded-md font-bold text-center hover:bg-secondary hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Weaving Your Order...</span>
                  </>
                ) : (
                  <span>Place Your Order ({formatPrice(totalAmount)})</span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 mt-8 lg:mt-0 flex flex-col space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-primary/10 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-zinc-800 pb-3">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex items-center space-x-3 pb-4 border-b border-gray-50 dark:border-zinc-800 last:border-0 last:pb-0">
                    <div className="w-12 h-16 relative rounded overflow-hidden bg-gray-100 border flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Qty: {item.quantity} | {item.length}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-3.5 border-t border-gray-100 dark:border-zinc-800 pt-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Est. Sales Tax (8%)</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatPrice(taxCost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-zinc-800 pt-4">
                  <span>Total Due</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Secures and trust */}
            <div className="bg-gray-100/50 dark:bg-zinc-900/25 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 flex items-start space-x-3.5">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase mb-1 tracking-wider">
                  Secure Checkout Guaranteed
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Your credentials and data are protected. Afro Essence utilizes the highest security standards to secure checkout data and connection sockets to our PostgreSQL database.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
