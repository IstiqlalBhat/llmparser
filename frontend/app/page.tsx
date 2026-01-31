"use client";

import { EmailParser } from "@/components/email-parser";
import { POTable } from "@/components/po-table";
import { Toaster } from "sonner";
import { useOrders } from "@/hooks/use-orders";

export default function Home() {
  const { orders, isLoading, addOrder, updateOrderStatus } = useOrders();

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
            <EmailParser onOrderParsed={addOrder} />
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              </div>
            ) : (
              <POTable orders={orders} onStatusUpdate={updateOrderStatus} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
