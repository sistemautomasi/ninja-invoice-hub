export interface Invoice {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  total_amount: number;
  status: string;
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    product: {
      name: string;
    };
  }[];
}