export type OrderStatus = "On Track" | "Product Delays" | "Shipped" | "Shipment Delay";

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: string;
  expected_date?: string;
  status: OrderStatus;
  last_updated: string;
  additional_context?: string | null;
}

export interface EmailParsingRequest {
  email_text: string;
}

export interface EmailParsingResponse {
  parsed_data: PurchaseOrder[];
  errors: string[];
}
