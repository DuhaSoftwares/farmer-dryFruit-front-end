import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(public commonService: CommonService, private http: HttpClient) {}
  ngOnInit(): void {
    this.fetchCartItems();
  }
  getcartItemsUrl = environment.apiBaseUrl + '/products/getProductsByIds';
  cartItems: Product[] = [];
  fetchCartItems(): void {
    // Get the product IDs from local storage using the CommonService
    const productIds = this.commonService.getStoredProductIds();

    if (productIds.length > 0) {
      // Send product IDs in the request body to the server
      const requestBody = { productIds };

      this.http.post(this.getcartItemsUrl, requestBody).subscribe(
        (response: any) => {
          this.cartItems = response;
        },
        (error) => {
          console.error('Error fetching cart items:', error);
        }
      );
    } else {
      this.cartItems = [];
    }
  }

  // Function to remove an item from the cart based on its id
  // Function to remove a product ID from localStorage
  removeProductId(productId: string): void {
    // Step 1: Retrieve the product IDs array from localStorage
    const productIds = JSON.parse(localStorage.getItem('ProductIds') || '[]');

    // Step 2: Filter out the product ID to be removed
    const updatedProductIds = productIds.filter(
      (id: string) => id !== productId
    );

    // Step 3: Update localStorage with the modified array
    localStorage.setItem('ProductIds', JSON.stringify(updatedProductIds));

    this.fetchCartItems();
  }
}
