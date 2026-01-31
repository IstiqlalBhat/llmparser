import { PurchaseOrder, OrderStatus, EmailParsingResponse } from "@/types";

const API_BASE_URL = "http://localhost:8000/api";

export class ApiError extends Error {
    constructor(public message: string, public status?: number) {
        super(message);
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new ApiError(response.statusText, response.status);
    }
    return response.json();
}

export const api = {
    orders: {
        list: async (): Promise<PurchaseOrder[]> => {
            const res = await fetch(`${API_BASE_URL}/orders`);
            return handleResponse<PurchaseOrder[]>(res);
        },

        create: async (order: PurchaseOrder): Promise<PurchaseOrder> => {
            const res = await fetch(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });
            return handleResponse<PurchaseOrder>(res);
        },

        updateStatus: async (id: string, status: OrderStatus): Promise<PurchaseOrder> => {
            const res = await fetch(
                `${API_BASE_URL}/orders/${id}/status?status=${encodeURIComponent(status)}`,
                { method: "PATCH" }
            );
            return handleResponse<PurchaseOrder>(res);
        },

        parseEmail: async (emailText: string): Promise<EmailParsingResponse> => {
            const res = await fetch(`${API_BASE_URL}/orders/parse`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email_text: emailText }),
            });
            return handleResponse<EmailParsingResponse>(res);
        },

        delete: async (id: string): Promise<void> => {
            const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            await handleResponse(res);
        },

        deleteMany: async (ids: string[]): Promise<{ deleted_count: number }> => {
            const res = await fetch(`${API_BASE_URL}/orders/delete-many`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ids),
            });
            return handleResponse<{ deleted_count: number }>(res);
        },
    },
};
