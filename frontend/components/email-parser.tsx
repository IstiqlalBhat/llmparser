"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Check, X, Mail, Cpu, FileText, Info, Pencil, Plus, AlertTriangle } from "lucide-react";
import { PurchaseOrder } from "@/types";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { EditOrderDialog } from "@/components/edit-order-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmailParserProps {
    onOrderParsed: (order: PurchaseOrder) => void;
}

export function EmailParser({ onOrderParsed }: EmailParserProps) {
    const [emailText, setEmailText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [parsedOrders, setParsedOrders] = useState<PurchaseOrder[]>([]);
    const [parseErrors, setParseErrors] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Edit State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
    const [isManualEntry, setIsManualEntry] = useState(false);

    // Duplicate tracking state
    const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
    const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
    const [pendingOrder, setPendingOrder] = useState<PurchaseOrder | null>(null);

    const handleParse = async () => {
        if (!emailText.trim()) return;

        setIsParsing(true);
        setError(null);
        setParsedOrders([]);
        setParseErrors([]);
        setExistingIds(new Set());

        try {
            const result = await api.orders.parseEmail(emailText);
            setParsedOrders(result.parsed_data);
            setParseErrors(result.errors || []);
            setExistingIds(new Set(result.existing_ids || []));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsParsing(false);
        }
    };

    const handleAcceptOrder = (order: PurchaseOrder) => {
        if (existingIds.has(order.id)) {
            setPendingOrder(order);
            setDuplicateDialogOpen(true);
        } else {
            onOrderParsed(order);
            setParsedOrders(prev => prev.filter(o => o.id !== order.id));
        }
    };

    const handleConfirmOverwrite = () => {
        if (pendingOrder) {
            onOrderParsed(pendingOrder);
            setParsedOrders(prev => prev.filter(o => o.id !== pendingOrder.id));
            setExistingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(pendingOrder.id);
                return newSet;
            });
        }
        setDuplicateDialogOpen(false);
        setPendingOrder(null);
    };

    const handleDiscardOrder = (orderId: string) => {
        setParsedOrders(prev => prev.filter(o => o.id !== orderId));
    };

    const handleEditOrder = (order: PurchaseOrder) => {
        setEditingOrder(order);
        setIsManualEntry(false);
        setEditDialogOpen(true);
    };

    const handleManualEntry = () => {
        setEditingOrder(null);
        setIsManualEntry(true);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = (savedOrder: PurchaseOrder) => {
        if (isManualEntry) {
            onOrderParsed(savedOrder);
        } else {
            setParsedOrders(prev => prev.map(o => o.id === editingOrder?.id ? savedOrder : o));
        }
        setEditDialogOpen(false);
    };

    const handleAcceptAll = () => {
        const nonDuplicates = parsedOrders.filter(order => !existingIds.has(order.id));
        const duplicates = parsedOrders.filter(order => existingIds.has(order.id));

        // Process non-duplicates immediately
        nonDuplicates.forEach(order => onOrderParsed(order));
        setParsedOrders(duplicates);

        if (duplicates.length === 0) {
            setEmailText("");
        } else if (duplicates.length === 1) {
            // Show dialog for the single duplicate
            setPendingOrder(duplicates[0]);
            setDuplicateDialogOpen(true);
        }
        // If multiple duplicates remain, user must handle them individually
    };

    const handleDiscardAll = () => {
        setParsedOrders([]);
    };

    const handleClearAll = () => {
        setParsedOrders([]);
        setParseErrors([]);
        setEmailText("");
        setError(null);
    };

    const hasResults = parsedOrders.length > 0 || parseErrors.length > 0;

    return (
        <div className="glass-card overflow-hidden flex flex-col border-primary/10">
            {/* Header */}
            <div className="px-5 py-5 border-b border-border/50 relative overflow-hidden">
                {/* Header gradient accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent" />

                <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass-surface flex items-center justify-center border border-primary/20 glow-sm">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2
                            className="text-xl font-semibold text-foreground tracking-tight sky-gradient"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Email Parser
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            AI-powered document processing
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                {/* Textarea */}
                <div className="relative group">
                    <div className="absolute top-3.5 left-3.5 text-muted-foreground/40 group-focus-within:text-primary/70 transition-colors z-10">
                        <FileText className="w-4 h-4" />
                    </div>
                    <Textarea
                        placeholder="Paste one or multiple supplier emails here...

Example:
---
Subject: PO #12345 Confirmation
From: supplier@acme.com
Your order has been confirmed..."
                        className="resize-none glass-input rounded-xl text-sm placeholder:text-muted-foreground/40 pl-10 [field-sizing:fixed] h-[250px] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        disabled={isParsing}
                    />
                    {emailText && !hasResults && !isParsing && (
                        <div className="absolute bottom-3 right-3 text-[10px] font-medium text-muted-foreground glass-surface px-2.5 py-1 rounded-full">
                            {emailText.length} chars
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {isParsing && (
                        <div className="absolute inset-0 z-10 glass-surface rounded-xl flex flex-col items-center justify-center">
                            <div className="glass-card p-4 rounded-2xl border border-primary/20 mb-4 glow-md">
                                <Cpu className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                            <div className="flex items-center space-x-2.5">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                <span className="text-sm font-medium text-primary">Analyzing content...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error display */}
                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl glass-surface border border-destructive/30 scale-in">
                        <div className="w-9 h-9 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                            <X className="w-4 h-4 text-destructive" />
                        </div>
                        <div>
                            <p className="font-medium text-destructive text-sm">Parsing failed</p>
                            <p className="text-sm text-destructive/80 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Parse warnings/errors */}
                {parseErrors.length > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-xl glass-surface border border-amber-500/30 scale-in">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-400 text-sm">Review Needed</p>
                            <ul className="text-sm text-amber-400/80 mt-1 list-disc list-inside space-y-0.5">
                                {parseErrors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Parsed results */}
                {parsedOrders.length > 0 && (
                    <div className="space-y-4 scale-in">
                        {/* Results header with bulk actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-surface border border-emerald-500/30">
                                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-xs font-semibold text-emerald-400">
                                    {parsedOrders.length} Found
                                </span>
                            </div>

                            {parsedOrders.length > 1 && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAcceptAll}
                                        size="sm"
                                        className="h-8 text-xs crystal-button text-primary-foreground"
                                    >
                                        Accept All
                                    </Button>
                                    <Button
                                        onClick={handleDiscardAll}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        Discard
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Individual order cards */}
                        <div className="space-y-3 pr-1">
                            {parsedOrders.map((order, index) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    index={index}
                                    isDuplicate={existingIds.has(order.id)}
                                    onAccept={() => handleAcceptOrder(order)}
                                    onEdit={() => handleEditOrder(order)}
                                    onDiscard={() => handleDiscardOrder(order.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions Area */}
                <div className="mt-auto pt-2">
                    {!hasResults ? (
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleParse}
                                disabled={isParsing || !emailText.trim()}
                                className="w-full h-12 crystal-button text-primary-foreground font-semibold rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isParsing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                        <span>Parse with AI</span>
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleManualEntry}
                                variant="ghost"
                                className="w-full h-10 text-xs text-muted-foreground hover:text-primary ghost-glow rounded-xl"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Manual Entry
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleManualEntry}
                                variant="outline"
                                className="h-11 ghost-glow text-primary hover:text-primary rounded-xl text-xs"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Add Manual
                            </Button>
                            <Button
                                onClick={handleClearAll}
                                variant="outline"
                                className="h-11 ghost-glow hover:border-muted-foreground/30 rounded-xl text-xs"
                            >
                                <X className="w-3.5 h-3.5 mr-1.5" />
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {editDialogOpen && (
                <EditOrderDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    order={editingOrder}
                    onSave={handleSaveEdit}
                    title={isManualEntry ? "Add Manual Order" : "Edit Parsed Order"}
                />
            )}

            {/* Duplicate Confirmation Dialog */}
            <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
                <AlertDialogContent className="glass-card border-orange-500/30">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-orange-400">
                            <AlertTriangle className="w-5 h-5" />
                            Overwrite Existing Order?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            An order with ID <span className="font-semibold text-foreground">{pendingOrder?.id}</span> already exists in the database.
                            Do you want to overwrite it with the new data?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {pendingOrder && (
                        <div className="glass-surface rounded-lg p-3 border border-orange-500/20 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Supplier:</span>
                                <span className="font-medium">{pendingOrder.supplier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Expected:</span>
                                <span className="font-medium">{pendingOrder.expected_date || "—"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Items:</span>
                                <p className="mt-1 text-xs text-foreground/80">{pendingOrder.items}</p>
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel className="ghost-glow">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmOverwrite}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Overwrite
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function OrderCard({
    order,
    index,
    isDuplicate,
    onAccept,
    onEdit,
    onDiscard,
}: {
    order: PurchaseOrder;
    index: number;
    isDuplicate: boolean;
    onAccept: () => void;
    onEdit: () => void;
    onDiscard: () => void;
}) {
    const borderColor = isDuplicate ? "border-orange-500/20" : "border-emerald-500/20";
    const hoverBorderColor = isDuplicate ? "hover:border-orange-500/40" : "hover:border-emerald-500/40";
    const bgColor = isDuplicate ? "bg-orange-500/5" : "bg-emerald-500/5";
    const borderBColor = isDuplicate ? "border-orange-500/10" : "border-emerald-500/10";
    const badgeColor = isDuplicate ? "text-orange-400 border-orange-500/20" : "text-emerald-400 border-emerald-500/20";
    const itemsBorderColor = isDuplicate ? "border-orange-500/10" : "border-emerald-500/10";

    return (
        <div className={`group rounded-xl glass-surface border ${borderColor} overflow-hidden transition-all ${hoverBorderColor} hover:glow-sm`}>
            {/* Order header */}
            <div className={`px-4 py-3 ${bgColor} border-b ${borderBColor} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold tracking-wider ${badgeColor} glass-surface px-2 py-0.5 rounded uppercase border`}>
                        {isDuplicate ? "Duplicate" : "Detected"}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{order.id}</span>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order content */}
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span className="text-muted-foreground/70 text-[10px] uppercase tracking-wider font-semibold">Supplier</span>
                        <p className="font-medium text-foreground mt-0.5 truncate">{order.supplier}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground/70 text-[10px] uppercase tracking-wider font-semibold">Expected</span>
                        <p className="font-medium text-foreground mt-0.5">{order.expected_date || "—"}</p>
                    </div>
                </div>

                <div>
                    <span className="text-muted-foreground/70 text-[10px] uppercase tracking-wider font-semibold">Items</span>
                    <p className={`text-xs text-foreground/80 glass-surface rounded-lg p-2.5 mt-1 border ${itemsBorderColor} leading-relaxed`}>
                        {order.items}
                    </p>
                </div>

                {/* Additional Context */}
                {order.additional_context && (
                    <div className="flex gap-2 glass-surface p-2.5 rounded-lg border border-amber-500/20">
                        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-400/90 leading-relaxed">
                            {order.additional_context}
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className={`flex gap-2 pt-2 border-t ${borderBColor}`}>
                    <Button
                        onClick={onAccept}
                        size="sm"
                        className={isDuplicate
                            ? "flex-1 bg-orange-500 hover:bg-orange-600 text-white h-9 text-xs"
                            : "flex-1 crystal-button text-primary-foreground h-9 text-xs"
                        }
                    >
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        {isDuplicate ? "Overwrite" : "Accept"}
                    </Button>
                    <div className="flex gap-1">
                        <Button
                            onClick={onEdit}
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
                            title="Edit"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            onClick={onDiscard}
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            title="Discard"
                        >
                            <X className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const getStatusStyles = () => {
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
        <Badge variant="outline" className={`${getStatusStyles()} font-semibold text-[10px] px-2`}>
            {status}
        </Badge>
    );
}
