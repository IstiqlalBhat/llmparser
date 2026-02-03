"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Check, X, Mail, Cpu, FileText, Info, Pencil, Plus, AlertTriangle } from "lucide-react";
import { PurchaseOrder } from "@/types";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { EditOrderDialog } from "@/components/edit-order-dialog";
import { LiquidGlassCard } from "@/components/liquid-glass-card";
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
        <LiquidGlassCard
            variant="large"
            interactive={false}
            glowOnHover={false}
            className="flex-col h-full min-h-[600px]"
            contentClassName="flex flex-col h-full"
        >
            {/* Header */}
            <div className="px-5 py-5 border-b border-white/40 relative overflow-hidden shrink-0">
                {/* Header gradient accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-cyan-500/5 to-transparent" />

                <div className="relative flex items-center gap-4">
                    <LiquidGlassCard
                        variant="stat"
                        interactive={false}
                        className="w-12 h-12 !rounded-2xl shrink-0"
                        contentClassName="flex items-center justify-center"
                    >
                        <Mail className="w-6 h-6 text-sky-600" />
                    </LiquidGlassCard>
                    <div>
                        <h2
                            className="text-xl font-bold text-slate-800 tracking-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Email Parser
                        </h2>
                        <p className="text-xs text-slate-700 font-bold mt-0.5">
                            AI-powered document processing
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar min-h-0">
                {/* Textarea */}
                <div className="relative group">
                    <div className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within:text-sky-500 transition-colors z-10">
                        <FileText className="w-4 h-4" />
                    </div>
                    <Textarea
                        placeholder="Paste one or multiple supplier emails here...

