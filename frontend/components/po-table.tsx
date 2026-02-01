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
    Trash2,
    AlertCircle,
    Info,
    FileText,
    Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface POTableProps {
    orders: PurchaseOrder[];
    onStatusUpdate: (id: string, status: OrderStatus) => void;
    onEdit: (order: PurchaseOrder) => void;
    onDelete: (id: string) => void;
    onDeleteMany: (ids: string[]) => void;
}

const ALL_STATUSES = "all";

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; bgClass: string; borderClass: string }> = {
    "On Track": {
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        color: "text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]",
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/30",
    },
    // Changed to Cyan for "electric" feel
    "Shipped": {
        icon: <Truck className="w-3.5 h-3.5" />,
        color: "text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]",
        bgClass: "bg-cyan-500/10",
        borderClass: "border-cyan-500/30",
    },
    // More vibrant amber/yellow
    "Product Delays": {
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        color: "text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]",
        bgClass: "bg-yellow-500/10",
        borderClass: "border-yellow-500/30",
    },
    // Neon red/pink for delay
    "Shipment Delay": {
        icon: <Clock className="w-3.5 h-3.5" />,
        color: "text-rose-400 drop-shadow-[0_0_3px_rgba(251,113,133,0.5)]",
        bgClass: "bg-rose-500/10",
        borderClass: "border-rose-500/30",
    },
};

