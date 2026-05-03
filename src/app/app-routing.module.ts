import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { AdminLayoutComponent } from './features/Admin/admin-layout/admin-layout.component';
import { UserListComponent } from './features/Admin/users/user-list/user-list.component';
import { ProjectListComponent } from './features/Admin/projects/project-list/project-list.component';
import { TeamOverviewComponent } from './features/Admin/assignments/team-overview/team-overview.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { CategoryListComponent } from './features/Admin/categories/category-list/category-list.component';
import { ProjectNotesComponent } from './features/Employee/project-notes/project-notes.component';
import { MyAssignmentsComponent } from './features/Employee/my-assignments/my-assignments.component';
import { UserLayoutComponent } from './features/Employee/user-layout/user-layout.component';
import { DashboardComponent } from './features/Admin/dashboard/dashboard/dashboard.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';
import { guestGuard } from './core/guards/guest.guard';

//* Standard Routes: require no auth
const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },

  //* ADMIN ROUTES
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ProjectListComponent },
      { path: 'users', component: UserListComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'assignments', component: TeamOverviewComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  //* USER ROUTES
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['EMPLOYEE'] },
    children: [
      { path: 'projects', component: MyAssignmentsComponent },
      { path: 'notes', component: ProjectNotesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
    ],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
