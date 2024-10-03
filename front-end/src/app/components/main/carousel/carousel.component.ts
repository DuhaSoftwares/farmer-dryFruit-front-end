import { AfterViewInit, Component, Input } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements AfterViewInit {
  // @Input() carouselItems: any[] = [];

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
}