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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Trash2,
  AlertCircle,
  Info,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface POTableProps {
  orders: PurchaseOrder[];
  onStatusUpdate: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  onDeleteMany: (ids: string[]) => void;
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

export function POTable({ orders, onStatusUpdate, onDelete, onDeleteMany }: POTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<PurchaseOrder | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

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

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = filteredOrders.length > 0 && selectedIds.size === filteredOrders.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < filteredOrders.length;

  // Delete handlers
  const handleDeleteClick = (order: PurchaseOrder) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      onDelete(orderToDelete.id);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      selectedIds.delete(orderToDelete.id);
      setSelectedIds(new Set(selectedIds));
    }
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    onDeleteMany(Array.from(selectedIds));
    setBulkDeleteDialogOpen(false);
    setSelectedIds(new Set());
  };

  const selectedOrders = orders.filter(o => selectedIds.has(o.id));

  return (
    <>
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
                  {selectedIds.size > 0 && (
                    <span className="text-primary font-medium"> · {selectedIds.size} selected</span>
                  )}
                </p>
              </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedIds.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDeleteClick}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete {selectedIds.size} selected
                </Button>
              )}

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
          <div className="hidden lg:grid lg:grid-cols-13 gap-4 px-6 py-3 bg-secondary/30 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                {...(isSomeSelected ? { "data-state": "indeterminate" } : {})}
              />
            </div>
            <div className="col-span-2">PO ID</div>
            <div className="col-span-2">Supplier</div>
            <div className="col-span-3">Items</div>
            <div className="col-span-2">Expected</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Actions</div>
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
                  isSelected={selectedIds.has(order.id)}
                  onToggleSelect={() => toggleSelect(order.id)}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={() => handleDeleteClick(order)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg">Delete Order?</DialogTitle>
                <DialogDescription className="text-sm">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {orderToDelete && (
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-primary">
                  {orderToDelete.id}
                </span>
                <StatusBadge status={orderToDelete.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs block">Supplier</span>
                  <span className="font-medium">{orderToDelete.supplier}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Expected</span>
                  <span className="font-medium">{orderToDelete.expected_date || "Not set"}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Items</span>
                <span className="text-sm">{orderToDelete.items}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg">Delete {selectedIds.size} Orders?</DialogTitle>
                <DialogDescription className="text-sm">
                  This action cannot be undone. The following orders will be permanently deleted.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {selectedOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-border bg-secondary/30 p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {order.id}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {order.supplier}
                  </span>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              No, Keep Them
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBulkDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Yes, Delete All {selectedIds.size}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrderRow({
  order,
  isSelected,
  onToggleSelect,
  onStatusUpdate,
  onDelete,
}: {
  order: PurchaseOrder;
  isSelected: boolean;
  onToggleSelect: () => void;
  onStatusUpdate: (id: string, status: OrderStatus) => void;
  onDelete: () => void;
}) {
  const config = statusConfig[order.status as OrderStatus];

  return (
    <div className={`group px-6 py-4 transition-colors duration-200 ${isSelected ? 'bg-primary/5' : 'hover:bg-secondary/20'}`}>
      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-13 gap-4 items-center">
        {/* Checkbox */}
        <div className="col-span-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>

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

        {/* Actions */}
        <div className="col-span-1 flex items-center gap-1">
          {order.additional_context && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  title="View additional details"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-card border-border shadow-lg rounded-xl overflow-hidden" align="end">
                <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 px-4 py-3 border-b border-amber-200/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Info className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-amber-900">Additional Context</h4>
                      <p className="text-xs text-amber-700/70">{order.id}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {order.additional_context}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
            title="Delete order"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div>
              <span className="font-mono text-sm font-semibold text-primary">
                {order.id}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{order.supplier}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <StatusBadge status={order.status} />
            {order.additional_context && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    title="View additional details"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 bg-card border-border shadow-lg rounded-xl overflow-hidden" align="end">
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 px-3 py-2 border-b border-amber-200/50">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-xs text-amber-900">Additional Context</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-foreground leading-relaxed">
                      {order.additional_context}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
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

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "On Track":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Product Delays":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Shipment Delay":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyles()} font-medium text-xs`}>
      {status}
    </Badge>
  );
}
