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

interface EditOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order?: PurchaseOrder | null;
    onSave: (order: PurchaseOrder) => void;
    title?: string;
}

const ORDER_STATUSES: OrderStatus[] = [
    "On Track",
    "Shipped",
    "Product Delays",
    "Shipment Delay",
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Make changes to the purchase order details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="po-id" className="text-right">
                            PO ID
                        </Label>
                        <Input
                            id="po-id"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="supplier" className="text-right">
                            Supplier
                        </Label>
                        <Input
                            id="supplier"
                            value={formData.supplier}
                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value as OrderStatus })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="items" className="text-right pt-2">
                            Items
                        </Label>
                        <Textarea
                            id="items"
                            value={formData.items}
                            onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Expected
                        </Label>
                        <Input
                            id="date"
                            value={formData.expected_date || ""}
                            onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })}
                            className="col-span-3"
                            placeholder="e.g. Jan 15, 2024"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="context" className="text-right pt-2">
                            Context
                        </Label>
                        <Textarea
                            id="context"
                            value={formData.additional_context || ""}
                            onChange={(e) => setFormData({ ...formData, additional_context: e.target.value })}
                            className="col-span-3"
                            placeholder="Optional notes..."
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
