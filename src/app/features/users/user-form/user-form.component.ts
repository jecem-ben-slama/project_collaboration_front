import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user_model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      // Password required only for new users
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(4)],
      ],
      role: [this.data?.role || 'EMPLOYEE', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.isEditMode) {
      this.userService.updateUser(this.data.id, userData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Update failed', err),
      });
    } else {
      // For creating a new user, we pass 0 or handle it via a dedicated 'create' endpoint
      this.userService.updateUser(0, userData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Creation failed', err),
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
