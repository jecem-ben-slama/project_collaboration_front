import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { ProjectService } from '../../../../core/services/project.service';
import { AffectationService } from '../../../../core/services/affectation.service';
import { NotificationService } from '../../../../core/services/notification.service';


@Component({
  selector: 'app-assign-user-form',
  templateUrl: './assign-user-form.component.html',
  styleUrls: ['./assign-user-form.component.css'],
})
export class AssignUserFormComponent implements OnInit {
  assignForm!: FormGroup;
  users$ = this.userService.getAllUsers();
  isSubmitting = false;
  isEditMode = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private affectationService: AffectationService,
    public dialogRef: MatDialogRef<AssignUserFormComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      projectId: number;
      currentAssignments: any[];
      editData?: any;
    }
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.editData;

    this.assignForm = this.fb.group(
      {
        userId: [this.data.editData?.id || null, Validators.required],
        projectId: [this.data.projectId, Validators.required],
        startDate: [
          this.data.editData?.startDate
            ? new Date(this.data.editData.startDate)
            : null,
          Validators.required,
        ],
        endDate: [
          this.data.editData?.endDate
            ? new Date(this.data.editData.endDate)
            : null,
          Validators.required,
        ],
        teamLeader: [this.data.editData?.teamLeader || false],
      },
      { validators: this.dateRangeValidator }
    );

    if (this.isEditMode) {
      this.assignForm.get('userId')?.disable(); // Can't change user during edit
    }

    this.assignForm.get('startDate')?.valueChanges.subscribe((start) => {
      const endControl = this.assignForm.get('endDate');
      if (
        start &&
        endControl?.value &&
        new Date(endControl.value) < new Date(start)
      ) {
        endControl.setValue(start);
      }
    });
  }

  dateRangeValidator(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && new Date(end) < new Date(start)) {
      group.get('endDate')?.setErrors({ dateInvalid: true });
    } else {
      group.get('endDate')?.setErrors(null);
    }
    return null;
  }

  disablePastDates = (date: Date | null): boolean => {
    if (!date) return false;
    return date >= this.startOfDay(this.today);
  };

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  onSubmit(): void {
    if (this.assignForm.invalid) return;

    // getRawValue includes disabled fields like userId
    const formValue = this.assignForm.getRawValue();

    // Leader Check: only block if changing a non-leader to a leader
    if (formValue.teamLeader === true && !this.data.editData?.teamLeader) {
      const hasExistingLeader = this.data.currentAssignments?.some(
        (u) => u.teamLeader === true
      );
      if (hasExistingLeader) {
        this.notificationService.showError(
          'This project already has an assigned Team Leader.'
        );
        return;
      }
    }

    this.isSubmitting = true;
    const payload = {
      ...formValue,
      startDate: this.formatDate(formValue.startDate),
      endDate: this.formatDate(formValue.endDate),
    };

    const request$ = this.isEditMode
      ? this.affectationService.updateAffectation(payload)
      : this.affectationService.assignUserToProject(payload);

    request$.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Assignment updated!' : 'Member assigned!'
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notificationService.showError(
          err.error?.message || 'Action failed'
        );
      },
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }
}
