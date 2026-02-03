"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
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
import { LiquidGlassCard } from "@/components/liquid-glass-card";

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
        color: "text-emerald-700",
        bgClass: "bg-emerald-200/35",
        borderClass: "border-emerald-300/60",
    },
    "Shipped": {
        icon: <Truck className="w-3.5 h-3.5" />,
        color: "text-sky-700",
        bgClass: "bg-sky-200/35",
        borderClass: "border-sky-300/60",
    },
    "Product Delays": {
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        color: "text-amber-700",
        bgClass: "bg-amber-200/35",
        borderClass: "border-amber-300/60",
    },
    "Shipment Delay": {
        icon: <Clock className="w-3.5 h-3.5" />,
        color: "text-rose-700",
        bgClass: "bg-rose-200/35",
        borderClass: "border-rose-300/60",
    },
};

export function POTable({ orders, onStatusUpdate, onEdit, onDelete, onDeleteMany }: POTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<PurchaseOrder | null>(null);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const tableScrollRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const container = tableScrollRef.current;
        if (!container) return;

        const items = Array.from(container.querySelectorAll<HTMLElement>("[data-row]"));
        items.forEach((item) => item.classList.remove("is-visible"));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { root: container, threshold: 0.15 }
        );

        items.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [filteredOrders]);

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
            <LiquidGlassCard
                variant="large"
                interactive={false}
                glowOnHover={false}
                className="flex flex-col h-[72vh] min-h-[320px] max-h-[720px] sm:min-h-[480px] lg:min-h-[560px] xl:h-[clamp(600px,70vh,760px)] xl:max-h-none overflow-hidden"
                contentClassName="flex flex-col h-full min-h-0 overflow-hidden"
            >
                {/* Header */}
                <div className="px-3 py-3 sm:px-6 sm:py-5 border-b border-white/40 relative overflow-hidden shrink-0">
                    {/* Header gradient accent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-amber-500/5" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <LiquidGlassCard
                                variant="stat"
                                interactive={false}
                                className="w-12 h-12 !rounded-2xl shrink-0"
                                contentClassName="flex items-center justify-center"
                            >
                                <Package className="w-6 h-6 text-sky-600" />
                            </LiquidGlassCard>
                            <div>
                                <h2
                                    className="text-xl font-bold text-slate-800 tracking-tight"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Purchase Orders
                                </h2>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-bold mt-0.5">
                                    <span>{filteredOrders.length} orders</span>
                                    {selectedIds.size > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-sky-500/60" />
                                            <span className="text-sky-600 font-medium">{selectedIds.size} selected</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Filters & Actions */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
                            {/* Mobile Select All Button - compact inline */}
                            {filteredOrders.length > 0 && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="lg:hidden border-sky-400/30 text-sky-600 hover:bg-sky-500/10 hover:border-sky-400/50 h-9 px-3 rounded-xl touch-manipulation"
                                >
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={toggleSelectAll}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                toggleSelectAll();
                                            }
                                        }}
                                        className="flex items-center justify-center"
                                    >
                                        <Checkbox
                                            checked={isAllSelected}
                                            onCheckedChange={toggleSelectAll}
                                            className="w-4 h-4 mr-1.5 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 pointer-events-none"
                                            {...(isSomeSelected ? { "data-state": "indeterminate" } : {})}
                                        />
                                        <span className="text-xs">{isAllSelected ? "Deselect" : "Select All"}</span>
                                    </div>
                                </Button>
                            )}

                            {selectedIds.size > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBulkDeleteClick}
                                    className="border-rose-400/30 text-rose-500 hover:bg-rose-500/10 hover:border-rose-400/50 h-9 px-3 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Delete ({selectedIds.size})</span>
                                    <span className="sm:hidden text-xs">({selectedIds.size})</span>
                                </Button>
                            )}

                            <div className="relative flex-1 min-w-[120px] sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 w-full sm:w-56 glass-input rounded-xl h-9 text-sm focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10"
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[110px] sm:w-44 glass-input rounded-xl h-9">
                                    <div className="flex items-center gap-1.5 truncate">
                                        <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm"><SelectValue placeholder="Status" /></span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="!bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-2xl !shadow-xl" position="popper" sideOffset={4}>
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
                                    className="ghost-glow flex-shrink-0 rounded-xl h-9 w-9"
                                    title="Clear filters"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div
                    ref={tableScrollRef}
                    className="overflow-y-auto overflow-x-hidden flex-1 min-h-0 custom-scrollbar table-scroll-area overscroll-contain touch-pan-y w-full"
                >
                    {/* Table header */}
                    <div className="hidden lg:grid lg:grid-cols-14 gap-4 px-6 py-3.5 bg-slate-100/60 border-b border-white/40 text-xs font-extrabold text-slate-700 uppercase tracking-wide sticky top-0 backdrop-blur-md z-10">
                        <div className="col-span-1 flex items-center justify-center">
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={toggleSelectAll}
                                className="w-5 h-5 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 touch-manipulation"
                                {...(isSomeSelected ? { "data-state": "indeterminate" } : {})}
                            />
                        </div>
                        <div className="col-span-2 flex items-center">PO ID</div>
                        <div className="col-span-2 flex items-center">Supplier</div>
                        <div className="col-span-3 flex items-center">Items</div>
                        <div className="col-span-2 flex items-center">Expected</div>
                        <div className="col-span-2 flex items-center">Status</div>
                        <div className="col-span-2 flex items-center justify-end">Actions</div>
                    </div>

                    {/* Table body */}
                    <div className="divide-y divide-white/30">
                        {filteredOrders.length === 0 ? (
                            <div className="px-6 py-20 text-center flex flex-col items-center justify-center h-full">
                                <LiquidGlassCard
                                    variant="stat"
                                    interactive={false}
                                    className="w-20 h-20 !rounded-3xl mb-5"
                                    contentClassName="flex items-center justify-center"
                                >
                                    <Package className="w-10 h-10 text-slate-400" />
                                </LiquidGlassCard>
                                <p
                                    className="text-slate-900 font-bold text-lg"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {orders.length === 0
                                        ? "No orders found"
                                        : "No matching orders"}
                                </p>
                                <p className="text-sm text-slate-700 font-semibold mt-2 max-w-xs mx-auto">
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
            </LiquidGlassCard>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="!bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-3xl !shadow-2xl sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <LiquidGlassCard
                                variant="stat"
                                interactive={false}
                                className="w-14 h-14 !rounded-2xl"
                                contentClassName="flex items-center justify-center"
                            >
                                <AlertCircle className="w-7 h-7 text-rose-500" />
                            </LiquidGlassCard>
                            <div>
                                <DialogTitle className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
                                    Delete Order?
                                </DialogTitle>
                                <DialogDescription className="text-slate-700 mt-1">
                                    This action is permanent and cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {orderToDelete && (
                        <div className="rounded-xl glass-surface border border-white/50 p-4 space-y-3 my-2">
                            <div className="flex items-center justify-between">
                                <span
                                    className="text-sm font-semibold text-slate-800"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {orderToDelete.id}
                                </span>
                                <StatusBadge status={orderToDelete.status} />
                            </div>
                            <div className="text-sm text-slate-600">
                                <span className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Items</span>
                                <span className="text-slate-800">{orderToDelete.items}</span>
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
                            className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 rounded-xl"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Dialog */}
            <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                <DialogContent className="!bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-3xl !shadow-2xl sm:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <LiquidGlassCard
                                variant="stat"
                                interactive={false}
                                className="w-14 h-14 !rounded-2xl"
                                contentClassName="flex items-center justify-center"
                            >
                                <AlertCircle className="w-7 h-7 text-rose-500" />
                            </LiquidGlassCard>
                            <div>
                                <DialogTitle className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
                                    Delete {selectedIds.size} Orders?
                                </DialogTitle>
                                <DialogDescription className="text-slate-700 mt-1">
                                    Are you sure you want to delete these orders? This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 my-2 custom-scrollbar">
                        {selectedOrders.map((order) => (
                            <LiquidGlassCard
                                key={order.id}
                                variant="stat"
                                interactive={false}
                                className="!p-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-sm font-medium text-slate-800"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {order.id}
                                    </span>
                                    <span className="text-sm text-slate-500 truncate max-w-[150px]">
                                        {order.supplier}
                                    </span>
                                </div>
                            </LiquidGlassCard>
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
                            className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 rounded-xl"
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
            data-row
            className={`group row-reveal px-4 py-3 sm:px-6 sm:py-4 transition-all duration-300 border-l-2 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${isSelected
                ? 'bg-sky-200/15 border-l-sky-500'
                : 'bg-white/15 hover:bg-white/25 border-l-transparent'
                }`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Desktop layout */}
            <div className="hidden lg:grid lg:grid-cols-14 gap-4 items-center">
                {/* Checkbox */}
                <div className="col-span-1 flex items-center justify-center">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onToggleSelect}
                        className="w-5 h-5 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 touch-manipulation"
                    />
                </div>

                {/* PO ID */}
                <div className="col-span-2 flex items-center">
                    <span className="font-mono text-sm font-semibold text-slate-800/90">
                        {order.id}
                    </span>
                </div>

                {/* Supplier */}
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg glass-surface flex items-center justify-center flex-shrink-0 border border-white/50">
                        <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <TextReveal
                        label="Supplier"
                        text={order.supplier}
                        triggerClassName="text-sm font-semibold text-slate-800 truncate"
                        contentClassName="max-w-[min(420px,calc(100vw-24px))]"
                    />
                </div>

                {/* Items */}
                <div className="col-span-3 flex items-center min-w-0">
                    <TextReveal
                        label="Items"
                        text={order.items}
                        triggerClassName="text-sm text-slate-700 leading-snug line-clamp-2"
                        contentClassName="max-w-[min(520px,calc(100vw-24px))]"
                    />
                </div>

                {/* Expected Date */}
                <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400/70 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{order.expected_date || "—"}</span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center">
                    <Select
                        defaultValue={order.status}
                        onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
                    >
                        <SelectTrigger className={`w-full h-9 ${config.bgClass} ${config.borderClass} border rounded-xl transition-all duration-200 shadow-sm backdrop-blur-md hover:shadow-md`}>
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <span className={config.color}>{config.icon}</span>
                                    <span className={`text-xs font-bold ${config.color}`}>{order.status}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="!bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-2xl !shadow-xl">
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
                <div className="col-span-2 flex items-center justify-end gap-1">
                    {order.additional_context && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-700 bg-white/35 border border-white/60 shadow-sm backdrop-blur-md hover:text-amber-800 hover:bg-white/45 rounded-lg"
                                >
                                    <FileText className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 !bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-2xl !shadow-xl ml-4">
                                <div className="bg-amber-500/10 px-4 py-3 border-b border-amber-400/20 rounded-t-2xl">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-amber-500" />
                                        <span className="font-semibold text-sm text-amber-600">Additional Context</span>
                                    </div>
                                </div>
                                <div className="p-4 text-sm leading-relaxed text-slate-700">
                                    {order.additional_context}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        className="h-8 w-8 text-sky-700 bg-white/35 border border-white/60 shadow-sm backdrop-blur-md hover:text-sky-800 hover:bg-white/45 rounded-lg"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="h-8 w-8 text-rose-700 bg-white/35 border border-white/60 shadow-sm backdrop-blur-md hover:text-rose-800 hover:bg-white/45 rounded-lg"
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
                            className="w-5 h-5 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 touch-manipulation"
                        />
                        <div>
                            <span
                                className="text-sm font-bold text-slate-800"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {order.id}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 min-w-0">
                                <Building2 className="w-3 h-3 text-slate-500" />
                                <TextReveal
                                    label="Supplier"
                                    text={order.supplier}
                                    triggerClassName="text-xs font-medium text-slate-600 truncate"
                                    contentClassName="max-w-[min(420px,calc(100vw-24px))]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onEdit}
                            className="h-8 w-8 text-sky-700 bg-white/35 border border-white/60 shadow-sm backdrop-blur-md hover:text-sky-800 hover:bg-white/45 rounded-lg touch-manipulation"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="h-8 w-8 text-rose-700 bg-white/35 border border-white/60 shadow-sm backdrop-blur-md hover:text-rose-800 hover:bg-white/45 rounded-lg touch-manipulation"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Row 2: Items (Clamped) */}
                <div className="glass-surface rounded-xl p-3 text-sm text-slate-800/90 border border-white/50">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Items</span>
                    <TextReveal
                        label="Items"
                        text={order.items}
                        triggerClassName="line-clamp-2 leading-relaxed text-left"
                        contentClassName="max-w-[min(520px,calc(100vw-24px))]"
                    />
                </div>

                {/* Row 3: Meta & Status */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 glass-surface px-3 py-2 rounded-xl border border-white/50">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.expected_date || "No date"}
                    </div>

                    <div className="flex-1 max-w-[180px] relative z-20">
                        <div onClick={(e) => e.stopPropagation()}>
                            <Select
                                defaultValue={order.status}
                                onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
                            >
                                <SelectTrigger className={`w-full h-10 text-xs ${config.bgClass} ${config.borderClass} border rounded-xl touch-manipulation active:scale-[0.98] transition-transform shadow-sm backdrop-blur-md`}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className={config.color}>{config.icon}</span>
                                        <span className={`font-bold truncate ${config.color}`}>{order.status}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent
                                    className="!bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-2xl !shadow-2xl"
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
                    <div className="flex items-start gap-2 text-xs text-amber-600 glass-surface p-3 rounded-xl border border-amber-400/20">
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <p className="leading-relaxed">{order.additional_context}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TextReveal({
    label,
    text,
    triggerClassName,
    contentClassName,
}: {
    label: string;
    text: string;
    triggerClassName: string;
    contentClassName?: string;
}) {
    if (!text) {
        return <span className={triggerClassName}>—</span>;
    }

    return (
        <HoverCard openDelay={200} closeDelay={150}>
            <HoverCardTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "min-w-0 w-full text-left bg-transparent p-0 outline-none cursor-pointer",
                        "hover:text-sky-600 transition-colors duration-200",
                        "focus-visible:ring-2 focus-visible:ring-sky-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                        triggerClassName
                    )}
                >
                    {text}
                </button>
            </HoverCardTrigger>
            <HoverCardContent
                side="top"
                align="start"
                sideOffset={10}
                className={cn(
                    "p-0 w-fit rounded-2xl border border-white/60 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200",
                    contentClassName
                )}
                style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.85) 50%, rgba(241,245,249,0.80) 100%)",
                    backdropFilter: "blur(40px) saturate(200%)",
                    WebkitBackdropFilter: "blur(40px) saturate(200%)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(0, 0, 0, 0.02)",
                }}
            >
                {/* Gradient accent bar */}
                <div className="h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-500" />

                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-b from-white/50 to-transparent border-b border-white/30 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 shadow-sm shadow-sky-400/40 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                        {label}
                    </span>
                </div>

                {/* Content */}
                <div className="px-4 py-4 text-[15px] text-slate-800 font-semibold leading-relaxed max-h-64 overflow-y-auto custom-scrollbar break-words">
                    {text}
                </div>

                {/* Bottom shine */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </HoverCardContent>
        </HoverCard>
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
                return "glass-surface text-slate-800";
        }
    };

    return (
        <Badge variant="outline" className={`${getStatusClass()} font-medium text-xs px-2`}>
            {status}
        </Badge>
    );
}
