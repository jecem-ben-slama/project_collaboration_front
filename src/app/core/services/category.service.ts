import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../../shared/models/category_model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly API_URL = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // POST /add - Create a new category
  createCategory(categoryData: any): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/add`, categoryData);
  }

  // GET /all - Get all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/all`);
  }

  // GET /:id - Get category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/${id}`);
  }

  // PUT /:id - Update a category
  updateCategory(id: number, categoryData: any): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/${id}`, categoryData);
  }

  // DELETE /:id - Delete a category
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
