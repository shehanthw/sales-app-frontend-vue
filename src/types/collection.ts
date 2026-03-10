export type Installment = {
  id: string;
  amount: number;
  status: string;
  due_date: string;
  order_id: string;
  paid_at: string | null; 
  collected_by_user_id: string | null; 
}