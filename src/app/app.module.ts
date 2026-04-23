// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table'; // <--- Add this for the table
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './features/auth/login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { AppButtonComponent } from './shared/components/app-button/app-button.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminLayoutComponent } from './features/Admin/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './features/Employee/user-layout/user-layout.component';
import { UserFormComponent } from './features/Admin/users/user-form/user-form.component';
import { UserListComponent } from './features/Admin/users/user-list/user-list.component';
import { CategoryFormComponent } from './features/Admin/categories/category-form/category-form.component';
import { ProjectListComponent } from './features/Admin/projects/project-list/project-list.component';
import { CategoryListComponent } from './features/Admin/categories/category-list/category-list.component';
import { ProjectFormComponent } from './features/Admin/projects/project-form/project-form.component';
import { TeamOverviewComponent } from './features/Admin/assignments/team-overview/team-overview.component';
import { AssignUserFormComponent } from './features/Admin/assignments/assign-user-form/assign-user-form.component';
import { TeamDetailsDialogComponent } from './features/Admin/assignments/team-details-dialog/team-details-dialog.component';
import { MyAssignmentsComponent } from './features/Employee/my-assignments/my-assignments.component';
import { TeammatesListComponent } from './features/Employee/teammates-list/teammates-list.component';
import { ProjectNotesComponent } from './features/Employee/project-notes/project-notes.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { DashboardComponent } from './features/Admin/dashboard/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    UserListComponent,
    UserFormComponent,
    CategoryListComponent,
    CategoryFormComponent,
    ProjectListComponent,
    ProjectFormComponent,
    ConfirmDialogComponent,
    AppButtonComponent,
    TeamOverviewComponent,
    AssignUserFormComponent,
    TeamDetailsDialogComponent,
    MyAssignmentsComponent,
    TeammatesListComponent,
    ProjectNotesComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatMenuModule,
    MatCheckboxModule,
    NgChartsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
