export interface OrderFormData {
  customerName: string;
  email?: string;
  phone: string;
  productId: string;
  address: string;
  district: string;
  state: string;
  postcode: string;
  quantity: number;
  totalAmount: number;
  priceAtTime: number;
}