import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../core/services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { User } from '../../../../shared/models/user_model';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  // Use MatTableDataSource for built-in filtering
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['id','full name', 'email', 'role', 'actions'];
  isLoading = true;
  selectedRole = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();

    // Custom filter predicate to handle both Search and Role Dropdown
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const nameMatch = data.email.toLowerCase().includes(searchTerms.search);
      const roleMatch = searchTerms.role
        ? data.role?.toLowerCase() === searchTerms.role.toLowerCase()
        : true;
      return nameMatch && roleMatch;
    };
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
        this.notification.showError('Could not load user list');
      },
    });
  }

  // Combines text search and role filter
  updateFilters(searchText: string, role: string): void {
    const filterValue = {
      search: searchText.trim().toLowerCase(),
      role: role,
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  applySearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.updateFilters(searchValue, this.selectedRole);
  }

  onRoleFilter(role: string): void {
    this.selectedRole = role;
    // We get the current search value from the datasource filter if it exists
    const currentSearch = this.dataSource.filter
      ? JSON.parse(this.dataSource.filter).search
      : '';
    this.updateFilters(currentSearch, role);
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '450px',
      data: user || null,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchUsers();
    });
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message:
          'Are you sure you want to delete this user? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.notification.showSuccess('Deleted successfully');
            this.fetchUsers();
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
