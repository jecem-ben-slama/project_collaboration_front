import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user_model';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'email', 'role', 'actions'];
  isLoading = true;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
      },
    });
  }

  // This function handles opening the dialog
  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '450px',
      data: user || null, // If user is passed, it's Edit mode. If null, it's Add mode.
      disableClose: true, // Prevents closing by clicking outside
    });

    dialogRef.afterClosed().subscribe((result) => {
      // If the dialog returns 'true' (saved successfully), refresh the list
      if (result) {
        this.fetchUsers();
      }
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
          if (err.status === 409) {
            // This catches your specific backend message
            this.notification.showError(
              err.error.message || 'Cannot delete: Item is in use.'
            );
          } else {
            this.notification.showError('An unexpected error occurred.');
          }
        },
      });
    }
  });
  }
}
