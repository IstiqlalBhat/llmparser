"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PurchaseOrder, OrderStatus } from "@/types";
import { Package, CheckCircle2, Truck, AlertTriangle, Clock } from "lucide-react";
import { LiquidGlassCard } from "@/components/liquid-glass-card";

interface EditOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order?: PurchaseOrder | null;
    onSave: (order: PurchaseOrder) => void;
    title?: string;
}

const ORDER_STATUSES: { value: OrderStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "On Track", label: "On Track", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-500" },
    { value: "Shipped", label: "Shipped", icon: <Truck className="w-4 h-4" />, color: "text-sky-500" },
    { value: "Product Delays", label: "Product Delays", icon: <AlertTriangle className="w-4 h-4" />, color: "text-amber-500" },
    { value: "Shipment Delay", label: "Shipment Delay", icon: <Clock className="w-4 h-4" />, color: "text-rose-500" },
];

export function EditOrderDialog({
    open,
    onOpenChange,
    order,
    onSave,
    title = "Edit Order",
}: EditOrderDialogProps) {
    const getDefaultOrder = (): PurchaseOrder => ({
        id: "",
        supplier: "",
        items: "",
        expected_date: "",
        status: "On Track",
        last_updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        additional_context: "",
    });

    const [formData, setFormData] = useState<PurchaseOrder>(order || getDefaultOrder());

    // Reset form when order changes (when opening to edit a different order)
    useEffect(() => {
        if (order) {
            setFormData(order);
        } else {
            setFormData(getDefaultOrder());
        }
    }, [order]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    const currentStatus = ORDER_STATUSES.find(s => s.value === formData.status);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden !bg-white/80 !backdrop-blur-2xl !border-white/60 !rounded-3xl !shadow-2xl">
                {/* Header */}
                <DialogHeader className="px-6 py-5 border-b border-white/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-cyan-500/5 to-transparent" />
                    <div className="relative flex items-center gap-4">
                        <LiquidGlassCard
                            variant="stat"
                            interactive={false}
                            className="w-12 h-12 !rounded-2xl shrink-0"
                            contentClassName="flex items-center justify-center"
                        >
                            <Package className="w-6 h-6 text-sky-600" />
                        </LiquidGlassCard>
                        <div>
                            <DialogTitle
                                className="text-xl text-slate-800"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 mt-0.5">
                                Enter the purchase order details below.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* PO ID & Supplier Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="po-id" className="text-sm font-medium text-slate-800">
                                PO ID
                            </Label>
                            <Input
                                id="po-id"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                className="glass-input rounded-xl h-11 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10"
                                placeholder="PO-12345"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supplier" className="text-sm font-medium text-slate-800">
                                Supplier
                            </Label>
                            <Input
                                id="supplier"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                className="glass-input rounded-xl h-11 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10"
                                placeholder="Acme Corp"
                                required
                            />
                        </div>
                    </div>

                    {/* Status & Expected Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-medium text-slate-800">
                                Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as OrderStatus })}
                            >
                                <SelectTrigger className="glass-input rounded-xl h-11">
                                    <SelectValue>
                                        {currentStatus && (
                                            <div className="flex items-center gap-2">
                                                <span className={currentStatus.color}>{currentStatus.icon}</span>
                                                <span>{currentStatus.label}</span>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="!bg-white/85 !backdrop-blur-2xl !border-white/60 !rounded-2xl !shadow-xl">
                                    {ORDER_STATUSES.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            <div className="flex items-center gap-2">
                                                <span className={status.color}>{status.icon}</span>
                                                <span>{status.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium text-slate-800">
                                Expected Date
                            </Label>
                            <Input
                                id="date"
                                value={formData.expected_date || ""}
                                onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })}
                                className="glass-input rounded-xl h-11 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10"
                                placeholder="Jan 15, 2024"
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                        <Label htmlFor="items" className="text-sm font-medium text-slate-800">
                            Items
                        </Label>
                        <Textarea
                            id="items"
                            value={formData.items}
                            onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                            className="glass-input rounded-xl min-h-[100px] focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 resize-none"
                            placeholder="100x Widget A, 50x Widget B..."
                            required
                        />
                    </div>

                    {/* Additional Context */}
                    <div className="space-y-2">
                        <Label htmlFor="context" className="text-sm font-medium text-slate-800">
                            Additional Context
                            <span className="text-slate-500 font-normal ml-1">(optional)</span>
                        </Label>
                        <Textarea
                            id="context"
                            value={formData.additional_context || ""}
                            onChange={(e) => setFormData({ ...formData, additional_context: e.target.value })}
                            className="glass-input rounded-xl min-h-[80px] focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 resize-none"
                            placeholder="Any notes about delays, special instructions, etc..."
                        />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-white/50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto rounded-xl ghost-glow h-11"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto crystal-button text-white rounded-xl h-11"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
