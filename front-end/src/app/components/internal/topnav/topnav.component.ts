import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
})
export class TopnavComponent {
  constructor(public commonService: CommonService) {}
  itemsInCart: number = 0;
  ngOnInit(): void {
    this.getCartLength();
  }

  getCartLength() {
    this.commonService.itemCount$.subscribe((count) => {
      this.itemsInCart = count;
    });
  }
}
