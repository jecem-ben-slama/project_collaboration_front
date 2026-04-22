import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from '../../../../shared/models/project_model';
import { ProjectService } from '../../../../core/services/project.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  dataSource = new MatTableDataSource<Project>([]);
  displayedColumns: string[] = ['name', 'description', 'status', 'actions'];
  isLoading = true;
  selectedStatus = '';

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();

    // Set up custom filter for both search text and status dropdown
    this.dataSource.filterPredicate = (data: Project, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const nameMatch = data.name.toLowerCase().includes(searchTerms.search);
      const statusMatch = searchTerms.status
        ? data.status.toLowerCase() === searchTerms.status.toLowerCase()
        : true;
      return nameMatch && statusMatch;
    };
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notification.showError('Failed to load projects');
      },
    });
  }

  updateFilters(searchText: string, status: string): void {
    const filterValue = {
      search: searchText.trim().toLowerCase(),
      status: status,
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  applySearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.updateFilters(searchValue, this.selectedStatus);
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    const currentSearch = this.dataSource.filter
      ? JSON.parse(this.dataSource.filter).search
      : '';
    this.updateFilters(currentSearch, status);
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.deleteProject(id).subscribe({
          next: () => {
            this.notification.showSuccess('Deleted successfully');
            this.fetchProjects();
          },
          error: (err) => {
            const msg =
              err.status === 409
                ? err.error.message
                : 'An unexpected error occurred.';
            this.notification.showError(msg);
          },
        });
      }
    });
  }
}
