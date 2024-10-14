import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category, Product } from '../models/product.model';
import { ProductsService } from './products.service';
import Swal from 'sweetalert2';
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
  private itemCount = new BehaviorSubject<number>(
    this.getItemCountFromLocalStorage()
  );
  public itemCount$ = this.itemCount.asObservable();
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
  private storageKey = 'ProductIds';
  addToLocalStorageIfNotPresent(id: string): boolean {
    // Get existing IDs from local storage
    const idsString = localStorage.getItem(this.storageKey);
    const ids: string[] = idsString ? JSON.parse(idsString) : [];

    // Check if ID already exists
    if (ids.includes(id)) {
      // Show SweetAlert notification when item already exists
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Item is already present in the cart.`,
      });
      return false;
    }

    // Add new ID to the array and update local storage
    ids.push(id);
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
    // Show SweetAlert notification for successful addition
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `Item has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false,
    });
    // Update the count after adding
    this.updateItemCount();
    return true;
  }

  getStoredProductIds(): string[] {
    const idsString = localStorage.getItem(this.storageKey);
    return idsString ? JSON.parse(idsString) : [];
  }

  updateItemCount() {
    const count = this.getItemCountFromLocalStorage();
    this.itemCount.next(count); // Emit new count
  }
  private getItemCountFromLocalStorage(): number {
    const idsString = localStorage.getItem(this.storageKey);
    const ids: string[] = idsString ? JSON.parse(idsString) : [];
    return ids.length;
  }

  removeFromLocalStorage(id: string): boolean {
    const idsString = localStorage.getItem(this.storageKey);
    const ids: string[] = idsString ? JSON.parse(idsString) : [];

    const index = ids.indexOf(id);
    if (index !== -1) {
      ids.splice(index, 1); // Remove the item
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
      // Show SweetAlert notification for successful removal
      Swal.fire({
        icon: 'success',
        title: 'Removed from Cart!',
        text: `Item has been removed from your cart.`,
        timer: 1500,
        showConfirmButton: false,
      });
      // Update the count after removal
      this.updateItemCount();
      return true;
    }

    // Show SweetAlert notification for successful removal
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Item not Found`,
      timer: 1500,
      showConfirmButton: false,
    });
    return false;
  }
}
