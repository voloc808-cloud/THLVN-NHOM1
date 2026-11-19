export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  specs: { key: string; value: string }[];
  stock: number;
  status: 'ACTIVE' | 'HIDDEN' | 'DELETED';
}
