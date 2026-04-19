// src/app/features/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  role: string | null = '';
  userEmail: string | null = "";
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.userEmail = localStorage.getItem('email');

    // Simple RBAC check: In a real app, you'd decode the JWT roles.
    // For now, we check if the email belongs to an admin.
    this.isAdmin = this.role === 'ADMIN';
  }

  onLogout() {
    this.authService.logout();
    window.location.reload(); // Simple way to clear state and trigger route guard
  }
}
