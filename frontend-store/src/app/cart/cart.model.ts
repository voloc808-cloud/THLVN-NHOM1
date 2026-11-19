export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  available: boolean;
}
export interface Cart {
  items: CartItem[];
  total: number;
}
