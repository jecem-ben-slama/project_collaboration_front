// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../shared/models/auth_response_model';
import { User } from '../../shared/models/user_model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // POST /auth/login - Obtains the Bearer token
  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response && response.token) {
            this.saveSession(response);
          }
        })
      );
  }

  // POST /users/register - Creates a new user account [cite: 1-10]
  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/register`, userData);
  }

  // Session Management
  private saveSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('email', authResponse.email);
    localStorage.setItem('role', authResponse.role?.toUpperCase() ?? '');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  hasRole(allowedRoles: string[]): boolean {
    const role = this.getRole();
    if (!role) {
      return false;
    }
    const normalizedRole = role.toUpperCase();
    return allowedRoles.map((r) => r.toUpperCase()).includes(normalizedRole);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
  }

  // Helper to get current User ID for Note/Project logic [cite: 304]
  getCurrentUserId(): number {
    return Number(localStorage.getItem('userId'));
  }
}
