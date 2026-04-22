import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AffectationService } from '../../../../core/services/affectation.service';
import { ProjectOverview } from '../../../../shared/models/project_details_model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-team-details-dialog',
  templateUrl: './team-details-dialog.component.html',
  styleUrls: ['./team-details-dialog.component.css'],
})
export class TeamDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public project: ProjectOverview,
    private affectationService: AffectationService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<TeamDetailsDialogComponent>
  ) {}

  /**
   * Cleans the user data and converts date strings to Date objects
   * before sending them back to the parent component.
   */
  onEdit(user: any) {
    const editPayload = {
      ...user,
      // CRITICAL: Convert strings to Date objects for mat-datepicker
      startDate: user.startDate ? new Date(user.startDate) : null,
      endDate: user.endDate ? new Date(user.endDate) : null,
    };
    this.dialogRef.close({ action: 'edit', user: editPayload });
  }

  onRemove(userId: number) {
    if (
      confirm('Are you sure you want to remove this user from the project?')
    ) {
      this.affectationService
        .removeAffectation(this.project.id, userId)
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Member removed successfully');
            this.dialogRef.close(true);
          },
          error: (err) => {
            // Handle cases where the server returns 200 OK but with a non-JSON body
            if (err.status === 200 || err.ok) {
              this.notificationService.showSuccess(
                'Member removed successfully'
              );
              this.dialogRef.close(true);
            } else {
              this.notificationService.showError('Failed to remove member');
            }
          },
        });
    }
  }
}
