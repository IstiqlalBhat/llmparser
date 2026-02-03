"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EmailParser } from "@/components/email-parser";
import { POTable } from "@/components/po-table";
import { EditOrderDialog } from "@/components/edit-order-dialog";
import { LiquidGlassCard, LiquidGlassStatCard, LiquidGlassLargeCard } from "@/components/liquid-glass-card";
import { Toaster } from "sonner";
import { useOrders } from "@/hooks/use-orders";
import { Package, Zap, TrendingUp, Clock, Layers, AlertTriangle, Shield } from "lucide-react";
import { PurchaseOrder } from "@/types";

// Dynamically import Three.js background to avoid SSR issues
const SkyBackground = dynamic(
  () => import("@/components/sky-background").then((mod) => mod.SkyBackground),
  { ssr: false }
);

export default function Home() {
  const { orders, isLoading, addOrder, updateOrderStatus, deleteOrder, deleteOrders } = useOrders();
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder(order);
  };

  const handleSaveEdit = async (order: PurchaseOrder) => {
    await addOrder(order);
    setEditingOrder(null);
  };

  // Calculate stats
  const totalOrders = orders.length;
  const onTrackOrders = orders.filter(o => o.status === "On Track").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;
  const productDelays = orders.filter(o => o.status === "Product Delays").length;
  const shipmentDelays = orders.filter(o => o.status === "Shipment Delay").length;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Three.js Animated Background */}
      {mounted && <SkyBackground />}

      {/* Toaster with liquid glass styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-white/80 !backdrop-blur-xl !border-white/60 !shadow-xl !rounded-2xl",
          style: {
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            color: "#1a202c",
            borderRadius: "1.25rem",
          },
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
        {/* Header — Liquid Glass Hero Banner */}
        <header className="mb-10 lg:mb-14 float-up">
          <LiquidGlassCard
            variant="large"
            interactive={false}
            glowOnHover={false}
            className="!p-0"
            contentClassName=""
          >
            <div className="px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10 w-full">
              <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
                <div className="max-w-2xl">
                  {/* Brand Tag */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-slate-700">
                      Supply Chain Intelligence
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span className="aurora-shimmer">ORBITAL</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-4 text-slate-600 font-medium text-base lg:text-lg leading-relaxed text-balance max-w-lg">
                    AI-powered purchase order management. Parse supplier emails, track shipments,
                    and stay ahead of delays with intelligent automation.
                  </p>
                </div>

                {/* Stats Grid with Liquid Glass */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full xl:w-auto xl:min-w-[580px]">
                  <StatCard
                    icon={<Package className="w-5 h-5" />}
                    label="Total Orders"
                    value={totalOrders}
                    color="text-slate-700"
                    iconBg="bg-slate-200/80"
                    delay={0}
                  />
                  <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="On Track"
                    value={onTrackOrders}
                    color="text-emerald-600"
                    iconBg="bg-emerald-100"
                    delay={1}
                  />
                  <StatCard
                    icon={<Zap className="w-5 h-5" />}
                    label="Shipped"
                    value={shippedOrders}
                    color="text-sky-600"
                    iconBg="bg-sky-100"
                    delay={2}
                  />
                  <StatCard
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label="Product Delays"
                    value={productDelays}
                    color="text-amber-600"
                    iconBg="bg-amber-100"
                    delay={3}
                  />
                  <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Shipment Delays"
                    value={shipmentDelays}
                    color="text-rose-600"
                    iconBg="bg-rose-100"
                    delay={4}
                  />
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Email Parser */}
          <div className="xl:col-span-4 float-up stagger-2">
            <div className="xl:sticky xl:top-8">
              <EmailParser onOrderParsed={addOrder} />
            </div>
          </div>

          {/* Right Column: PO Table */}
          <div className="xl:col-span-8 float-up stagger-3">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <POTable
                orders={orders}
                onStatusUpdate={updateOrderStatus}
                onEdit={handleEditOrder}
                onDelete={deleteOrder}
                onDeleteMany={deleteOrders}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16">
          <LiquidGlassCard
            variant="stat"
            interactive={false}
            glowOnHover={false}
            className="!px-6 !py-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <p className="flex items-center gap-3 text-slate-600 font-medium">
                <span className="font-bold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
                  Orbital
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <span>Intelligent supply chain management</span>
              </p>
              <SystemStatus />
            </div>
          </LiquidGlassCard>
        </footer>
      </div>

      {/* Edit Order Dialog */}
      <EditOrderDialog
        open={!!editingOrder}
        onOpenChange={(open) => !open && setEditingOrder(null)}
        order={editingOrder}
        onSave={handleSaveEdit}
        title="Edit Order"
      />
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  iconBg,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  iconBg: string;
  delay: number;
}) {
  return (
    <LiquidGlassStatCard delay={delay}>
      <div className="p-3">
        <div className="flex flex-row items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
            <span className={color}>{icon}</span>
          </div>
          <div className="min-w-0 flex flex-col">
            <p className="text-[9px] text-slate-600 font-extrabold uppercase tracking-wider leading-tight">
              {label}
            </p>
            <p
              className={`text-xl font-bold ${color} leading-none mt-0.5`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {value}
            </p>
          </div>
        </div>
      </div>
    </LiquidGlassStatCard>
  );
}



function SystemStatus() {
  return (
    <LiquidGlassCard
      variant="stat"
      interactive={false}
      className="!px-4 !py-2"
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-slate-700 text-xs font-bold tracking-wide">
          System Operational
        </span>
      </div>
    </LiquidGlassCard>
  );
}

function LoadingSkeleton() {
  return (
    <LiquidGlassLargeCard
      className="p-6 lg:p-8 h-[72vh] min-h-[420px] max-h-[720px] sm:min-h-[480px] lg:min-h-[560px] xl:h-[clamp(600px,70vh,760px)] xl:max-h-none"
      contentClassName="flex flex-col h-full min-h-0 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded-xl bg-slate-200/80 animate-pulse" />
        <div className="flex gap-3">
          <div className="h-10 w-64 rounded-xl bg-slate-200/80 animate-pulse" />
          <div className="h-10 w-32 rounded-xl bg-slate-200/80 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-slate-200/80 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 1 - i * 0.15 }}
          />
        ))}
      </div>
    </LiquidGlassLargeCard>
  );
}