export function POTable({ orders, onStatusUpdate, onEdit, onDelete, onDeleteMany }: POTableProps) {
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
            <div className="glass-card overflow-hidden h-full flex flex-col">
                {/* Header */}
                <div className="px-4 py-5 sm:px-6 border-b border-border/50 relative overflow-hidden">
                    {/* Header gradient accent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl glass-surface flex items-center justify-center border border-primary/20 glow-sm">
                                <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2
                                    className="text-xl font-bold text-slate-800 tracking-tight"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Purchase Orders
                                </h2>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                                    <span>{filteredOrders.length} orders</span>
                                    {selectedIds.size > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-primary/60" />
                                            <span className="text-primary font-medium">{selectedIds.size} selected</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Filters & Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                            {selectedIds.size > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBulkDeleteClick}
                                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 w-full sm:w-auto h-10 sm:h-9 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete ({selectedIds.size})
                                </Button>
                            )}

                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-full sm:w-64 glass-input rounded-xl h-10 sm:h-9 text-sm focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-44 glass-input rounded-xl h-10 sm:h-9">
                                        <div className="flex items-center gap-2 truncate">
                                            <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                            <SelectValue placeholder="Status" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="glass-card backdrop-blur-xl border-border rounded-xl">
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
                                        className="ghost-glow flex-shrink-0 rounded-xl h-10 w-10 sm:h-9 sm:w-9"
                                        title="Clear filters"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-auto flex-1 custom-scrollbar">
                    {/* Table header */}
                    <div className="hidden lg:grid lg:grid-cols-14 gap-4 px-6 py-3.5 bg-slate-100/90 border-b border-slate-200 text-xs font-extrabold text-slate-700 uppercase tracking-wide">
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
                        <div className="col-span-2">Actions</div>
                    </div>

                    {/* Table body */}
                    <div className="divide-y divide-border/20">
                        {filteredOrders.length === 0 ? (
                            <div className="px-6 py-20 text-center flex flex-col items-center justify-center h-full">
                                <div className="w-20 h-20 rounded-3xl glass-surface flex items-center justify-center mb-5 glow-sm">
                                    <Package className="w-10 h-10 text-slate-400" />
                                </div>
                                <p
                                    className="text-slate-800 font-bold text-lg"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {orders.length === 0
                                        ? "No orders found"
                                        : "No matching orders"}
                                </p>
                                <p className="text-sm text-slate-600 font-medium mt-2 max-w-xs mx-auto">
                                    {orders.length === 0
                                        ? "Paste a supplier email in the parser to get started."
                                        : "Try adjusting your search criteria or status filter."}
                                </p>
                            </div>
                        ) : (
                            <div>
                                {filteredOrders.map((order, index) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        index={index}
                                        isSelected={selectedIds.has(order.id)}
                                        onToggleSelect={() => toggleSelect(order.id)}
                                        onStatusUpdate={onStatusUpdate}
                                        onEdit={() => onEdit(order)}
                                        onDelete={() => handleDeleteClick(order)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md glass-card backdrop-blur-xl border-border">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center flex-shrink-0 border border-destructive/30">
                                <AlertCircle className="w-7 h-7 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
                                    Delete Order?
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1">
                                    This action is permanent and cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {orderToDelete && (
                        <div className="rounded-xl glass-surface border border-border p-4 space-y-3 my-2">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm font-semibold text-foreground">
                                    {orderToDelete.id}
                                </span>
                                <StatusBadge status={orderToDelete.status} />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">Items</span>
                                <span className="text-foreground">{orderToDelete.items}</span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="w-full sm:w-auto rounded-xl ghost-glow"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 rounded-xl"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Dialog */}
            <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                <DialogContent className="sm:max-w-lg glass-card backdrop-blur-xl border-border">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center flex-shrink-0 border border-destructive/30">
                                <AlertCircle className="w-7 h-7 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
                                    Delete {selectedIds.size} Orders?
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1">
                                    Are you sure you want to delete these orders? This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 my-2 custom-scrollbar">
                        {selectedOrders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-lg glass-surface border border-border/50 p-3 flex items-center justify-between"
                            >
                                <span className="font-mono text-sm font-medium text-foreground">
                                    {order.id}
                                </span>
                                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                                    {order.supplier}
                                </span>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setBulkDeleteDialogOpen(false)}
                            className="w-full sm:w-auto rounded-xl ghost-glow"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmBulkDelete}
                            className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 rounded-xl"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete {selectedIds.size} Orders
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function OrderRow({
    order,
    index,
    isSelected,
    onToggleSelect,
    onStatusUpdate,
    onEdit,
    onDelete,
}: {
    order: PurchaseOrder;
    index: number;
    isSelected: boolean;
    onToggleSelect: () => void;
    onStatusUpdate: (id: string, status: OrderStatus) => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const config = statusConfig[order.status as OrderStatus];

    return (
        <div
            className={`group px-4 py-3 sm:px-6 sm:py-4 transition-all duration-300 border-l-2 ${isSelected
                    ? 'bg-primary/5 border-l-primary'
                    : 'hover:bg-primary/5 border-l-transparent'
                }`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Desktop layout */}
            <div className="hidden lg:grid lg:grid-cols-14 gap-4 items-center">
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
                    <span className="font-mono text-sm font-semibold text-foreground/90">
                        {order.id}
                    </span>
                </div>

                {/* Supplier */}
                <div className="col-span-2 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl glass-surface flex items-center justify-center flex-shrink-0 border border-border/50">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm truncate font-medium text-foreground">{order.supplier}</span>
                </div>

                {/* Items */}
                <div className="col-span-3">
                    <p className="text-sm text-muted-foreground truncate" title={order.items}>
                        {order.items}
                    </p>
                </div>

                {/* Expected Date */}
                <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground/80">{order.expected_date || "—"}</span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                    <Select
                        defaultValue={order.status}
                        onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
                    >
                        <SelectTrigger className={`w-full h-9 ${config.bgClass} ${config.borderClass} border rounded-xl transition-all duration-200 hover:glow-sm`}>
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <span className={config.color}>{config.icon}</span>
                                    <span className={`text-xs font-semibold ${config.color}`}>{order.status}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="glass-card backdrop-blur-xl border-border rounded-xl">
                            {Object.entries(statusConfig).map(([status, cfg]) => (
                                <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                        <span className={cfg.color}>{cfg.icon}</span>
                                        <span>{status}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {order.additional_context && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg"
                                >
                                    <FileText className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 glass-card backdrop-blur-xl border-border shadow-xl rounded-xl ml-4">
                                <div className="bg-amber-500/10 px-4 py-3 border-b border-amber-500/20 rounded-t-xl">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-amber-400" />
                                        <span className="font-semibold text-sm text-amber-400">Additional Context</span>
                                    </div>
                                </div>
                                <div className="p-4 text-sm leading-relaxed text-foreground/90">
                                    {order.additional_context}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Mobile / Tablet layout */}
            <div className="lg:hidden flex flex-col gap-3">
                {/* Row 1: Checkbox, ID, Actions */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={onToggleSelect}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div>
                            <span className="font-mono text-sm font-bold text-foreground">
                                {order.id}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Building2 className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">{order.supplier}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onEdit}
                            className="h-8 w-8 text-muted-foreground/70 hover:text-primary hover:bg-primary/10 rounded-lg touch-manipulation"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="h-8 w-8 text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-lg touch-manipulation"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Row 2: Items (Clamped) */}
                <div className="glass-surface rounded-xl p-3 text-sm text-foreground/90 border border-border/30">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Items</span>
                    <p className="line-clamp-2 leading-relaxed">{order.items}</p>
                </div>

                {/* Row 3: Meta & Status */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground glass-surface px-3 py-2 rounded-lg border border-border/30">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.expected_date || "No date"}
                    </div>

                    <div className="flex-1 max-w-[180px] relative z-20">
                        <div onClick={(e) => e.stopPropagation()}>
                            <Select
                                defaultValue={order.status}
                                onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
                            >
                                <SelectTrigger className={`w-full h-10 text-xs ${config.bgClass} ${config.borderClass} border rounded-xl touch-manipulation active:scale-[0.98] transition-transform`}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className={config.color}>{config.icon}</span>
                                        <span className={`font-semibold truncate ${config.color}`}>{order.status}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent
                                    className="glass-card backdrop-blur-xl border-border rounded-xl shadow-2xl"
                                    position="popper"
                                    sideOffset={4}
                                    align="end"
                                >
                                    {Object.entries(statusConfig).map(([status, cfg]) => (
                                        <SelectItem key={status} value={status} className="py-3 touch-manipulation cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <span className={cfg.color}>{cfg.icon}</span>
                                                <span className="font-medium">{status}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Additional Context Indicator (Mobile) */}
                {order.additional_context && (
                    <div className="flex items-start gap-2 text-xs text-amber-400 glass-surface p-3 rounded-xl border border-amber-500/20">
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <p className="leading-relaxed">{order.additional_context}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const getStatusClass = () => {
        switch (status) {
            case "On Track":
                return "status-on-track";
            case "Shipped":
                return "status-shipped";
            case "Product Delays":
                return "status-product-delay";
            case "Shipment Delay":
                return "status-shipment-delay";
            default:
                return "glass-surface text-foreground";
        }
    };

    return (
        <Badge variant="outline" className={`${getStatusClass()} font-medium text-xs px-2`}>
            {status}
        </Badge>
    );
}
