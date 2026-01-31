"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { OrderStatus, PurchaseOrder } from "@/types";
import {
  Search,
  X,
  Filter,
  Package,
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface POTableProps {
  orders: PurchaseOrder[];
  onStatusUpdate: (id: string, status: OrderStatus) => void;
}

const ALL_STATUSES = "all";

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; bgColor: string; borderColor: string; lightBg: string }> = {
  "On Track": {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
    lightBg: "bg-emerald-50",
  },
  "Shipped": {
    icon: <Truck className="w-3.5 h-3.5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    lightBg: "bg-blue-50",
  },
  "Product Delays": {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    lightBg: "bg-amber-50",
  },
  "Shipment Delay": {
    icon: <Clock className="w-3.5 h-3.5" />,
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    lightBg: "bg-red-50",
  },
};

export function POTable({ orders, onStatusUpdate }: POTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === ALL_STATUSES || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(ALL_STATUSES);
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== ALL_STATUSES;

  return (
    <div className="warm-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Purchase Orders
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white/80 border-border hover:border-primary/30 focus:border-primary focus:ring-primary/20 rounded-xl"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44 bg-white/80 border-border hover:border-primary/30 rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl">
                <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    <span className="flex items-center gap-2">
                      <span className={config.color}>{config.icon}</span>
                      {status}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className="border-border hover:bg-secondary/50 flex-shrink-0 rounded-xl"
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Table header */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-secondary/30 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-2">PO ID</div>
          <div className="col-span-2">Supplier</div>
          <div className="col-span-3">Items</div>
          <div className="col-span-2">Expected</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Updated</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-border/30 stagger-fade-in">
          {filteredOrders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-foreground font-medium">
                {orders.length === 0
                  ? "No orders yet"
                  : "No matching orders"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {orders.length === 0
                  ? "Parse an email to create your first order"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onStatusUpdate={onStatusUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  onStatusUpdate,
}: {
  order: PurchaseOrder;
  onStatusUpdate: (id: string, status: OrderStatus) => void;
}) {
  const config = statusConfig[order.status as OrderStatus];

  return (
    <div className="group px-6 py-4 hover:bg-secondary/20 transition-colors duration-200">
      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
        {/* PO ID */}
        <div className="col-span-2">
          <span className="font-mono text-sm font-semibold text-primary">
            {order.id}
          </span>
        </div>

        {/* Supplier */}
        <div className="col-span-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary/70 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-sm truncate font-medium">{order.supplier}</span>
        </div>

        {/* Items */}
        <div className="col-span-3">
          <p className="text-sm text-muted-foreground truncate" title={order.items}>
            {order.items}
          </p>
        </div>

        {/* Expected Date */}
        <div className="col-span-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm">{order.expected_date || "—"}</span>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <Select
            defaultValue={order.status}
            onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
          >
            <SelectTrigger className={`w-full h-9 ${config.lightBg} ${config.borderColor} border rounded-lg`}>
              <SelectValue>
                <span className={`flex items-center gap-2 ${config.color}`}>
                  {config.icon}
                  <span className="text-xs font-medium">{order.status}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              {Object.entries(statusConfig).map(([status, cfg]) => (
                <SelectItem key={status} value={status}>
                  <span className={`flex items-center gap-2 ${cfg.color}`}>
                    {cfg.icon}
                    <span>{status}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Last Updated */}
        <div className="col-span-1">
          <span className="text-xs text-muted-foreground">{order.last_updated}</span>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-sm font-semibold text-primary">
              {order.id}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">{order.supplier}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${config.bgColor} ${config.borderColor} ${config.color} flex items-center gap-1.5`}
          >
            {config.icon}
            <span className="text-xs">{order.status}</span>
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{order.items}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {order.expected_date || "No date"}
          </span>
          <span>Updated: {order.last_updated}</span>
        </div>

        <Select
          defaultValue={order.status}
          onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
        >
          <SelectTrigger className={`w-full h-9 ${config.lightBg} ${config.borderColor} border rounded-lg`}>
            <span className="text-xs font-medium">Change Status</span>
            <MoreHorizontal className="w-4 h-4 ml-auto" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border rounded-xl">
            {Object.entries(statusConfig).map(([status, cfg]) => (
              <SelectItem key={status} value={status}>
                <span className={`flex items-center gap-2 ${cfg.color}`}>
                  {cfg.icon}
                  <span>{status}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
