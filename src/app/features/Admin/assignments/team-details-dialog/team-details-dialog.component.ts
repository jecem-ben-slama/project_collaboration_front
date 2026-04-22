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

  onRemove(userId: number) {
    if (confirm('Are you sure you want to remove this user?')) {
      this.affectationService
        .removeAffectation(this.project.id, userId)
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Member removed successfully');
            this.dialogRef.close(true);
          },
          error: (err) => {
            // Handle the 200 OK parsing error as success
            if (err.status === 200) {
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

  onEdit(user: any) {
    // Send user data back to TeamOverviewComponent to open the edit form
    this.dialogRef.close({ action: 'edit', user: user });
  }
}
