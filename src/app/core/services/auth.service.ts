// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../shared/models/auth_response_model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- Authentication Actions ---

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/register`, userData);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
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

  // --- Password Management ---

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/forgot-password`, { email });
  }

  changePassword(passwords: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/users/change-password`,
      passwords
    );
  }

  resetPassword(resetData: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/users/reset-password`,
      resetData
    );
  }

  // --- Session & RBAC Helpers ---

  // src/app/core/services/auth.service.ts

  private saveSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token || '');
    localStorage.setItem('email', authResponse.email || '');

    // Use optional chaining and check both possible names (userId or id)
    const idValue = authResponse.userId ?? (authResponse as any).id;

    if (idValue !== undefined && idValue !== null) {
      localStorage.setItem('userId', idValue.toString());
    }
  }

  /**
   * Used by auth.guard to check if the user is authenticated.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Used by auth.guard to check permissions (RBAC).
   */
  hasRole(allowedRoles: string[]): boolean {
    const email = this.getEmail();
    if (!email) return false;

    // Logic: admin@jee.com is the ADMIN, others are EMPLOYEE
    const userRole = email === 'admin@jee.com' ? 'ADMIN' : 'EMPLOYEE';

    return allowedRoles.includes(userRole);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear(); // Clears all session data at once
  }
}
