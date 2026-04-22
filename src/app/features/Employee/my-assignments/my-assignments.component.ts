import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeammatesListComponent } from '../teammates-list/teammates-list.component';
import { AffectationService } from '../../../core/services/affectation.service';

@Component({
  selector: 'app-my-assignments',
  templateUrl: './my-assignments.component.html',
  styleUrls: ['./my-assignments.component.css'],
})
export class MyAssignmentsComponent implements OnInit {
  assignments: any[] = [];
  filteredAssignments: any[] = [];
  isLoading = true;

  searchTerm: string = '';
  selectedStatus: string = '';

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
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredAssignments = this.assignments.filter((item) => {
      const matchesSearch =
        item.project.name.toLowerCase().includes(this.searchTerm) ||
        item.project.description?.toLowerCase().includes(this.searchTerm);

      const matchesStatus = this.selectedStatus
        ? item.project.status === this.selectedStatus
        : true;

      return matchesSearch && matchesStatus;
    });
  }

  viewTeam(projectId: number): void {
    this.dialog.open(TeammatesListComponent, {
      width: '450px',
      data: { projectId },
      panelClass: 'custom-bento-dialog',
    });
  }
}