Example:
---
Subject: PO #12345 Confirmation
From: supplier@acme.com
Your order has been confirmed..."
                        className="resize-none glass-input rounded-xl text-sm text-slate-800 placeholder:text-slate-500 placeholder:font-medium pl-10 [field-sizing:fixed] h-[250px] focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        disabled={isParsing}
                    />
                    {emailText && !hasResults && !isParsing && (
                        <div className="absolute bottom-3 right-3 text-[10px] font-medium text-slate-500 glass-surface px-2.5 py-1 rounded-full">
                            {emailText.length} chars
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {isParsing && (
                        <div className="absolute inset-0 z-10 glass-surface rounded-xl flex flex-col items-center justify-center">
                            <LiquidGlassCard
                                variant="stat"
                                interactive={false}
                                className="p-4 !rounded-2xl mb-4"
                            >
                                <Cpu className="w-8 h-8 text-sky-600 animate-pulse" />
                            </LiquidGlassCard>
                            <div className="flex items-center space-x-2.5">
                                <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                                <span className="text-sm font-medium text-sky-600">Analyzing content...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error display */}
                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl glass-surface border border-rose-400/30 scale-in">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                            <X className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                            <p className="font-medium text-rose-600 text-sm">Parsing failed</p>
                            <p className="text-sm text-rose-500/80 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Parse warnings/errors */}
                {parseErrors.length > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-xl glass-surface border border-amber-400/30 scale-in">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-600 text-sm">Review Needed</p>
                            <ul className="text-sm text-amber-600/80 mt-1 list-disc list-inside space-y-0.5">
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
                            <LiquidGlassCard
                                variant="stat"
                                interactive={false}
                                className="!px-3 !py-1.5"
                            >
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-semibold text-emerald-600">
                                        {parsedOrders.length} Found
                                    </span>
                                </div>
                            </LiquidGlassCard>

                            {parsedOrders.length > 1 && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAcceptAll}
                                        size="sm"
                                        className="h-8 text-xs crystal-button text-white"
                                    >
                                        Accept All
                                    </Button>
                                    <Button
                                        onClick={handleDiscardAll}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-xs text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
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
                                className="w-full h-12 crystal-button text-white font-semibold rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className="w-full h-10 text-xs text-slate-600 hover:text-sky-600 ghost-glow rounded-xl"
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
                                className="h-11 ghost-glow text-sky-600 hover:text-sky-700 rounded-xl text-xs"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                Add Manual
                            </Button>
                            <Button
                                onClick={handleClearAll}
                                variant="outline"
                                className="h-11 ghost-glow hover:border-slate-400/30 rounded-xl text-xs"
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
                <AlertDialogContent className="!bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-3xl !shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
                            <AlertTriangle className="w-5 h-5" />
                            Overwrite Existing Order?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-700">
                            An order with ID <span className="font-semibold text-slate-800">{pendingOrder?.id}</span> already exists in the database.
                            Do you want to overwrite it with the new data?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {pendingOrder && (
                        <div className="glass-surface rounded-xl p-3 border border-amber-400/20 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Supplier:</span>
                                <span className="font-medium text-slate-800">{pendingOrder.supplier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Expected:</span>
                                <span className="font-medium text-slate-800">{pendingOrder.expected_date || "—"}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Items:</span>
                                <p className="mt-1 text-xs text-slate-700">{pendingOrder.items}</p>
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel className="ghost-glow rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmOverwrite}
                            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
                        >
                            Overwrite
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </LiquidGlassCard>
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
    const borderColor = isDuplicate ? "border-amber-400/20" : "border-emerald-400/20";
    const hoverBorderColor = isDuplicate ? "hover:border-amber-400/40" : "hover:border-emerald-400/40";
    const bgColor = isDuplicate ? "bg-amber-500/5" : "bg-emerald-500/5";
    const borderBColor = isDuplicate ? "border-amber-400/10" : "border-emerald-400/10";
    const badgeColor = isDuplicate ? "text-amber-600 border-amber-400/20" : "text-emerald-600 border-emerald-400/20";
    const itemsBorderColor = isDuplicate ? "border-amber-400/10" : "border-emerald-400/10";

    return (
        <LiquidGlassCard
            variant="default"
            interactive={false}
            glowOnHover={false}
            className={`!rounded-xl ${borderColor} ${hoverBorderColor}`}
        >
            <div>
                {/* Order header */}
                <div className={`px-4 py-3 ${bgColor} border-b ${borderBColor} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold tracking-wider ${badgeColor} glass-surface px-2 py-0.5 rounded uppercase border`}>
                            {isDuplicate ? "Duplicate" : "Detected"}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{order.id}</span>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {/* Order content */}
                <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Supplier</span>
                            <p className="font-medium text-slate-800 mt-0.5 truncate">{order.supplier}</p>
                        </div>
                        <div>
                            <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Expected</span>
                            <p className="font-medium text-slate-800 mt-0.5">{order.expected_date || "—"}</p>
                        </div>
                    </div>

                    <div>
                        <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Items</span>
                        <p className={`text-xs text-slate-700 glass-surface rounded-xl p-2.5 mt-1 border ${itemsBorderColor} leading-relaxed`}>
                            {order.items}
                        </p>
                    </div>

                    {/* Additional Context */}
                    {order.additional_context && (
                        <div className="flex gap-2 glass-surface p-2.5 rounded-xl border border-amber-400/20">
                            <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-600/90 leading-relaxed">
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
                                ? "flex-1 bg-amber-500 hover:bg-amber-600 text-white h-9 text-xs rounded-lg"
                                : "flex-1 crystal-button text-white h-9 text-xs rounded-lg"
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
                                className="h-9 w-9 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-500/10 rounded-lg"
                                title="Edit"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                onClick={onDiscard}
                                size="sm"
                                variant="ghost"
                                className="h-9 w-9 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg"
                                title="Discard"
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </LiquidGlassCard>
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
                return "glass-surface text-slate-700";
        }
    };

    return (
        <Badge variant="outline" className={`${getStatusStyles()} font-semibold text-[10px] px-2`}>
            {status}
        </Badge>
    );
}
