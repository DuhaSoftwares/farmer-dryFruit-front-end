import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product } from 'src/app/models/product.model';
import { CommonService } from 'src/app/services/common.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-fruitshop',
  templateUrl: './fruitshop.component.html',
  styleUrls: ['./fruitshop.component.css'],
})
export class FruitshopComponent {
  constructor(
    private productService: ProductsService,
    private router: Router,
    private commonService: CommonService
  ) {}
  products: Product[] = [];
  bestSellingProducts: Product[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        const bestSellingProducts = products.filter(
          (product) => product.isBestSelling
        );

        this.commonService.setBestSellingProducts(bestSellingProducts);
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
        // Check if categories data is valid before sending it
        if (this.categories && this.categories.length > 0) {
          this.commonService.setCategories(category);
        }
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

  getProductById(id: string) {
    this.productService.getProductById(id).subscribe(
      (data) => {
        this.router.navigate(['single-product', id]);
      },
      (error) => {
        console.error('Error fetching product data', error);
      }
    );
  }
}
