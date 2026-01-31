"use client";

import { useEffect, useState } from "react";
import { EmailParser } from "@/components/email-parser";
import { POTable } from "@/components/po-table";
import { PurchaseOrder, OrderStatus } from "@/types";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderParsed = async (newOrder: PurchaseOrder) => {
    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        toast.success("PO saved successfully");
        fetchOrders(); // Refresh list
      } else {
        throw new Error("Failed to save PO");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save PO");
    }
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    // Optimistic update
    const previousOrders = [...orders];
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${id}/status?status=${encodeURIComponent(status)}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      // Revert on error
      setOrders(previousOrders);
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">PO Manager</h1>
            <p className="text-slate-500">Track and manage supplier orders with AI assistant.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1">
            <EmailParser onOrderParsed={handleOrderParsed} />
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            <POTable orders={orders} onStatusUpdate={handleStatusUpdate} />
          </div>
        </div>
      </div>
    </main>
  );
}
