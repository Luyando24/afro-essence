"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { useCurrency } from "./CurrencyContext";
import { useStoreSettings } from "./StoreSettingsContext";

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
  const { settings } = useStoreSettings();

  const globalWholesaleMoq = Number(settings?.global_wholesale_moq ?? 500.00);
  const hasWholesaleItems = cartItems.some(item => item.isWholesale);
  const totalWholesaleSubtotal = cartItems
    .filter(item => item.isWholesale)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const isWholesaleMoqValid = !hasWholesaleItems || totalWholesaleSubtotal >= globalWholesaleMoq;
  
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
          className="w-screen max-w-md shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l"
          style={{ backgroundColor: "#FAFAF8", borderColor: "#E8E2D9" }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#E8E2D9", backgroundColor: "#fff" }}>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" style={{ color: "#C9A84C" }} />
              <h2 className="text-lg font-serif font-bold" style={{ color: "#1A1A1A" }}>
                Your Crown ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ color: "#999" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" style={{ backgroundColor: "#FAFAF8" }}>
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold mb-1" style={{ color: "#1A1A1A" }}>
                    Your cart is empty
                  </h3>
                  <p className="text-sm max-w-xs" style={{ color: "#888" }}>
                    Choose from our gorgeous collection of premium bundles and wigs to start your style journey.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "#C9A84C", color: "#000" }}
                >
                  Shop Extensions
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex items-start space-x-4 pb-6 border-b last:border-b-0"
                  style={{ borderColor: "#F0EBE4" }}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 relative rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: "#F0EBE4" }}>
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
                      <h4 className="text-sm font-bold truncate pr-2 flex items-center gap-1.5" style={{ color: "#1A1A1A" }}>
                        {item.name}
                        {item.isWholesale && (
                          <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-amber-250 dark:border-amber-900/30 uppercase tracking-wide">
                            Wholesale
                          </span>
                        )}
                      </h4>
                      <p className="text-sm font-bold" style={{ color: "#C9A84C" }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    
                    <p className="text-xs mt-0.5 flex flex-wrap gap-2" style={{ color: "#999" }}>
                      <span>Length: <span className="font-medium text-gray-800 dark:text-gray-200">{item.length}</span></span>
                      {item.isWholesale && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-500 font-extrabold">
                          (MOQ: {item.moqQuantity || 10})
                        </span>
                      )}
                    </p>

                    {/* Quantity Controls & Delete */}
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <div className="flex items-center border rounded-xl" style={{ borderColor: "#E8E2D9" }}>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1.5 rounded-l-xl hover:bg-gray-100 transition-colors"
                          style={{ color: "#777" }}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-bold" style={{ color: "#1A1A1A" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1.5 rounded-r-xl hover:bg-gray-100 transition-colors"
                          style={{ color: "#777" }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        style={{ color: "#ccc" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
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
            <div className="px-6 py-6 border-t space-y-4" style={{ backgroundColor: "#fff", borderColor: "#E8E2D9" }}>
              <div className="flex justify-between text-sm font-semibold" style={{ color: "#1A1A1A" }}>
                <span>Subtotal</span>
                <span className="font-bold" style={{ color: "#C9A84C" }}>{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs" style={{ color: "#999" }}>
                Shipping and taxes calculated at checkout.
              </p>

              {!isWholesaleMoqValid && (
                <p className="text-[11px] text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-955/20 border border-amber-250 dark:border-amber-900/30 p-2.5 rounded font-bold leading-normal">
                  ⚠️ Wholesale MOQ Not Met: You must purchase a minimum of {formatPrice(globalWholesaleMoq)} in wholesale products to check out. Your current wholesale subtotal is {formatPrice(totalWholesaleSubtotal)}.
                </p>
              )}
 
              <div className="grid grid-cols-1 gap-2 pt-2">
                {isWholesaleMoqValid ? (
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:opacity-90 hover:shadow-lg block"
                    style={{ backgroundColor: "#C9A84C", color: "#000" }}
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 py-3 rounded-md font-bold text-center cursor-not-allowed opacity-60"
                  >
                    Proceed to Checkout
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-center border transition-all hover:bg-gray-50"
                  style={{ borderColor: "#E8E2D9", color: "#555" }}
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
