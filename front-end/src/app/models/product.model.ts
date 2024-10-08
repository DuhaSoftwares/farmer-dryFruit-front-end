export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  units: string;
  category: any;
  image: string;
  isBestSelling: boolean;
  quantity: number;
}

export interface Category {
  _id: string;
  name: string;
  totalProducts: number;
}
