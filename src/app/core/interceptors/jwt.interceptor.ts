// src/app/core/interceptors/jwt.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 1. Get the token from our AuthService (Model)
    const token = this.authService.getToken();

    // 2. If the token exists, clone the request and add the Authorization header
    // We clone because HttpRequest objects are immutable
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // 3. Send the request to the next handler
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // 4. Global Error Handling: If the backend returns 401 (Unauthorized)
        // it means the token is expired or invalid.
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
