// src/types/order.ts
export interface Order {
  id?: number;
  customer_id: number;
  user_id: number;
  installments?: number;
  down_payment?: number;
  total?: number;
  status?: string;
  notes?: string;
}

export interface OrderedItem {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Payment {
  id?: number;
  order_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
}
