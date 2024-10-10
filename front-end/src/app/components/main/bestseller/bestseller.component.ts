import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-bestseller',
  templateUrl: './bestseller.component.html',
  styleUrls: ['./bestseller.component.css'],
})
export class BestsellerComponent {
  bestSellingProducts: Product[] = [];
  constructor(public commonService: CommonService) {}

  ngOnInit(): void {
    // Subscribe to the bestSellingProducts observable
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
