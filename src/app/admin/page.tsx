"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Search, 
  Eye, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  Loader2, 
  CheckCircle, 
  Save, 
  LogOut, 
  Globe, 
  User,
  Lock,
  ChevronDown,
  ChevronUp,
  Pencil,
  Upload,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "reviews">("overview");

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin Data State
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Expandable row state for Orders
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Edit stock buffer state
  const [stockEditValues, setStockEditValues] = useState<Record<string, number>>({});

  // Fetch Dataset
  const loadAdminDataset = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Products
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (prodError) throw prodError;
      setProducts(prodData || []);

      // Initialize stock edit buffers
      const stockBuffer: Record<string, number> = {};
      (prodData || []).forEach(p => {
        stockBuffer[p.id] = p.stock_quantity ?? 0;
      });
      setStockEditValues(stockBuffer);

      // 2. Fetch Orders with nested items and products
      const { data: ordData, error: ordError } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .order("created_at", { ascending: false });

      if (ordError) throw ordError;
      setOrders(ordData || []);

      // 3. Fetch Reviews joined with products
      const { data: revData, error: revError } = await supabase
        .from("product_reviews")
        .select("*, products(*)")
        .order("created_at", { ascending: false });

      if (revError) throw revError;
      setReviews(revData || []);

    } catch (err: any) {
      console.error("Dashboard database fetch failed:", err);
      setError(err.message || "Failed to load dashboard parameters. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAdminDataset();
    }
  }, [user]);

  // Force light mode CSS variables on the document element & parse active tab from query params
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--background", "#ffffff");
    root.style.setProperty("--foreground", "#171717");
    
    // Parse url tab query
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get("tab");
      if (tabParam === "products" || tabParam === "orders" || tabParam === "reviews" || tabParam === "overview") {
        setActiveTab(tabParam);
      }
    }
    
    return () => {
      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
    };
  }, []);

  // Restock trigger
  const handleSaveStock = async (productId: string) => {
    const updatedStock = stockEditValues[productId];
    if (updatedStock === undefined || updatedStock < 0) return;

    try {
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: updatedStock })
        .eq("id", productId);

      if (updateError) throw updateError;

      setProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, stock_quantity: updatedStock } : p)
      );

      // Simple visual feedback
      alert("Stock restocked successfully!");
    } catch (err: any) {
      console.error("Stock update failed:", err);
      alert("Failed to update stock: " + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This will permanently remove it from the catalog.")) return;

    try {
      const { error: delError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (delError) throw delError;

      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err: any) {
      console.error("Deletion failed:", err);
      alert("Failed to delete product: " + err.message);
    }
  };

  // Update Order shipment status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (updateError) throw updateError;

      setOrders(prev => 
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err: any) {
      console.error("Status update failed:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this customer review?")) return;

    try {
      const { error: delError } = await supabase
        .from("product_reviews")
        .delete()
        .eq("id", reviewId);

      if (delError) throw delError;

      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err: any) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review: " + err.message);
    }
  };

  // Loading gate
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-serif text-lg">Verifying credentials...</p>
      </div>
    );
  }

  // Auth restriction gate
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-primary/20 rounded-lg shadow-xl overflow-hidden text-center relative">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
          <div className="p-8 space-y-6">
            <div className="h-16 w-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-wider uppercase">Admin Portal Locked</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              This workspace contains financial sales summaries, custom inventory management, and sensitive invoice data. Please sign in to verify your identity.
            </p>
            <Link 
              href="/login?redirect=/admin"
              className="block w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary transition-colors text-sm shadow-md uppercase tracking-wider"
            >
              Log In as Administrator
            </Link>
            <div className="pt-4 border-t border-gray-150">
              <Link href="/shop" className="text-xs text-primary hover:underline font-bold">
                Return to Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Financial aggregates calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? Number(o.total_amount) : 0), 0);
  const lowStockCount = products.filter(p => (p.stock_quantity ?? 0) < 5).length;

  // Filtered Products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.first_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.last_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase());
      
    const matchesStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen w-screen bg-gray-50 font-sans overflow-hidden relative">
      
      {/* Mobile Drawer Overlay Background */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-in fade-in duration-200" 
        />
      )}
      
      {/* Left Sidebar Nav */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-gray-200 text-gray-850 flex flex-col justify-between z-50 shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center text-primary shadow-sm shadow-primary/25">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-base font-bold tracking-wider text-primary block leading-none">AFRO ESSENCE</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mt-1">Management Portal</span>
            </div>
          </div>
          
          {/* Close Sidebar Trigger on Mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded transition-all"
            title="Close menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Sidebar Nav links */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => { setActiveTab("overview"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded text-sm font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mr-3 shrink-0" /> 
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("products"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded text-sm font-semibold transition-all ${
              activeTab === "products"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
            }`}
          >
            <Package className="h-4 w-4 mr-3 shrink-0" /> 
            <span>Products Manager</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("orders"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded text-sm font-semibold transition-all ${
              activeTab === "orders"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="h-4 w-4 mr-3 shrink-0" /> 
            <span>Orders Manager</span>
            {orders.filter(o => o.status === "Pending").length > 0 && (
              <span className="ml-auto bg-amber-500 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {orders.filter(o => o.status === "Pending").length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => { setActiveTab("reviews"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded text-sm font-semibold transition-all ${
              activeTab === "reviews"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-3 shrink-0" /> 
            <span>Reviews Moderator</span>
          </button>
        </div>

        {/* User profile section & Sign Out */}
        <div className="p-4 border-t border-gray-150 bg-gray-50/50">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="h-8 w-8 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate leading-none mb-1">{user.email?.split("@")[0]}</p>
              <p className="text-[9px] text-gray-500 truncate" title={user.email}>{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              signOut();
              router.push("/login");
            }}
            className="w-full text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200/60 hover:bg-red-50 hover:border-red-200 hover:text-red-600 px-3 py-2.5 rounded transition-all flex items-center justify-center space-x-2"
          >
            <LogOut className="h-3.5 w-3.5" /> 
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-55">
        
        {/* Top Header Bar inside Content Area */}
        <header className="h-20 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger toggle trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-650 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 rounded-md transition-all flex items-center justify-center shrink-0"
              title="Open Navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mb-0.5">Control Center</span>
              <h2 className="text-base sm:text-xl font-serif font-bold text-gray-900 tracking-wide capitalize flex items-center gap-2">
                <span className="hidden sm:inline-flex">
                  {activeTab === "overview" && <LayoutDashboard className="h-5 w-5 text-primary" />}
                  {activeTab === "products" && <Package className="h-5 w-5 text-primary" />}
                  {activeTab === "orders" && <ShoppingBag className="h-5 w-5 text-primary" />}
                  {activeTab === "reviews" && <MessageSquare className="h-5 w-5 text-primary" />}
                </span>
                <span>{activeTab === "overview" ? "Dashboard Overview" : activeTab + " Manager"}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 font-medium hidden sm:flex items-center bg-gray-100 px-3 py-1.5 rounded border border-gray-200/50">
              <User className="h-3.5 w-3.5 mr-2 text-primary" /> {user.email}
            </span>
            <button 
              onClick={loadAdminDataset}
              className="p-2.5 text-gray-500 hover:text-primary hover:bg-gray-100 transition-all border border-gray-200 rounded-md"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
            
            <Link 
              href="/shop"
              className="text-xs font-bold text-gray-700 border border-gray-200 bg-white px-4 py-2.5 rounded-md hover:bg-gray-55 transition-all flex items-center"
            >
              <Globe className="h-3.5 w-3.5 mr-1.5" /> 
              <span>Shop Front</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Workspace Container */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8">

        {/* Global Loading Spinner */}
        {loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Fetching secure store metrics...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-750 p-4 rounded text-sm text-center leading-relaxed mb-6 font-semibold">
            {error}
          </div>
        ) : (
          <div>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-10">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Total Revenue */}
                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1.5">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Revenue</span>
                      <span className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Total Orders */}
                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1.5">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Orders</span>
                      <span className="text-3xl font-bold text-gray-900">{orders.length}</span>
                    </div>
                    <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Active Products */}
                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1.5">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Active Products</span>
                      <span className="text-3xl font-bold text-gray-900">{products.length}</span>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Low Stock Warnings */}
                  <div className={`p-6 rounded-lg border shadow-sm flex items-center justify-between transition-colors ${
                    lowStockCount > 0 
                      ? 'bg-red-50  border-red-200 ' 
                      : 'bg-white  border-gray-100 '
                  }`}>
                    <div className="space-y-1.5">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Low Stock Alerts</span>
                      <span className={`text-3xl font-bold ${lowStockCount > 0 ? 'text-red-650 ' : 'text-gray-900 '}`}>{lowStockCount}</span>
                    </div>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${lowStockCount > 0 ? 'bg-red-100  text-red-500' : 'bg-gray-50  text-gray-400'}`}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>

                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-serif font-bold text-gray-900">
                      Recent Sales Feed
                    </h2>
                    <button 
                      onClick={() => { setActiveTab("orders"); setIsMobileMenuOpen(false); }}
                      className="text-xs text-primary hover:underline font-bold"
                    >
                      View All Orders
                    </button>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No sales transactions processed yet.</div>
                  ) : (
                    <>
                      {/* Desktop Table Feed */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50 text-gray-550 border-b border-gray-100">
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Order ID</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Customer</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Date</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Total</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orders.slice(0, 5).map((o) => (
                              <tr key={o.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500 select-all">{o.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4 font-bold text-gray-800">{o.first_name} {o.last_name}</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-bold text-primary">${Number(o.total_amount).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    o.status === "Shipped" ? "bg-green-50 text-green-700 border border-green-200" :
                                    o.status === "Cancelled" ? "bg-red-50 text-red-700 border border-red-200" :
                                    o.status === "Processing" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                    "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards Feed */}
                      <div className="md:hidden divide-y divide-gray-100">
                        {orders.slice(0, 5).map((o) => (
                          <div key={o.id} className="p-4 flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-xs text-gray-850">{o.first_name} {o.last_name}</h4>
                                <span className="text-[9px] font-mono text-gray-400 block mt-0.5">ID: {o.id.substring(0, 8)}...</span>
                              </div>
                              <span className={`inline-flex items-center text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                o.status === "Shipped" ? "bg-green-50 text-green-700 border border-green-200" :
                                o.status === "Cancelled" ? "bg-red-50 text-red-700 border border-red-200" :
                                o.status === "Processing" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                                {o.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-gray-500">
                              <span>{new Date(o.created_at).toLocaleDateString()}</span>
                              <span className="font-bold text-primary">${Number(o.total_amount).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Low Stock Items Warning Table */}
                {products.filter(p => (p.stock_quantity ?? 0) < 5).length > 0 && (
                  <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-serif text-lg font-bold text-red-800 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" /> Stock Level Warnings!
                    </h3>
                    <p className="text-xs text-gray-550 leading-relaxed max-w-2xl">
                      The following products have almost run out of stock and are currently displayed as very low or Sold Out. Use the **Products Manager** tab to restock.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.filter(p => (p.stock_quantity ?? 0) < 5).map(p => (
                        <div key={p.id} className="bg-white p-4 border border-red-100 rounded flex items-center justify-between shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{p.name}</h4>
                              <span className="text-xs text-gray-400">{p.category}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-extrabold px-2.5 py-1 rounded ${
                            p.stock_quantity === 0 
                              ? 'bg-red-100 text-red-850  ' 
                              : 'bg-amber-100 text-amber-850  '
                          }`}>
                            {p.stock_quantity === 0 ? 'SOLD OUT' : `${p.stock_quantity} Remaining`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. PRODUCTS TAB */}
            {activeTab === "products" && (
              <div className="space-y-6">
                
                {/* Search Bar & Add Button */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 border border-gray-100 rounded-lg shadow-sm">
                  <div className="relative w-full sm:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search inventory by title or category..."
                      className="w-full text-xs border border-gray-300 bg-white rounded p-2.5 pl-10 outline-none focus:ring-1 focus:ring-primary text-gray-950"
                    />
                  </div>
                  <Link
                    href="/admin/products/new"
                    className="w-full sm:w-auto bg-primary text-white py-2.5 px-5 rounded font-bold hover:bg-secondary transition-colors text-xs flex items-center justify-center space-x-1.5 shadow-sm uppercase tracking-wider text-center"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Publish New Product</span>
                  </Link>
                </div>

                {/* Products Table - Desktop Only */}
                <div className="hidden md:block bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-550 border-b border-gray-100">
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Product Info</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Price</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Live Inventory Stock</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50">
                            
                            {/* Product Info (image + title) */}
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 relative rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm text-gray-900 leading-tight">{p.name}</h4>
                                  <span className="text-[10px] text-gray-400 font-mono select-all block mt-0.5">{p.id}</span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-4 text-gray-500 font-medium">{p.category}</td>

                            {/* Price */}
                            <td className="px-6 py-4 font-bold text-gray-900">${Number(p.price).toFixed(2)}</td>

                            {/* Live Inventory (Editable inline) */}
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={stockEditValues[p.id] !== undefined ? stockEditValues[p.id] : (p.stock_quantity ?? 0)}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setStockEditValues(prev => ({ ...prev, [p.id]: isNaN(val) ? 0 : val }));
                                  }}
                                  className="w-20 border border-gray-300 bg-white rounded p-1.5 text-center text-xs font-bold text-gray-900"
                                />
                                <button
                                  onClick={() => handleSaveStock(p.id)}
                                  disabled={stockEditValues[p.id] === p.stock_quantity}
                                  className="p-2 bg-gray-100 hover:bg-primary hover:text-white transition-all rounded text-gray-500 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-500 disabled: shadow-sm"
                                  title="Save Inventory"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </button>
                                
                                {/* Status badge helper */}
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  (p.stock_quantity ?? 0) === 0 ? "bg-red-50 text-red-700 border border-red-150" :
                                  (p.stock_quantity ?? 0) < 5 ? "bg-amber-50 text-amber-700 border border-amber-150 animate-pulse" :
                                  "bg-green-50 text-green-700 border border-green-150"
                                }`}>
                                  {(p.stock_quantity ?? 0) === 0 ? "Out" : (p.stock_quantity ?? 0) < 5 ? "Low" : "OK"}
                                </span>
                              </div>
                            </td>

                            {/* Actions column (Edit + Delete) */}
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <Link
                                href={`/admin/products/edit/${p.id}`}
                                className="p-2 text-primary hover:bg-amber-50 border border-transparent hover:border-amber-100 rounded transition-all inline-flex items-center mr-1.5"
                                title="Edit Product"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded transition-all inline-flex items-center"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>

                          </tr>
                        ))}
                        
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                              No matching products found in inventory.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            
                {/* Products Cards - Mobile Only */}
                <div className="md:hidden space-y-4">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="bg-white p-4 border border-gray-100 rounded-lg shadow-sm space-y-3.5">
                      <div className="flex items-center space-x-3.5">
                        <div className="h-14 w-14 relative rounded overflow-hidden bg-gray-100 border border-gray-150 shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-wider bg-amber-50 text-primary border border-amber-100 px-2 py-0.5 rounded font-bold">
                            {p.category}
                          </span>
                          <h4 className="font-bold text-sm text-gray-900 leading-tight mt-1 truncate">{p.name}</h4>
                          <span className="text-[9px] text-gray-400 font-mono block truncate mt-0.5">{p.id}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded border border-gray-100">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Price</span>
                          <span className="text-xs font-bold text-gray-950">${Number(p.price).toFixed(2)}</span>
                        </div>
                        
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Stock Level</span>
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              min="0"
                              value={stockEditValues[p.id] !== undefined ? stockEditValues[p.id] : (p.stock_quantity ?? 0)}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setStockEditValues(prev => ({ ...prev, [p.id]: isNaN(val) ? 0 : val }));
                              }}
                              className="w-14 border border-gray-300 bg-white rounded p-1 text-center text-xs font-bold text-gray-905 outline-none"
                            />
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              disabled={stockEditValues[p.id] === p.stock_quantity}
                              className="p-1 bg-gray-100 hover:bg-primary hover:text-white transition-all rounded text-gray-500 border border-gray-200 disabled:opacity-30"
                              title="Update stock"
                            >
                              <Save className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Status</span>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full block text-center ${
                            (p.stock_quantity ?? 0) === 0 ? "bg-red-50 text-red-700 border border-red-150" :
                            (p.stock_quantity ?? 0) < 5 ? "bg-amber-50 text-amber-700 border border-amber-150" :
                            "bg-green-50 text-green-700 border border-green-150"
                          }`}>
                            {(p.stock_quantity ?? 0) === 0 ? "Out" : (p.stock_quantity ?? 0) < 5 ? "Low" : "OK"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          className="flex-1 bg-amber-50 hover:bg-amber-100 text-primary border border-amber-200 text-center py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit Specifications</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <div className="py-12 text-center text-gray-400 text-xs bg-white rounded border border-gray-100">
                      No matching storefront products found.
                    </div>
                  )}
                </div>

                {/* 3. ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                
                {/* Search Bar & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border border-gray-100 rounded-lg shadow-sm">
                  
                  {/* Search input */}
                  <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search orders by customer name, email, or order ID..."
                      className="w-full text-xs border border-gray-300 bg-white rounded p-2.5 pl-10 outline-none focus:ring-1 focus:ring-primary text-gray-950"
                    />
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
                    {["All", "Pending", "Processing", "Shipped", "Cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                          orderStatusFilter === status
                            ? "bg-primary border-transparent text-white shadow-sm"
                            : "bg-white  border-gray-200  text-gray-650 hover:bg-gray-50 "
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Orders Table - Desktop Only */}
                <div className="hidden md:block bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-550 border-b border-gray-100">
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider"></th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Purchase Date</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Total Amount</th>
                          <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Shipment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((o) => {
                          const isExpanded = expandedOrderId === o.id;
                          return (
                            <React.Fragment key={o.id}>
                              <tr className="hover:bg-gray-50/20">
                                
                                {/* Toggle expand details */}
                                <td className="px-6 py-4 text-center">
                                  <button
                                    onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                                    className="p-1 text-gray-400 hover:text-primary transition-colors rounded"
                                    title="View Invoice Items"
                                  >
                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </button>
                                </td>

                                {/* Order ID */}
                                <td className="px-6 py-4 font-mono text-xs text-gray-400 select-all">{o.id}</td>

                                {/* Customer details */}
                                <td className="px-6 py-4">
                                  <h4 className="font-bold text-gray-900 text-sm">{o.first_name} {o.last_name}</h4>
                                  <span className="text-xs text-gray-450 block">{o.email}</span>
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4 text-gray-500">{new Date(o.created_at).toLocaleString()}</td>

                                {/* Total Amount */}
                                <td className="px-6 py-4 font-bold text-primary">${Number(o.total_amount).toFixed(2)}</td>

                                {/* Status Modifiable Dropdown */}
                                <td className="px-6 py-4">
                                  <select
                                    value={o.status}
                                    onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                    className={`text-xs font-bold rounded-md px-2.5 py-1.5 border cursor-pointer outline-none ${
                                      o.status === "Shipped" ? "bg-green-50 text-green-700 border-green-200   " :
                                      o.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-200   " :
                                      o.status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-200   " :
                                      "bg-amber-50 text-amber-700 border-amber-200   "
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>

                              </tr>

                              {/* Expandable row rendering invoice and customer address details */}
                              {isExpanded && (
                                <tr className="bg-gray-50/50">
                                  <td colSpan={6} className="px-10 py-6 border-t border-b border-gray-150">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
                                      
                                      {/* Ship to Address columns */}
                                      <div className="space-y-3 bg-white p-5 rounded border border-gray-200/60 shadow-sm">
                                        <h5 className="font-serif font-bold text-gray-900 uppercase tracking-wider text-xs border-b pb-2 text-primary border-primary/10">Ship-To Details</h5>
                                        <div className="space-y-1.5 text-xs text-gray-650">
                                          <p><span className="font-bold text-gray-455">Name:</span> {o.first_name} {o.last_name}</p>
                                          <p><span className="font-bold text-gray-455">Email:</span> {o.email}</p>
                                          <p><span className="font-bold text-gray-455">Phone:</span> {o.phone}</p>
                                          <p><span className="font-bold text-gray-455">Street:</span> {o.address}</p>
                                          <p><span className="font-bold text-gray-455">City:</span> {o.city}</p>
                                          <p><span className="font-bold text-gray-455">Postal Code:</span> {o.postal_code}</p>
                                        </div>
                                      </div>

                                      {/* Line Items purchased */}
                                      <div className="lg:col-span-2 space-y-3">
                                        <h5 className="font-serif font-bold text-gray-900 uppercase tracking-wider text-xs border-b pb-2 text-primary border-primary/10">Ordered Line Items</h5>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                          {o.order_items?.map((item: any) => (
                                            <div key={item.id} className="bg-white p-3 rounded border border-gray-200/60 flex items-center justify-between text-xs shadow-sm">
                                              <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                  <Image 
                                                    src={item.products?.image || "https://images.unsplash.com/photo-1565191946394-d2e4cb804791?auto=format&fit=crop&q=80&w=600"} 
                                                    alt={item.products?.name || "Product"} 
                                                    fill 
                                                    className="object-cover" 
                                                  />
                                                </div>
                                                <div>
                                                  <h6 className="font-bold text-gray-900">{item.products?.name || "Deleted Product"}</h6>
                                                  <span className="text-[10px] text-gray-400">ID: {item.product_id}</span>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="font-bold text-gray-900">${Number(item.price).toFixed(2)}</p>
                                                <p className="text-[10px] text-gray-450">Quantity: {item.quantity}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}

                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                              No orders found matching filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            
                {/* Orders Cards - Mobile Only */}
                <div className="md:hidden space-y-4">
                  {filteredOrders.map((o) => {
                    const isExpanded = expandedOrderId === o.id;
                    return (
                      <div key={o.id} className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-gray-400 block">ID: {o.id.substring(0, 8)}...</span>
                            <h4 className="font-bold text-sm text-gray-900 mt-0.5">{o.first_name} {o.last_name}</h4>
                            <span className="text-[11px] text-gray-500 block leading-tight truncate max-w-[160px]">{o.email}</span>
                          </div>
                          
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                            className={`text-[10px] font-bold rounded px-2 py-1.5 border cursor-pointer outline-none ${
                              o.status === "Shipped" ? "bg-green-50 text-green-700 border-green-200" :
                              o.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                              o.status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded border border-gray-100 text-xs">
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Purchase Date</span>
                            <span className="text-gray-700 font-medium">{new Date(o.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                            <span className="font-bold text-primary">${Number(o.total_amount).toFixed(2)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 border border-gray-200 rounded text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1"
                        >
                          <span>{isExpanded ? "Hide Details" : "View Invoice details"}</span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>

                        {isExpanded && (
                          <div className="pt-3 border-t border-gray-100 space-y-4 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                            
                            {/* Address details */}
                            <div className="bg-gray-50 p-3 rounded border border-gray-150 space-y-1.5 text-xs text-gray-600">
                              <h5 className="font-bold text-gray-900 uppercase text-[9px] tracking-wider mb-1 text-primary">Ship-To Address</h5>
                              <p><span className="font-bold text-gray-450">Phone:</span> {o.phone}</p>
                              <p><span className="font-bold text-gray-455">Address:</span> {o.address}</p>
                              <p><span className="font-bold text-gray-455">City/Postal:</span> {o.city}, {o.postal_code}</p>
                            </div>

                            {/* Line items list */}
                            <div className="space-y-2">
                              <h5 className="font-bold text-gray-900 uppercase text-[9px] tracking-wider mb-1 text-primary">Items Ordered</h5>
                              {o.order_items?.map((item: any) => (
                                <div key={item.id} className="bg-white p-2 border border-gray-200 rounded flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 relative rounded overflow-hidden bg-gray-100 shrink-0">
                                      <Image 
                                        src={item.products?.image || "https://images.unsplash.com/photo-1565191946394-d2e4cb804791?auto=format&fit=crop&q=80&w=600"} 
                                        alt={item.products?.name || "Product"} 
                                        fill 
                                        className="object-cover" 
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <h6 className="font-bold text-gray-900 truncate max-w-[150px]">{item.products?.name || "Deleted Product"}</h6>
                                      <span className="text-[9px] text-gray-400 font-mono">Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                  <div className="text-right font-bold text-gray-950">
                                    ${Number(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredOrders.length === 0 && (
                    <div className="py-12 text-center text-gray-400 text-xs bg-white rounded border border-gray-100">
                      No matching storefront orders found.
                    </div>
                  )}
                </div>

                {/* 4. REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                
                {/* Moderation Intro */}
                <div className="bg-white p-5 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-1.5">Review Moderation Feed</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
                    Moderate customer stories, comments, and ratings submitted to your website. Inappropriate or duplicate reviews can be deleted permanently, keeping your storefront feedback authentic and polished.
                  </p>
                </div>

                {/* Review Feed Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm flex flex-col justify-between relative group hover:border-primary/20 transition-all duration-300">
                      
                      {/* Review details */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-gray-900">{r.name}</h4>
                            <span className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-xs">
                                {r.rating > i ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Product reference tag */}
                        <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded border border-gray-150 w-fit">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Product:</span>
                          <span className="text-[10px] text-primary font-bold">{r.products?.name || "Deleted Product"}</span>
                        </div>

                        {/* Comment text */}
                        <p className="text-xs text-gray-650 leading-relaxed font-medium italic">
                          "{r.comment}"
                        </p>
                      </div>

                      {/* Delete button */}
                      <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="text-xs text-red-500 hover:text-red-750 font-bold flex items-center space-x-1 hover:underline"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Review</span>
                        </button>
                      </div>

                    </div>
                  ))}
                  
                  {reviews.length === 0 && (
                    <div className="col-span-full py-16 text-center text-gray-400 text-sm">
                      No customer reviews submitted to the database yet.
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        </div>
      </main>

    </div>
  );
}
