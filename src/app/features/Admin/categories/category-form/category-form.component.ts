import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../shared/models/category_model';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      label: [this.data?.label || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    if (this.isEditMode) {
      this.categoryService
        .updateCategory(this.data.id, this.categoryForm.value)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Update failed', err),
        });
    } else {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Creation failed', err),
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
