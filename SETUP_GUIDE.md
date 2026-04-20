# Setup Instructions

## Step 1: Update environment.ts

Make sure your API URL is configured:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api", // Update with your backend URL
};
```

---

## Step 2: Create HTTP Interceptor for JWT

**File:** `src/app/core/interceptors/jwt.interceptor.ts`

```typescript
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.authService.logout();
          this.router.navigate(["/login"]);
        }
        return throwError(() => error);
      })
    );
  }
}
```

---

## Step 3: Update app.module.ts

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

// Material Modules
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatNavListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";

// App Components
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { LoginComponent } from "./features/auth/login/login.component";
import { HomeComponent } from "./features/home/home.component";
import { ProjectListComponent } from "./features/projects/project-list/project-list.component";
import { CategoryListComponent } from "./features/categories/category-list/category-list.component";
import { UserListComponent } from "./features/users/user-list/user-list.component";

// Interceptors
import { JwtInterceptor } from "./core/interceptors/jwt.interceptor";

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, ProjectListComponent, CategoryListComponent, UserListComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule, ReactiveFormsModule, FormsModule, MatSidenavModule, MatToolbarModule, MatNavListModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule, MatTableModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

---

## Step 4: Setup Routing (app-routing.module.ts)

```typescript
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./features/auth/login/login.component";
import { HomeComponent } from "./features/home/home.component";
import { ProjectListComponent } from "./features/projects/project-list/project-list.component";
import { CategoryListComponent } from "./features/categories/category-list/category-list.component";
import { UserListComponent } from "./features/users/user-list/user-list.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "projects",
    component: ProjectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "categories",
    component: CategoryListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    component: UserListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

---

## Step 5: Create/Update Auth Guard

**File:** `src/app/core/guards/auth.guard.ts`

```typescript
import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirect to login with return URL
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
```

---

## Step 6: Test the Application

1. **Start your backend server** (on port 8080)
2. **Run Angular dev server:**
   ```bash
   npm start
   ```
3. **Navigate to:** http://localhost:4200

4. **Test Login:**
   - Email: john.doe@example.com
   - Password: SecurePass123!

---

## API Endpoints Summary

| Feature           | Method | Endpoint                   |
| ----------------- | ------ | -------------------------- |
| **Auth**          | POST   | /auth/login                |
| Register          | POST   | /users/register            |
| Forgot Password   | POST   | /forgot-password           |
| Change Password   | POST   | /users/change-password     |
| Reset Password    | POST   | /users/reset-password      |
| **Categories**    | GET    | /categories/all            |
| Create Category   | POST   | /categories/add            |
| Update Category   | PUT    | /categories/:id            |
| Delete Category   | DELETE | /categories/:id            |
| **Users**         | GET    | /users/all                 |
| Get User          | GET    | /users/:id                 |
| Update User       | PUT    | /users/:id                 |
| Delete User       | DELETE | /users/:id                 |
| **Projects**      | GET    | /projects/all              |
| Get Assigned      | GET    | /projects/assigned         |
| Create Project    | POST   | /projects/create           |
| Update Project    | PUT    | /projects/:id              |
| Delete Project    | DELETE | /projects/:id              |
| Assign Member     | POST   | /projects/assign           |
| Remove Assignment | GET    | /projects/removeAssignment |
| **Notes**         | POST   | /notes/add                 |
| Get Notes         | GET    | /notes/project/:projectId  |
| Update Note       | PUT    | /notes/:id                 |
| Delete Note       | DELETE | /notes/:id                 |

---

## Troubleshooting

### CORS Issues:

If you get CORS errors, make sure your backend allows requests from localhost:4200

### 401 Unauthorized:

- Check that token is being saved correctly
- Verify JWT interceptor is attached
- Check token expiration

### Module Not Found Errors:

- Run `npm install` to install dependencies
- Check that all Material modules are imported in app.module.ts

### Services Not Injecting:

- Make sure services have `providedIn: 'root'`
- Verify they're injected correctly in component constructors
