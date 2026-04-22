import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // Initialize with nulls to prevent template errors
  user: any = { name: '', email: '', password: '', categoryId: null };
  categories: any[] = [];
  isLoading = true;
  isSaving = false;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // 1. Load categories first so they are ready for the user data
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories synced:', this.categories);

        // 2. Only load the profile after categories are fetched
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
          // Ensure categoryId is a Number for strict comparison
          categoryId: Number(data.categoryId), 
          password: '',
        };
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  onUpdateProfile() {
    if (!this.user.name || !this.user.email) return;

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
