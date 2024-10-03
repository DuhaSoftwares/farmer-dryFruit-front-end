import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiBaseUrl}/products`);
  }
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/categories`);
  }

  getProductsByCategoryId(categoryId: string): Observable<any> {
    const url = `${environment.apiBaseUrl}/category/${categoryId}`; // Pass categoryId in the path
    return this.http.get<any>(url);
  }
}