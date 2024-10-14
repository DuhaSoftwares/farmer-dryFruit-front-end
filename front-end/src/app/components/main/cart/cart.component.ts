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
  totalPrice: number = 0;
  fetchCartItems(): void {
    // Get the product IDs from local storage using the CommonService
    const productIds = this.commonService.getStoredProductIds();

    if (productIds.length > 0) {
      // Send product IDs in the request body to the server
      const requestBody = { productIds };

      this.http.post(this.getcartItemsUrl, requestBody).subscribe(
        (response: any) => {
          this.cartItems = response;
          this.cartItems = response.map((item: any) => ({
          ...item,
          quantity: item.quantity || 1 // Set quantity to 0 if it's not provided
        }));
      this.calculateTotalPrice()
          
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


   incrementQuantity(item: any): void {
     item.quantity++;
      this.calculateTotalPrice()
     
  }

  // Function to decrement quantity, ensuring it doesn't go below 1
  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotalPrice()
    }
  }

   calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }


   // Function to send the cart data (products and total price) to the backend
 submitCart(): void {
  const cartData = {
    items: this.cartItems.map(item => ({
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    totalPrice: this.totalPrice
  };

  // Format the message for WhatsApp
  const message = this.createWhatsAppMessage(cartData);
  
 // Replace <YOUR_PHONE_NUMBER> with the actual phone number (in international format)
  const phoneNumber = '<YOUR_PHONE_NUMBER>'; // e.g., '1234567890' for +1 (234) 567-8900
  const whatsappUrl = `https://wa.me/${environment.phoneNumber}?text=${encodeURIComponent(message)}`;

  // Open the WhatsApp URL in a new tab
  window.open(whatsappUrl, '_blank');

  
}

// Function to create a formatted message for WhatsApp
private createWhatsAppMessage(cartData: any): string {
  let message = 'Here are the details of my cart:\n\n';

  cartData.items.forEach((item: Product) => {
    message += `Product Name: ${item.name}, Quantity: ${item.quantity}, Price: $${item.price}\n`;
  });

  message += `\nTotal Price: $${cartData.totalPrice}`;
  
  return message;
}


}
