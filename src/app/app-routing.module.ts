import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { allowedRoles: ['ADMIN', 'EMPLOYEE'] },
    children: [
      { path: 'projects', component: ProjectListComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
