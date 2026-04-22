import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../shared/models/auth_response_model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  // --- Reactive State Management ---
  // BehaviorSubject holds the current session info so other components can subscribe to changes
  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );
  public currentUser$ = this.currentUserSubject.asObservable();

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

  // --- Profile Synchronization ---

  /**
   * Updates the current session data when a user modifies their profile.
   * Merges new updates with existing session data (preserving the token).
   */
  updateCurrentUser(updatedFields: any): void {
    const currentData = this.getUserFromStorage() || {};

    // Merge existing data (like token) with the new updates (name, email, etc.)
    const newData = { ...currentData, ...updatedFields };

    // Update LocalStorage
    localStorage.setItem('token', newData.token || '');
    localStorage.setItem('email', newData.email || '');
    if (newData.userId || newData.id) {
      localStorage.setItem('userId', (newData.userId ?? newData.id).toString());
    }
    // If your backend returns 'name', store it as well
    if (newData.name) {
      localStorage.setItem('userName', newData.name);
    }

    // Notify all subscribers of the new data
    this.currentUserSubject.next(newData);
  }

  private getUserFromStorage(): any {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');

    if (!token) return null;

    return {
      token,
      email,
      userId: userId ? parseInt(userId, 10) : null,
      name,
    };
  }

  // --- Password Management ---

  forgotPassword(email: string): Observable<string> {
    return this.http.post(
      `${this.API_URL}/users/forgot-password`,
      { email },
      { responseType: 'text' } // <--- Add this to handle the raw string return
    );
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

  resetPassword(resetData: any): Observable<string> {
    return this.http.post(
      `${this.API_URL}/users/reset-password`,
      resetData,
      { responseType: 'text' } // <--- This tells Angular not to look for JSON
    );
  }

  // --- Session & RBAC Helpers ---

  private saveSession(authResponse: AuthResponse): void {
    const idValue = authResponse.userId ?? (authResponse as any).id;

    localStorage.setItem('token', authResponse.token || '');
    localStorage.setItem('email', authResponse.email || '');

    if (idValue !== undefined && idValue !== null) {
      localStorage.setItem('userId', idValue.toString());
    }

    // Refresh the BehaviorSubject after login
    this.currentUserSubject.next(this.getUserFromStorage());
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

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
    localStorage.clear();
    this.currentUserSubject.next(null); // Clear the reactive state
  }
}
