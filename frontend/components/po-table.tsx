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

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; bgColor: string; borderColor: string; lightBg: string }> = {
    "On Track": {
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        color: "text-emerald-400",
        bgColor: "bg-emerald-900/50",
        borderColor: "border-emerald-700/50",
        lightBg: "bg-emerald-950/40",
    },
    "Shipped": {
        icon: <Truck className="w-3.5 h-3.5" />,
        color: "text-sky-400",
        bgColor: "bg-sky-900/50",
        borderColor: "border-sky-700/50",
        lightBg: "bg-sky-950/40",
    },
    "Product Delays": {
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        color: "text-amber-400",
        bgColor: "bg-amber-900/50",
        borderColor: "border-amber-700/50",
        lightBg: "bg-amber-950/40",
    },
    "Shipment Delay": {
        icon: <Clock className="w-3.5 h-3.5" />,
        color: "text-rose-400",
        bgColor: "bg-rose-900/50",
        borderColor: "border-rose-700/50",
        lightBg: "bg-rose-950/40",
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
            <div className="warm-card overflow-hidden border border-border/50 h-full flex flex-col">
                {/* Header */}
                <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-border/50 bg-gradient-to-r from-background/50 to-secondary/30">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shadow-sm">
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                    Purchase Orders
                                </h2>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                    <span>{filteredOrders.length} orders</span>
                                    {selectedIds.size > 0 && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-primary/40" />
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
                                    className="border-rose-800/50 text-rose-400 hover:bg-rose-950/50 hover:border-rose-700/50 w-full sm:w-auto h-10 sm:h-9"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete ({selectedIds.size})
                                </Button>
                            )}

                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-full sm:w-64 bg-background/50 border-border hover:border-primary/30 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-10 sm:h-9 text-sm"
                                />
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-44 bg-background/50 border-border hover:border-primary/30 rounded-xl h-10 sm:h-9">
                                        <div className="flex items-center gap-2 truncate">
                                            <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                            <SelectValue placeholder="Status" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-card/95 backdrop-blur-md border-border rounded-xl">
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
                                        className="border-border hover:bg-secondary/50 flex-shrink-0 rounded-xl h-10 w-10 sm:h-9 sm:w-9"
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
                    <div className="hidden lg:grid lg:grid-cols-14 gap-4 px-6 py-3 bg-secondary/30 border-b border-border/50 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
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
                    <div className="divide-y divide-border/30">
                        {filteredOrders.length === 0 ? (
                            <div className="px-6 py-20 text-center flex flex-col items-center justify-center h-full">
                                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-muted-foreground/40" />
                                </div>
                                <p className="text-foreground font-medium text-lg">
                                    {orders.length === 0
                                        ? "No orders found"
                                        : "No matching orders"}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                                    {orders.length === 0
                                        ? "Paste a supplier email in the parser on the left to get started."
                                        : "Try adjusting your search criteria or status filter."}
                                </p>
                            </div>
                        ) : (
                            <div className="stagger-fade-in">
                                {filteredOrders.map((order) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
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

            {/* Dialogs - Kept visually consistent but minimal changes needed */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-rose-950/60 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Delete Order?</DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1">
                                    This action is permanent and cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {orderToDelete && (
                        <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3 my-2">
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
                            className="w-full sm:w-auto rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/30"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-rose-950/60 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Delete {selectedIds.size} Orders?</DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1">
                                    Are you sure you want to delete these orders? This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 my-2">
                        {selectedOrders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-lg border border-border bg-secondary/30 p-3 flex items-center justify-between"
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
                            className="w-full sm:w-auto rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmBulkDelete}
                            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/30"
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
    isSelected,
    onToggleSelect,
    onStatusUpdate,
    onEdit,
    onDelete,
}: {
    order: PurchaseOrder;
    isSelected: boolean;
    onToggleSelect: () => void;
    onStatusUpdate: (id: string, status: OrderStatus) => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const config = statusConfig[order.status as OrderStatus];

    return (
        <div className={`group px-4 py-3 sm:px-6 sm:py-4 transition-all duration-200 border-l-2 ${isSelected ? 'bg-primary/5 border-l-primary' : 'hover:bg-secondary/30 border-l-transparent'}`}>
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
                    <div className="w-8 h-8 rounded-lg bg-secondary/70 flex items-center justify-center flex-shrink-0">
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
                        <SelectTrigger className={`w-full h-9 ${config.lightBg} ${config.borderColor} border rounded-lg transition-all duration-200 hover:shadow-sm`}>
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <div className={`p-0.5 rounded-full ${config.bgColor}`}>
                                        {config.icon}
                                    </div>
                                    <span className={`text-xs font-semibold ${config.color}`}>{order.status}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-md border-border rounded-xl">
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
                                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg"
                                >
                                    <FileText className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 bg-card/95 backdrop-blur-xl border-border shadow-xl rounded-xl ml-4">
                                <div className="bg-amber-50/50 px-4 py-3 border-b border-amber-100/50">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-amber-600" />
                                        <span className="font-semibold text-sm text-amber-900">Additional Context</span>
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
                        className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg"
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
                            className="h-8 w-8 text-muted-foreground/70 hover:text-red-600 hover:bg-red-50 rounded-lg touch-manipulation"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Row 2: Items (Clamped) */}
                <div className="bg-secondary/30 rounded-lg p-2.5 text-sm text-foreground/90 border border-border/40">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Items</span>
                    <p className="line-clamp-2 leading-relaxed">{order.items}</p>
                </div>

                {/* Row 3: Meta & Status */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/20 px-2 py-1.5 rounded-md border border-border/30">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.expected_date || "No date"}
                    </div>

                    <div className="flex-1 max-w-[180px] relative z-20">
                        {/* Status Select with larger touch target */}
                        <div onClick={(e) => e.stopPropagation()}>
                            <Select
                                defaultValue={order.status}
                                onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
                            >
                                <SelectTrigger className={`w-full h-10 text-xs ${config.lightBg} ${config.borderColor} border rounded-lg touch-manipulation active:scale-[0.98] transition-transform`}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className={`p-1 rounded-full ${config.bgColor} flex-shrink-0`}>
                                            {config.icon}
                                        </div>
                                        <span className={`font-semibold truncate ${config.color}`}>{order.status}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-card/95 backdrop-blur-xl border-border rounded-xl shadow-2xl animate-in zoom-in-95"
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
                    <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-100/50">
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <p>{order.additional_context}</p>
                    </div>
                )}
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
