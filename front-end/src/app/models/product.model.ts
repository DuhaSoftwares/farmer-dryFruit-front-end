export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  units: string;
  category: any;
}

export interface Category {
  _id: string;
  name: string;
}
