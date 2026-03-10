// src/types/product.ts
export interface Product {
  id?: number;
  product_name: string;
  description?: string;
  category?: string;
  unit: string;
  quantity: number;
  weight?: number;
  barcode?: string;
  buying_price: number;
  selling_price: number;
  is_active: boolean;
}