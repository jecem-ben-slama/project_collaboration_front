import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignUserFormComponent } from '../assign-user-form/assign-user-form.component';
import { TeamDetailsDialogComponent } from '../team-details-dialog/team-details-dialog.component';
import { AffectationService } from '../../../../core/services/affectation.service';
import { ProjectOverview } from '../../../../shared/models/project_details_model';

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.css'],
})
export class TeamOverviewComponent implements OnInit {
  projects: ProjectOverview[] = [];
  isLoading = true;

  constructor(
    private affectationService: AffectationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchOverview();
  }

  fetchOverview(): void {
    this.isLoading = true;
    this.affectationService.getProjectsOverview().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  openAssignDialog(projectId: number, editData?: any): void {
    const selectedProject = this.projects.find((p) => p.id === projectId);

    const dialogRef = this.dialog.open(AssignUserFormComponent, {
      width: '500px',
      data: {
        projectId: projectId,
        currentAssignments: selectedProject
          ? selectedProject.assignedUsers
          : [],
        editData: editData, // Pass user data if editing
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.fetchOverview();
    });
  }

  viewTeamDetails(project: ProjectOverview): void {
    const dialogRef = this.dialog.open(TeamDetailsDialogComponent, {
      width: '550px',
      data: project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.fetchOverview();
      } else if (result?.action === 'edit') {
        this.openAssignDialog(project.id, result.user); // Re-open assignment form for editing
      }
    });
  }
}
