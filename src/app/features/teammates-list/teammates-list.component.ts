import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignedUser } from '../../shared/models/project_details_model';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-teammates-list',
  templateUrl: './teammates-list.component.html',
  styleUrls: ['./teammates-list.component.css'],
})
export class TeammatesListComponent implements OnInit {
  // We keep this for flexibility, but prioritize dialog data
  projectId!: number;
  teammates: AssignedUser[] = [];
  isLoading = true;

  constructor(
    private projectService: ProjectService,
    @Optional() public dialogRef: MatDialogRef<TeammatesListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // If opened via dialog, get ID from data. Otherwise, it comes from @Input
    if (data && data.projectId) {
      this.projectId = data.projectId;
    }
  }

  ngOnInit(): void {
    if (this.projectId) {
      this.fetchTeammates();
    } else {
      console.error('No Project ID found in TeammatesListComponent');
      this.isLoading = false;
    }
  }

  fetchTeammates(): void {
    this.isLoading = true;
    this.projectService.getTeammates(this.projectId).subscribe({
      next: (data) => {
        this.teammates = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
