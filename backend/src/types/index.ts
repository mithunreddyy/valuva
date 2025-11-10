export interface ProductInput {
  [x: string]: any;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  stock: number;
}

export interface OrderInput {
  userId: string;
  items: any[];
  amount: number;
  status?: string;
}
