import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { UserLayoutComponent } from './features/user-layout/user-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminLayoutComponent } from './features/admin-layout/admin-layout.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // ADMIN ROUTES
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
       { path: 'projects', component: ProjectListComponent },
      { path: 'users', component: UserListComponent },
      {path: 'categories', component: CategoryListComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // USER ROUTES
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['EMPLOYEE'] },
    children: [
      // { path: 'projects', component: ProjectListComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
    ],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
