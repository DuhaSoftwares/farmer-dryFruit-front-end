import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/main/home/home.component';
import { SingleProductComponent } from './components/main/single-product/single-product.component';
import { ShopComponent } from './components/main/shop/shop.component';
import { CartComponent } from './components/main/cart/cart.component';
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { PrivacyComponent } from './components/main/privacy/privacy.component';
import { ContactComponent } from './components/main/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'shop',
    component: ShopComponent,
  },
  {
    path: 'single-product/:id',
    component: SingleProductComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  // providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}
