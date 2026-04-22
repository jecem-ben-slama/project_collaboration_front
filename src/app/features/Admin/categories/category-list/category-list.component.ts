import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../../../shared/models/category_model';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = []; // Used for the search filter
  displayedColumns: string[] = ['id', 'label', 'actions'];
  isLoading = true;

  constructor(
    private categoryService: CategoryService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data; // Initialize filtered list
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();

    if (!filterValue) {
      this.filteredCategories = this.categories;
      return;
    }

    this.filteredCategories = this.categories.filter(
      (cat) =>
        cat.label.toLowerCase().includes(filterValue) ||
        cat.id.toString().includes(filterValue)
    );
  }

  openCategoryForm(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      data: category || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchCategories();
    });
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message:
          'Are you sure you want to remove this category? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.notification.showSuccess('Deleted successfully');
            this.fetchCategories();
          },
          error: (err) => {
            if (err.status === 409) {
              this.notification.showError(
                err.error.message || 'Cannot delete: Item is in use.'
              );
            } else {
              this.notification.showError('An unexpected error occurred.');
            }
          },
        });
      }
    });
  }
}
