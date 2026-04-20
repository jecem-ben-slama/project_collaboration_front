import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user_model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // GET /all - Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/all`);
  }

  // GET /:id - Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  // PUT /:id - Update user details
  updateUser(id: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, userData);
  }

  // DELETE /:id - Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
