"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatus, PurchaseOrder } from "@/types";

interface POTableProps {
    orders: PurchaseOrder[];
    onStatusUpdate: (id: string, status: OrderStatus) => void;
}

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case "On Track":
            return "bg-green-500 hover:bg-green-600";
        case "Shipped":
            return "bg-blue-500 hover:bg-blue-600";
        case "Product Delays":
            return "bg-amber-500 hover:bg-amber-600";
        case "Shipment Delay":
            return "bg-red-500 hover:bg-red-600";
        default:
            return "bg-gray-500";
    }
};

export function POTable({ orders, onStatusUpdate }: POTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>PO ID</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Expected Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No orders found. Parse an email to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.supplier}</TableCell>
                                    <TableCell className="max-w-xs truncate" title={order.items}>
                                        {order.items}
                                    </TableCell>
                                    <TableCell>{order.expected_date || "N/A"}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(value) =>
                                                onStatusUpdate(order.id, value as OrderStatus)
                                            }
                                        >
                                            <SelectTrigger className="w-[160px]">
                                                <SelectValue>
                                                    <Badge className={getStatusColor(order.status as OrderStatus)}>
                                                        {order.status}
                                                    </Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="On Track">On Track</SelectItem>
                                                <SelectItem value="Shipped">Shipped</SelectItem>
                                                <SelectItem value="Product Delays">Product Delays</SelectItem>
                                                <SelectItem value="Shipment Delay">Shipment Delay</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{order.last_updated}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
