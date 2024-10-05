import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/main/home/home.component';
import { SingleProductComponent } from './components/main/single-product/single-product.component';
import { ShopComponent } from './components/main/shop/shop.component';
import { CartComponent } from './components/main/cart/cart.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }, // Use PathLocationStrategy
  ],
})
export class AppRoutingModule {}
