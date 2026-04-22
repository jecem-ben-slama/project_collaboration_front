import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AffectationService } from '../../core/services/affectation.service';
import { TeamDetailsDialogComponent } from '../assignments/team-details-dialog/team-details-dialog.component';
import { TeammatesListComponent } from '../teammates-list/teammates-list.component';

@Component({
  selector: 'app-my-assignments',
  templateUrl: './my-assignments.component.html',
  styleUrls: ['./my-assignments.component.css'],
})
export class MyAssignmentsComponent implements OnInit {
  assignments: any[] = [];
  isLoading = true;

  constructor(
    private affectationService: AffectationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMyWork();
  }

  loadMyWork(): void {
    this.isLoading = true;
    this.affectationService.getMyAssignments().subscribe({
      next: (data) => {
        this.assignments = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  viewTeam(projectId: number): void {
    console.log('Opening teammates for ID:', projectId);
    this.dialog.open(TeammatesListComponent, {
      width: '450px',
      data: { projectId }, // This matches the data.projectId check in the constructor
      panelClass: 'custom-bento-dialog', // Optional: for custom styling
    });
  }
}
