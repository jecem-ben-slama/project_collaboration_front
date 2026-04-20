# Project File Structure & Quick Reference

## Complete Directory Structure

```
project_collaboration_front/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts ← Protects routes
│   │   │   ├── interceptors/
│   │   │   │   └── jwt.interceptor.ts ← Adds auth headers
│   │   │   └── services/
│   │   │       ├── auth.service.ts ← Login, Register, Password
│   │   │       ├── category.service.ts ← Category CRUD
│   │   │       ├── project.service.ts ← Project & Assignment CRUD
│   │   │       ├── user.service.ts ← User management
│   │   │       └── note.service.ts ← Notes CRUD
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   │       ├── login.component.ts
│   │   │   │       ├── login.component.html
│   │   │   │       └── login.component.css
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   └── home.component.html
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   └── project-list/
│   │   │   │       ├── project-list-api.component.ts
│   │   │   │       └── project-list-api.component.html
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   └── category-list/
│   │   │   │       ├── category-list-api.component.ts
│   │   │   │       └── category-list-api.component.html
│   │   │   │
│   │   │   └── users/
│   │   │       └── user-list/
│   │   │           ├── user-list-api.component.ts
│   │   │           └── user-list-api.component.html
│   │   │
│   │   ├── shared/
│   │   │   └── models/
│   │   │       ├── auth_response_model.ts
│   │   │       ├── user_model.ts
│   │   │       ├── category_model.ts
│   │   │       ├── project_model.ts
│   │   │       ├── project_assignment_model.ts
│   │   │       └── note_model.ts ← NEW
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   └── app.component.ts
│   │
│   ├── environments/
│   │   ├── environment.ts ← Configure API URL
│   │   └── environment.prod.ts
│   │
│   └── main.ts
│
├── angular.json
├── package.json
├── tsconfig.json
├── API_INTEGRATION_SUMMARY.md ← Documentation
└── SETUP_GUIDE.md ← Setup Instructions
```

---

## Quick Reference: Service Methods

### 📝 AuthService

```typescript
// Login
this.authService.login({ email, password });

// Register
this.authService.register(userData);

// Password Management
this.authService.forgotPassword(email);
this.authService.changePassword({ oldPassword, newPassword, confirmPassword });
this.authService.resetPassword({ token, newPassword, confirmPassword });

// Session
this.authService.getToken();
this.authService.getEmail();
this.authService.getUserId();
this.authService.isAuthenticated();
this.authService.logout();
```

---

### 🏷️ CategoryService

```typescript
// CRUD
this.categoryService.createCategory(data);
this.categoryService.getAllCategories();
this.categoryService.getCategoryById(id);
this.categoryService.updateCategory(id, data);
this.categoryService.deleteCategory(id);
```

---

### 👥 UserService

```typescript
// User Management
this.userService.getAllUsers();
this.userService.getUserById(id);
this.userService.updateUser(id, data);
this.userService.deleteUser(id);
```

---

### 📊 ProjectService

```typescript
// Projects
this.projectService.createProject(data);
this.projectService.getAllProjects();
this.projectService.getProjectById(id);
this.projectService.getAssignedProjects();
this.projectService.updateProject(id, data);
this.projectService.deleteProject(id);

// Assignments
this.projectService.assignMember(projectId, userId);
this.projectService.removeAssignment(projectId, userId);
```

---

### 📝 NoteService

```typescript
// Notes
this.noteService.addNote(data);
this.noteService.getNotesByProjectId(projectId);
this.noteService.updateNote(id, data);
this.noteService.deleteNote(id);
```

---

## Component Method Quick Reference

### LoginComponent

```typescript
ngOnInit(); // Initialize form
initializeForm(); // Setup reactive form
onLogin(); // Handle login
```

### HomeComponent

```typescript
ngOnInit(); // Load assigned projects
loadAssignedProjects(); // Fetch user's projects
viewProject(projectId); // Navigate to project
onLogout(); // Logout user
```

### ProjectListComponent

```typescript
ngOnInit(); // Load all projects
initializeForm(); // Setup project form
loadProjects(); // Fetch projects
createProject(); // Create new project
deleteProject(id); // Delete project
toggleCreateForm(); // Show/hide form
```

### CategoryListComponent

```typescript
ngOnInit(); // Load categories
initializeForm(); // Setup category form
loadCategories(); // Fetch categories
createCategory(); // Create new category
deleteCategory(id); // Delete category
toggleCreateForm(); // Show/hide form
```

### UserListComponent

```typescript
ngOnInit(); // Load users
loadUsers(); // Fetch all users
deleteUser(id); // Delete user
```

---

## Common Usage Patterns

### Pattern 1: Fetch Data in ngOnInit

