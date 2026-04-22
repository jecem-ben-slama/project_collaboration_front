import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  isLoading = false;
  isSubmitted = false; // Flag to delay error visibility

  hideNewPassword = true;
  hideConfirmPassword = true;

  resetData = {
    token: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  // Getter to identify if the mismatch error should be shown
  get showMismatchError(): boolean {
    return (
      this.isSubmitted &&
      this.resetData.confirmPassword !== '' &&
      this.resetData.newPassword !== this.resetData.confirmPassword
    );
  }

  onResetPassword(): void {
    this.isSubmitted = true; // Trigger visibility on click

    // Validation checks
    if (this.resetData.newPassword !== this.resetData.confirmPassword) {
      this.notification.showError('Passwords do not match!');
      return;
    }

    if (this.resetData.newPassword.length < 6) {
      this.notification.showError('Password must be at least 6 characters.');
      return;
    }

    this.isLoading = true;

    const payload = {
      token: this.resetData.token,
      newPassword: this.resetData.newPassword,
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.showSuccess(
          'Success! Your password has been updated.'
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Reset error:', err);
        this.notification.showError(
          'Failed to update. The token might be expired.'
        );
      },
    });
  }
}
