import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category, Product } from '../models/product.model';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private productService: ProductsService) {}

  private bestSellingProductsSource = new BehaviorSubject<Product[]>([]);
  bestSellingProducts$ = this.bestSellingProductsSource.asObservable();

  private categoriesSource = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSource.asObservable();
  setBestSellingProducts(products: Product[]) {
    this.bestSellingProductsSource.next(products);
  }

  private selectedProductSource = new BehaviorSubject<Product | null>(null);
  selectedProduct$ = this.selectedProductSource.asObservable();

  // Method to get product by ID and set it in the BehaviorSubject
  getProductById(id: string): void {
    this.productService.getProductById(id).subscribe(
      (product: Product) => {
        this.selectedProductSource.next(product);
      },
      (error) => {
        console.error('Error fetching product by ID:', error);
      }
    );
  }

  // Function to update categories in the BehaviorSubject
  setCategories(categories: Category[]): void {
    this.categoriesSource.next(categories);
  }
}
