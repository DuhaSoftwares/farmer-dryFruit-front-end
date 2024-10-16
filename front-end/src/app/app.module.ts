import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './components/internal/topnav/topnav.component';
import { HomeComponent } from './components/main/home/home.component';
import { FeatureComponent } from './components/main/feature/feature.component';
import { HeroComponent } from './components/main/hero/hero.component';
import { FruitshopComponent } from './components/main/fruitshop/fruitshop.component';
import { CarouselComponent } from './components/main/carousel/carousel.component';
import { BannerComponent } from './components/main/banner/banner.component';
import { BestsellerComponent } from './components/main/bestseller/bestseller.component';
import { FactsComponent } from './components/main/facts/facts.component';
import { TestimonialComponent } from './components/main/testimonial/testimonial.component';
import { FooterComponent } from './components/internal/footer/footer.component';
import { ShopComponent } from './components/main/shop/shop.component';
import { SingleProductComponent } from './components/main/single-product/single-product.component';
import { CartComponent } from './components/main/cart/cart.component';
import { NotFoundComponent } from './components/main/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { PrivacyComponent } from './components/main/privacy/privacy.component';
import { ContactComponent } from './components/main/contact/contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    HomeComponent,
    FeatureComponent,
    HeroComponent,
    FruitshopComponent,
    CarouselComponent,
    BannerComponent,
    BestsellerComponent,
    FactsComponent,
    TestimonialComponent,
    FooterComponent,
    ShopComponent,
    SingleProductComponent,
    CartComponent,
    NotFoundComponent,
    PrivacyComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
