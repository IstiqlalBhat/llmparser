"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Check, X, Mail, Cpu, ArrowRight, FileText, CheckCheck, Trash2, Info, Pencil, Plus } from "lucide-react";
import { PurchaseOrder } from "@/types";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { EditOrderDialog } from "@/components/edit-order-dialog";

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

    const handleParse = async () => {
        if (!emailText.trim()) return;

        setIsParsing(true);
        setError(null);
        setParsedOrders([]);
        setParseErrors([]);

        try {
            const result = await api.orders.parseEmail(emailText);
            setParsedOrders(result.parsed_data);
            setParseErrors(result.errors || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsParsing(false);
        }
    };

    const handleAcceptOrder = (order: PurchaseOrder) => {
        onOrderParsed(order);
        setParsedOrders(prev => prev.filter(o => o.id !== order.id));
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
            // Don't add to parsedOrders list, just accept it directly
        } else {
            setParsedOrders(prev => prev.map(o => o.id === editingOrder?.id ? savedOrder : o));
        }
        setEditDialogOpen(false);
    };

    const handleAcceptAll = () => {
        parsedOrders.forEach(order => onOrderParsed(order));
        setParsedOrders([]);
        setEmailText("");
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
        <div className="warm-card overflow-hidden flex flex-col border border-border/50 sticky top-8">
            {/* Header */}
            <div className="px-5 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shadow-sm">
                        <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                            Email Parser
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            AI-powered processing
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                {/* Textarea */}
                <div className="relative group">
                    <div className="absolute top-3 left-3 text-muted-foreground/40 group-focus-within:text-primary/70 transition-colors">
                        <FileText className="w-4 h-4" />
                    </div>
                    <Textarea
                        placeholder="Paste one or multiple supplier emails here...

Example:
---
Subject: PO #12345 Confirmation
From: supplier@acme.com
Your order has been confirmed...
"
                        className="resize-none bg-background/50 border-dashed border-border group-hover:border-primary/30 focus:border-primary focus:ring-primary/10 transition-all duration-200 text-sm placeholder:text-muted-foreground/40 pl-10 rounded-xl [field-sizing:fixed] h-[250px]"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        disabled={isParsing}
                    />
                    {emailText && !hasResults && !isParsing && (
                        <div className="absolute bottom-3 right-3 text-[10px] font-medium text-muted-foreground bg-background/60 px-2 py-1 rounded-full border border-border/50">
                            {emailText.length} chars
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {isParsing && (
                        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-primary/10">
                            <div className="bg-white p-3 rounded-full shadow-lg border border-primary/10 mb-3 animate-pulse">
                                <Cpu className="w-6 h-6 text-primary animate-pulse" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                <span className="text-sm font-medium text-primary">Analyzing content...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error display */}
                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50/50 border border-red-100 scale-in">
                        <div className="w-8 h-8 rounded-lg bg-red-100/50 flex items-center justify-center flex-shrink-0">
                            <X className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                            <p className="font-medium text-red-700 text-sm">Parsing failed</p>
                            <p className="text-sm text-red-600/80 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Parse warnings/errors */}
                {parseErrors.length > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100 scale-in shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-amber-100/50 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-700 text-sm">Review Needed</p>
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
                            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-50/50 border border-emerald-100/50">
                                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-700">
                                    {parsedOrders.length} Found
                                </span>
                            </div>

                            {parsedOrders.length > 1 && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAcceptAll}
                                        size="sm"
                                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                    >
                                        Accept All
                                    </Button>
                                    <Button
                                        onClick={handleDiscardAll}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
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
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 group"
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
                                className="w-full h-9 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 border border-dashed border-border rounded-xl"
                            >
                                <Plus className="w-3 h-3 mr-1.5" />
                                Manual Entry
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleManualEntry}
                                variant="outline"
                                className="h-10 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1.5" />
                                Add Manual
                            </Button>
                            <Button
                                onClick={handleClearAll}
                                variant="outline"
                                className="h-10 hover:bg-secondary/50 rounded-xl text-xs"
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
        </div>
    );
}

function OrderCard({
    order,
    index,
    onAccept,
    onEdit,
    onDiscard,
}: {
    order: PurchaseOrder;
    index: number;
    onAccept: () => void;
    onEdit: () => void;
    onDiscard: () => void;
}) {
    return (
        <div className="group rounded-xl border border-emerald-100/60 bg-gradient-to-br from-emerald-50/40 to-white/50 backdrop-blur-sm overflow-hidden transition-all hover:shadow-md hover:border-emerald-200/80">
            {/* Order header */}
            <div className="px-3.5 py-2.5 bg-emerald-100/30 border-b border-emerald-100/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-600/80 bg-white/50 px-1.5 py-0.5 rounded uppercase">
                        Detected
                    </span>
                    <span className="text-xs font-semibold text-emerald-900">{order.id}</span>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order content */}
            <div className="p-3.5 space-y-3">
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
                    <p className="text-xs text-foreground/80 bg-white/40 rounded-lg p-2 mt-1 border border-emerald-100/40 leading-relaxed">
                        {order.items}
                    </p>
                </div>

                {/* Additional Context */}
                {order.additional_context && (
                    <div className="flex gap-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100/40">
                        <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800/90 leading-relaxed">
                            {order.additional_context}
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-1 border-t border-emerald-100/30 mt-1">
                    <Button
                        onClick={onAccept}
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs shadow-sm shadow-emerald-200"
                    >
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Accept
                    </Button>
                    <div className="flex gap-1">
                        <Button
                            onClick={onEdit}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            onClick={onDiscard}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
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
                return "bg-emerald-100/70 text-emerald-700 border-emerald-200/60";
            case "Shipped":
                return "bg-blue-100/70 text-blue-700 border-blue-200/60";
            case "Product Delays":
                return "bg-amber-100/70 text-amber-700 border-amber-200/60";
            case "Shipment Delay":
                return "bg-red-100/70 text-red-700 border-red-200/60";
            default:
                return "bg-secondary text-secondary-foreground border-border";
        }
    };

    return (
        <Badge variant="outline" className={`${getStatusStyles()} font-semibold text-[10px]`}>
            {status}
        </Badge>
    );
}
