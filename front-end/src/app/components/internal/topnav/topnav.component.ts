import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
})
export class TopnavComponent {
  constructor(private productService: ProductsService) {}

  sessionId: string = 'yourSessionIdHere'; // Replace with the actual session ID
  totalCartItems: number = 0;

  ngOnInit(): void {
    // this.sessionId = this.getSessionIdFromCookies();
    if (this.sessionId) {
      this.getTotalCartItems();
    } else {
      console.error('Session ID not found in cookies');
    }
  }
  getTotalCartItems(): void {
    this.productService.getTotalCartItemsCount(this.sessionId).subscribe({
      next: (data) => {
        this.totalCartItems = data;
        console.log('Total Cart Items:', this.totalCartItems);
      },
      error: (error) => {
        console.error('Error fetching total cart items count:', error);
      },
    });
  }

  // Function to extract session ID from browser cookies
  getSessionIdFromCookies(): string {
    const cookies = document.cookie.split(';');
    const sessionIdCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('sessionId=')
    );

    if (sessionIdCookie) {
      return sessionIdCookie.split('=')[1].trim(); // Return the session ID value
    }
    return '';
  }
}
