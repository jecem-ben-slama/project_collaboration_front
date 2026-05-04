import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    categoryId: null,
  };
  categories: any[] = [];
  isLoading = true;
  isSaving = false;

  // Show/Hide Password State
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        const id = this.authService.getUserId();
        if (id) this.loadUserProfile(id);
      },
      error: () => {
        this.snackBar.open('Error loading categories', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  loadUserProfile(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = {
          ...data,
          categoryId: Number(data.categoryId),
          password: '',
          confirmPassword: '', // Initialize empty
        };
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  // Getter to check mismatch for the template
  get passwordsMismatch(): boolean {
    if (!this.user.password && !this.user.confirmPassword) return false;
    return this.user.password !== this.user.confirmPassword;
  }

  onUpdateProfile() {
    if (!this.user.name || !this.user.email || this.passwordsMismatch) return;

    this.isSaving = true;
    const payload = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password || null,
      categoryId: this.user.categoryId ? Number(this.user.categoryId) : null,
    };

    this.userService.updateUser(this.user.id, payload).subscribe({
      next: (res) => {
        this.authService.updateCurrentUser(res);
        this.user.password = ''; // Reset fields after success
        this.user.confirmPassword = '';
        this.isSaving = false;
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: () => {
        this.isSaving = false;
        this.snackBar.open('Update failed', 'Close', { duration: 3000 });
      },
    });
  }
}
