"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { useCurrency } from "./CurrencyContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();
  const { formatPrice } = useCurrency();
  
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Click outside to close drawer
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isCartOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer container with slide animation */}
        <div 
          ref={drawerRef}
          className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-primary/20"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                Your Crown ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-md text-gray-400 hover:text-primary transition-colors focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Choose from our gorgeous collection of premium bundles and wigs to start your style journey.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
                >
                  Shop Extensions
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex items-start space-x-4 pb-6 border-b border-gray-100 dark:border-zinc-800 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 relative rounded-md overflow-hidden bg-gray-100 border border-gray-100 dark:border-zinc-800 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate pr-2">
                        {item.name}
                      </h4>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-0.5">
                      Length: <span className="font-medium text-gray-800 dark:text-gray-200">{item.length}</span>
                    </p>

                    {/* Quantity Controls & Delete */}
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer summary */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 space-y-4">
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Shipping and taxes calculated at checkout. Enjoy free shipping on orders over {formatPrice(200)}!
              </p>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-primary text-white py-3 rounded-md font-bold text-center hover:bg-secondary transition-colors duration-300 shadow-md"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-transparent border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 py-3 rounded-md font-medium text-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
