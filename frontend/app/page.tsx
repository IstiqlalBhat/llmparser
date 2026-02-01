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
    <main className="min-h-screen warm-mesh relative overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "warm-card",
          style: {
            background: "#FFFFFF",
            border: "1px solid #E5DDD5",
            color: "#1C1512",
          },
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
        {/* Header */}
        <header className="mb-8 lg:mb-12 slide-up">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
                  Supply Chain Intelligence
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                <span className="sunrise-gradient">PO Command</span>
              </h1>
              <p className="mt-4 text-foreground/70 text-lg leading-relaxed text-balance">
                AI-powered purchase order management. Parse supplier emails, track shipments, and stay ahead of delays with intelligent automation.
              </p>
            </div>

            {/* Stats bar - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full xl:w-auto">
              <StatCard
                icon={<Package className="w-4 h-4" />}
                label="Total"
                value={totalOrders}
                color="text-foreground"
                bgColor="bg-secondary"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4" />}
                label="On Track"
                value={onTrackOrders}
                color="text-emerald-700"
                bgColor="bg-emerald-100"
              />
              <StatCard
                icon={<Zap className="w-4 h-4" />}
                label="Shipped"
                value={shippedOrders}
                color="text-blue-700"
                bgColor="bg-blue-100"
              />
              <StatCard
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Product"
                value={productDelays}
                color="text-amber-700"
                bgColor="bg-amber-100"
              />
              <StatCard
                icon={<Clock className="w-4 h-4" />}
                label="Shipment"
                value={shipmentDelays}
                color="text-red-700"
                bgColor="bg-red-100"
              />
            </div>
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Email Parser */}
          <div className="xl:col-span-4 lg:sticky lg:top-8 slide-up" style={{ animationDelay: "0.2s" }}>
            <EmailParser onOrderParsed={addOrder} />
          </div>

          {/* Right Column: PO Table */}
          <div className="xl:col-span-8 slide-up" style={{ animationDelay: "0.3s" }}>
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
        <footer className="mt-20 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <span className="font-semibold text-primary">PO Command</span>
              <span>&mdash;</span>
              <span>Intelligent supply chain management</span>
            </p>
            <p className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Operational
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
  bgColor,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
  delay?: string;
}) {
  return (
    <div
      className="glass-panel glass-card-hover rounded-xl p-4 cursor-default group border-orange-100/50"
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-row items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300`}>
          <span className={color}>{icon}</span>
        </div>
        <div className="min-w-0 flex flex-col">
          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">{label}</p>
          <p className={`text-2xl font-bold ${color} leading-none mt-1`} style={{ fontFamily: "var(--font-display)" }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="warm-card p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted/50 rounded-lg animate-pulse" />
        <div className="flex gap-3">
          <div className="h-10 w-64 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-muted/30 rounded-xl animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
