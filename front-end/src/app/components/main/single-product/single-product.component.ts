import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, Product } from 'src/app/models/product.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css'],
})
export class SingleProductComponent {
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}
  categories: Category[] = [];
  product!: Product | null;
  productId!: string;
  bestSellingProducts: Product[] = [];
  ngOnInit(): void {
    this.getBestSellingProducts();
    this.getProductByIdFromRoute();
    this.getAllCategories();
  }

  getProductByIdFromRoute() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.commonService.getProductById(productId); // Fetch the product by ID
    }

    // Subscribe to the product data
    this.commonService.selectedProduct$.subscribe(
      (product) => {
        this.product = product;
      },
      (error) => {
        console.error('Error fetching product data:', error);
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

  getAllCategories() {
    this.commonService.categories$.subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        console.log(categories);
      },
      (error) => {
        console.error('Error receiving categories:', error);
      }
    );
  }
}