```typescript
ngOnInit(): void {
  this.loadProjects();
}

loadProjects(): void {
  this.loading = true;
  this.projectService.getAllProjects().subscribe({
    next: (data) => {
      this.projects = data;
      this.loading = false;
    },
    error: (error) => {
      this.error = error?.error?.message || 'Error loading projects';
      this.loading = false;
    }
  });
}
```

---

### Pattern 2: Create with Form

```typescript
createProject(): void {
  if (this.form.invalid) return;

  this.projectService.createProject(this.form.value).subscribe({
    next: (project) => {
      this.projects.push(project);
      this.snackBar.open('Success!', 'Close', { duration: 3000 });
      this.form.reset();
    },
    error: (error) => {
      this.snackBar.open(error?.error?.message, 'Close', { duration: 3000 });
    }
  });
}
```

---

### Pattern 3: Delete with Confirmation

```typescript
deleteProject(id: number): void {
  if (confirm('Are you sure?')) {
    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== id);
        this.snackBar.open('Deleted successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open(error?.error?.message, 'Close', { duration: 3000 });
      }
    });
  }
}
```

---

## Material Components Cheat Sheet

```html
<!-- Button -->
<button mat-raised-button color="primary">Click Me</button>

<!-- Card -->
<mat-card>
  <mat-card-title>Title</mat-card-title>
  <mat-card-content>Content</mat-card-content>
</mat-card>

<!-- Form Field -->
<mat-form-field appearance="outline">
  <mat-label>Label</mat-label>
  <input matInput formControlName="fieldName" />
  <mat-error>Error message</mat-error>
</mat-form-field>

<!-- Select -->
<mat-form-field>
  <mat-label>Select</mat-label>
  <mat-select formControlName="option">
    <mat-option value="1">Option 1</mat-option>
  </mat-select>
</mat-form-field>

<!-- Table -->
<table mat-table [dataSource]="data">
  <ng-container matColumnDef="column1">
    <th mat-header-cell *matHeaderCellDef>Header</th>
    <td mat-cell *matCellDef="let element">{{ element.column1 }}</td>
  </ng-container>
  <tr mat-header-row *matHeaderRowDef="['column1']"></tr>
  <tr mat-row *matRowDef="let row; columns: ['column1'];"></tr>
</table>

<!-- Icon -->
<mat-icon>home</mat-icon>

<!-- Spinner -->
<mat-spinner></mat-spinner>

<!-- Snackbar (in TypeScript) -->
this.snackBar.open('Message', 'Close', { duration: 3000 });
```

---

## Reactive Forms Cheat Sheet

```typescript
// Create Form
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  name: ['', Validators.required]
});

// In Template
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email">
  <mat-error *ngIf="form.get('email')?.hasError('email')">
    Invalid email
  </mat-error>
</form>

// In Component
form.get('email')?.value          // Get value
form.get('email')?.hasError()     // Check error
form.get('email')?.invalid        // Check invalid
form.reset()                      // Reset form
form.value                        // Get all values
```

---

## HTTP Calls with Error Handling

```typescript
this.http.get<Type>("/api/endpoint").subscribe({
  next: (data: Type) => {
    // Success
  },
  error: (error: HttpErrorResponse) => {
    const message = error?.error?.message || "An error occurred";
    this.snackBar.open(message, "Close");
  },
  complete: () => {
    // Always called
  },
});
```

---

## TypeScript/Angular Tips

```typescript
// Filter array
this.items = this.items.filter(item => item.id !== deletedId);

// Map array
this.names = this.users.map(user => user.name);

// Find single item
const user = this.users.find(u => u.id === 5);

// Check condition
if (this.authService.isAuthenticated()) { }

// Ternary operator
{{ condition ? 'Yes' : 'No' }}

// Safe navigation
{{ user?.name }}

// String interpolation
{{ user.firstName + ' ' + user.lastName }}

// Pipe (filtering/formatting)
{{ date | date: 'short' }}
{{ amount | currency }}
{{ text | uppercase }}
```

---

## Important Notes

⚠️ **Before running the application:**

1. Update `environment.ts` with correct API URL
2. Ensure backend is running
3. Import all modules in `app.module.ts`
4. Add Auth Guard to protect routes
5. Create JWT Interceptor for auth headers

✅ **Testing tips:**

- Use Network tab in DevTools to see API calls
- Check localStorage for token storage
- Verify headers include Authorization
- Test with invalid credentials first
- Clear browser cache if seeing old data

📚 **Resources:**

- Angular Docs: https://angular.io/docs
- Material UI: https://material.angular.io
- RxJS: https://rxjs.dev
- Angular Material Icons: https://fonts.google.com/icons
