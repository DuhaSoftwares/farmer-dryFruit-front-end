import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product, Category } from 'src/app/models/product.model';
import { CommonService } from 'src/app/services/common.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent {
  constructor(
    private productService: ProductsService,
    private router: Router,
    public commonService: CommonService
  ) {}
  products: Product[] = [];
  bestSellingProducts: Product[] = [];
  categories: Category[] = [];
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

  getBestSellingProducts() {
    this.commonService.bestSellingProducts$.subscribe(
      (products: Product[]) => {
        this.bestSellingProducts = products;
      },
      (error) => {
        console.error('Error receiving best selling products', error);
      }
    );
  }
}
