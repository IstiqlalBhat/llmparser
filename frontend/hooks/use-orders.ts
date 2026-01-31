import { useState, useEffect, useCallback } from "react";
import { PurchaseOrder, OrderStatus } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useOrders() {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await api.orders.list();
            setOrders(data);
            setError(null);
        } catch (err) {
            const msg = "Failed to fetch orders";
            setError(msg);
            toast.error(msg);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const addOrder = async (order: PurchaseOrder) => {
        try {
            await api.orders.create(order);
            toast.success("PO saved successfully");
            // Refresh list to ensure consistency
            await fetchOrders();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save PO");
            throw err;
        }
    };

    const updateOrderStatus = async (id: string, status: OrderStatus) => {
        const previousOrders = [...orders];

        // Optimistic update
        setOrders((current) =>
            current.map((o) => (o.id === id ? { ...o, status } : o))
        );

        try {
            await api.orders.updateStatus(id, status);
            toast.success(`Status updated to ${status}`);
        } catch (err) {
            // Revert on failure
            setOrders(previousOrders);
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    const deleteOrder = async (id: string) => {
        const previousOrders = [...orders];

        // Optimistic update
        setOrders((current) => current.filter((o) => o.id !== id));

        try {
            await api.orders.delete(id);
            toast.success("Order deleted successfully");
        } catch (err) {
            // Revert on failure
            setOrders(previousOrders);
            console.error(err);
            toast.error("Failed to delete order");
        }
    };

    const deleteOrders = async (ids: string[]) => {
        const previousOrders = [...orders];

        // Optimistic update
        setOrders((current) => current.filter((o) => !ids.includes(o.id)));

        try {
            const result = await api.orders.deleteMany(ids);
            toast.success(`${result.deleted_count} order(s) deleted successfully`);
        } catch (err) {
            // Revert on failure
            setOrders(previousOrders);
            console.error(err);
            toast.error("Failed to delete orders");
        }
    };

    return {
        orders,
        isLoading,
        error,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        deleteOrders,
        refreshOrders: fetchOrders
    };
}
