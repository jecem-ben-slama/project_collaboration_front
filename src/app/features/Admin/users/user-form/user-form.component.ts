import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../../shared/models/category_model';
import { CategoryService } from '../../../../core/services/category.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Using any to handle incoming data flexibilty
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.loadCategories();

    // Split the name if we are in Edit Mode to pre-fill firstName/lastName
    let fName = '';
    let lName = '';
    if (this.data?.name) {
      const parts = this.data.name.split(' ');
      fName = parts[0] || '';
      lName = parts.slice(1).join(' ') || '';
    }

    this.userForm = this.fb.group({
      firstName: [fName, Validators.required],
      lastName: [lName, Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(4)],
      ],
      role: [this.data?.role || 'EMPLOYEE', Validators.required],
      categoryId: [this.data?.categoryId || null, Validators.required],
    });
  }

  loadCategories(): void {
    this.categoryService
      .getAllCategories()
      .subscribe((cats) => (this.categories = cats));
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const val = this.userForm.value;

    // MERGE LOGIC: Combine first and last name into one "name" field
    const payload = {
      name: `${val.firstName} ${val.lastName}`,
      email: val.email,
      password: val.password,
      role: val.role,
      categoryId: val.categoryId,
    };

    if (this.isEditMode) {
      this.userService.updateUser(this.data.id, payload).subscribe({
        next: () => this.dialogRef.close(true),
      });
    } else {
      this.userService.registerUser( payload).subscribe({
        next: () => this.dialogRef.close(true),
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
