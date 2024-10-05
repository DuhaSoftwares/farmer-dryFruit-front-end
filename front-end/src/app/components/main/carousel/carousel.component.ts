import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
declare var $: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
  constructor(private productService: ProductsService) {}
  products: Product[] = [];
  ngOnInit(): void {
    this.getProductsByCategoryId();
  }
  ngAfterViewInit(): void {
    this.initializeCarousel();
  }
  initializeCarousel(): void {
    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 3000,
      nav: true,
      dots: true,
      responsive: {
        0: {
          items: 1, // Show 1 item on small screens (mobile)
        },
        600: {
          items: 2, // Show 2 items on screens >= 600px
        },
        1000: {
          items: 3, // Show 3 items on screens >= 1000px
        },
      },
    });
  }

  getProductsByCategoryId(): void {
    this.products = [];
    this.productService
      .getProductsByCategoryId(environment.carouselCategory)
      .subscribe(
        (data) => {
          this.products = data;
          console.log(data);
        },
        (error) => {
          console.error('Error fetching products', error);
        }
      );
  }
}
