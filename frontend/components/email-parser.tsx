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
        <div className="warm-card rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shadow-sm">
                        <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                            Email Parser
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Paste one or multiple emails
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto">
                {/* Textarea */}
                <div className="relative">
                    <div className="absolute top-3 left-3 text-muted-foreground/50">
                        <FileText className="w-4 h-4" />
                    </div>
                    <Textarea
                        placeholder="Paste one or multiple supplier emails here...

You can paste multiple emails at once - the AI will detect and parse each one separately.

Example:
---
Subject: PO #12345 Confirmation
From: supplier@acme.com
Your order has been confirmed...
---
Subject: PO #67890 Update
From: orders@beta.com
Shipment has been delayed..."
                        className="min-h-[180px] resize-none bg-secondary/30 border-border hover:border-primary/30 focus:border-primary focus:ring-primary/20 transition-all duration-200 text-sm placeholder:text-muted-foreground/50 pl-10 rounded-xl"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        disabled={isParsing}
                    />
                    {emailText && !hasResults && (
                        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
                            {emailText.length} characters
                        </div>
                    )}
                </div>

                {/* Error display */}
                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 scale-in">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
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
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 scale-in">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-700 text-sm">Some issues detected</p>
                            <ul className="text-sm text-amber-600/80 mt-1 list-disc list-inside">
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Cpu className="w-4 h-4 text-emerald-700" />
                                </div>
                                <span className="text-sm font-medium text-emerald-800">
                                    {parsedOrders.length} order{parsedOrders.length > 1 ? 's' : ''} extracted
                                </span>
                            </div>

                            {parsedOrders.length > 1 && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAcceptAll}
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                    >
                                        <CheckCheck className="w-4 h-4 mr-1" />
                                        Accept All
                                    </Button>
                                    <Button
                                        onClick={handleDiscardAll}
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Discard All
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Individual order cards */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
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

                {/* Parse button or Clear button */}
                {!hasResults ? (
                    <div className="space-y-3">
                        <Button
                            onClick={handleParse}
                            disabled={isParsing || !emailText.trim()}
                            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium terracotta-glow disabled:opacity-50 disabled:shadow-none transition-all duration-200 group rounded-xl"
                        >
                            {isParsing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    <span>Analyzing emails...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    <span>Parse with AI</span>
                                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleManualEntry}
                            variant="outline"
                            className="w-full h-10 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Manual Order
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Button
                            onClick={handleManualEntry}
                            variant="outline"
                            className="flex-1 h-12 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Manual
                        </Button>
                        <Button
                            onClick={handleClearAll}
                            variant="outline"
                            className="flex-1 h-12 border-border hover:bg-secondary/50 rounded-xl"
                        >
                            <X className="w-5 h-5 mr-2" />
                            Clear & Restart
                        </Button>
                    </div>
                )}
            </div>

            <EditOrderDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                order={editingOrder}
                onSave={handleSaveEdit}
                title={isManualEntry ? "Add Manual Order" : "Edit Parsed Order"}
            />
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
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/50 overflow-hidden">
            {/* Order header */}
            <div className="px-4 py-2 bg-emerald-100/50 border-b border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-200/50 px-2 py-0.5 rounded">
                        #{index + 1}
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">{order.id}</span>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order content */}
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-muted-foreground text-xs">Supplier</span>
                        <p className="font-medium">{order.supplier}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-xs">Expected</span>
                        <p className="font-medium">{order.expected_date || "Not specified"}</p>
                    </div>
                </div>

                <div>
                    <span className="text-muted-foreground text-xs">Items</span>
                    <p className="text-sm bg-white/60 rounded-lg p-2 mt-1 border border-emerald-100 line-clamp-2">
                        {order.items}
                    </p>
                </div>

                {/* Additional Context */}
                {order.additional_context && (
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Info className="w-3 h-3 text-amber-600" />
                            <span className="text-muted-foreground text-xs">Additional Context</span>
                        </div>
                        <p className="text-sm bg-amber-50 rounded-lg p-2 border border-amber-200 text-amber-900">
                            {order.additional_context}
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                    <Button
                        onClick={onAccept}
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                    >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Accept
                    </Button>
                    <Button
                        onClick={onEdit}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-700 h-8"
                    >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                    </Button>
                    <Button
                        onClick={onDiscard}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-emerald-200 hover:bg-emerald-50 text-emerald-700 h-8"
                    >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Discard
                    </Button>
                </div>
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
