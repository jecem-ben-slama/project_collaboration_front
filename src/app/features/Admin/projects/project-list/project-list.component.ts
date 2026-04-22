import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../../../shared/models/project_model';
import { ProjectService } from '../../../../core/services/project.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  displayedColumns: string[] = ['name', 'description', 'status', 'actions'];
  isLoading = true;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
    });
  }

  openProjectForm(project?: Project): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '500px',
      data: project || null,
    });

    dialogRef.afterClosed().subscribe((val) => {
      if (val) this.fetchProjects();
    });
  }
  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message:
          'Are you sure you want to remove this project? This action cannot be undone.',
      },
    });

 dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.notification.showSuccess('Deleted successfully');
          this.fetchProjects();
        },
        error: (err) => {
          if (err.status === 409) {
            // This catches your specific backend message
            this.notification.showError(err.error.message || 'Cannot delete: Item is in use.');
          } else {
            this.notification.showError('An unexpected error occurred.');
          }
        }
      });
    }
  });
}
}