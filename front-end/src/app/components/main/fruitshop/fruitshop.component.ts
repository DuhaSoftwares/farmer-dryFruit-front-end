import { Component } from '@angular/core';
import { Category, Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-fruitshop',
  templateUrl: './fruitshop.component.html',
  styleUrls: ['./fruitshop.component.css'],
})
export class FruitshopComponent {
  constructor(private productService: ProductsService) {}
  products: Product[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  getAllCategories() {
    this.productService.getAllCategories().subscribe(
      (category) => {
        this.categories = category;
        console.log(this.categories);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  getProductsByCategoryId(id: string): void {
    this.products = [];
    this.productService.getProductsByCategoryId(id).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }
}
