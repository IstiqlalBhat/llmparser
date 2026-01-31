"use client";

import { EmailParser } from "@/components/email-parser";
import { POTable } from "@/components/po-table";
import { Toaster } from "sonner";
import { useOrders } from "@/hooks/use-orders";
import { Package, Zap, TrendingUp, Clock, Sun, AlertTriangle } from "lucide-react";

export default function Home() {
  const { orders, isLoading, addOrder, updateOrderStatus, deleteOrder, deleteOrders } = useOrders();

  // Calculate stats
  const totalOrders = orders.length;
  const onTrackOrders = orders.filter(o => o.status === "On Track").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;
  const productDelays = orders.filter(o => o.status === "Product Delays").length;
  const shipmentDelays = orders.filter(o => o.status === "Shipment Delay").length;

  return (
    <main className="min-h-screen warm-mesh paper-texture relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] blob-1 pointer-events-none float" />
      <div className="fixed bottom-[-150px] right-[-50px] w-[500px] h-[500px] blob-2 pointer-events-none float" style={{ animationDelay: "-3s" }} />

      {/* Subtle dot pattern overlay */}
      <div className="fixed inset-0 dot-pattern-warm opacity-30 pointer-events-none" />

      <Toaster
        position="top-right"
        toastOptions={{
          className: "warm-card",
          style: {
            background: "oklch(0.995 0.005 85)",
            border: "1px solid oklch(0.9 0.02 75)",
            color: "oklch(0.25 0.03 50)",
          },
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-8 lg:px-12 lg:py-10">
        {/* Header */}
        <header className="mb-10 slide-up">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10 flex items-center justify-center shadow-sm">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/70">
                  Supply Chain Intelligence
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                <span className="sunrise-gradient">PO Command</span>
              </h1>
              <p className="mt-3 text-muted-foreground text-lg max-w-lg leading-relaxed">
                AI-powered purchase order management. Parse supplier emails, track shipments, stay ahead of delays.
              </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <StatCard
                icon={<Package className="w-4 h-4" />}
                label="Total"
                value={totalOrders}
                color="text-foreground"
                bgColor="bg-secondary/50"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4" />}
                label="On Track"
                value={onTrackOrders}
                color="text-emerald-600"
                bgColor="bg-emerald-50"
              />
              <StatCard
                icon={<Zap className="w-4 h-4" />}
                label="Shipped"
                value={shippedOrders}
                color="text-blue-600"
                bgColor="bg-blue-50"
              />
              <StatCard
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Product"
                value={productDelays}
                color="text-amber-600"
                bgColor="bg-amber-50"
              />
              <StatCard
                icon={<Clock className="w-4 h-4" />}
                label="Shipment"
                value={shipmentDelays}
                color="text-red-600"
                bgColor="bg-red-50"
              />
            </div>
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Email Parser */}
          <div className="xl:col-span-4 slide-up" style={{ animationDelay: "0.1s" }}>
            <EmailParser onOrderParsed={addOrder} />
          </div>

          {/* Right Column: PO Table */}
          <div className="xl:col-span-8 slide-up" style={{ animationDelay: "0.2s" }}>
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <POTable
                orders={orders}
                onStatusUpdate={updateOrderStatus}
                onDelete={deleteOrder}
                onDeleteMany={deleteOrders}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="text-primary">PO Command</span>
              <span>&mdash;</span>
              <span>Intelligent supply chain management</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-soft" />
              System operational
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="warm-card rounded-xl px-3 py-3 hover-lift cursor-default">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
          <span className={color}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide truncate">{label}</p>
          <p className={`text-xl font-bold ${color}`} style={{ fontFamily: "var(--font-display)" }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="warm-card rounded-2xl p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="shimmer h-8 w-48 rounded-xl" />
        <div className="flex gap-3">
          <div className="shimmer h-10 w-64 rounded-xl" />
          <div className="shimmer h-10 w-40 rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer h-16 rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
}
