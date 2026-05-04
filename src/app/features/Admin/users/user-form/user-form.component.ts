import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../../shared/models/category_model';
import { CategoryService } from '../../../../core/services/category.service';
import { UserService } from '../../../../core/services/user.service';

function passwordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmControl = group.get('confirmPassword');
  const confirm = confirmControl?.value;

  if (!password || !confirm) return null;

  if (password !== confirm) {
    confirmControl?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmControl?.hasError('passwordMismatch')) {
      const remainingErrors = { ...confirmControl.errors };
      delete remainingErrors['passwordMismatch'];
      confirmControl.setErrors(
        Object.keys(remainingErrors).length ? remainingErrors : null
      );
    }
    return null;
  }
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;
  categories: Category[] = [];
  isAdminRole: boolean = false;

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    let fName = '';
    let lName = '';
    if (this.data?.name) {
      const parts = this.data.name.split(' ');
      fName = parts[0] || '';
      lName = parts.slice(1).join(' ') || '';
    }

    this.userForm = this.fb.group(
      {
        firstName: [fName, Validators.required],
        lastName: [lName, Validators.required],
        email: [
          this.data?.email || '',
          [Validators.required, Validators.email],
        ],
        password: [
          '',
          this.isEditMode ? [] : [Validators.required, Validators.minLength(4)],
        ],
        confirmPassword: ['', this.isEditMode ? [] : [Validators.required]],
        role: [this.data?.role || 'EMPLOYEE', Validators.required],
        categoryId: [this.data?.categoryId || null],
      },
      { validators: this.isEditMode ? [] : [passwordMatchValidator] }
    );

    // 1. Load categories first
    this.loadCategories();

    // 2. Watch for role changes
    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      this.handleRoleChanges(role);
    });
  }

  private handleRoleChanges(role: string): void {
    this.isAdminRole = role === 'ADMIN';
    const categoryControl = this.userForm.get('categoryId');

    // Check if control exists to satisfy TypeScript
    if (!categoryControl) return;

    if (this.isAdminRole) {
      if (this.categories.length > 0) {
        const itAdmin = this.categories.find(
          (c) => c.label?.trim().toLowerCase() === 'it admin'
        );

        if (itAdmin) {
          categoryControl.setValue(itAdmin.id);
        }
      }
      categoryControl.clearValidators();
    } else {
      const itAdminId = this.categories.find(
        (c) => c.label?.trim().toLowerCase() === 'it admin'
      )?.id;

      if (categoryControl.value === itAdminId) {
        categoryControl.setValue(null);
      }
      categoryControl.setValidators([Validators.required]);
    }

    categoryControl.updateValueAndValidity();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((cats) => {
      this.categories = cats;
      // Once categories are loaded, run the role logic to ensure
      // the correct category is selected (especially in Edit Mode)
      this.handleRoleChanges(this.userForm.get('role')?.value);
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const val = this.userForm.getRawValue();
    const payload: any = {
      name: `${val.firstName} ${val.lastName}`.trim(),
      email: val.email,
      role: val.role,
      categoryId: val.categoryId,
    };

    if (!this.isEditMode) {
      payload.password = val.password;
    }

    const req = this.isEditMode
      ? this.userService.updateUser(this.data.id, payload)
      : this.userService.registerUser(payload);

    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Backend Error:', err);
        alert(`Error: ${err.error?.message || 'Operation failed'}`);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
