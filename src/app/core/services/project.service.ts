import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../../shared/models/project_model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly API_URL = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  // POST /create - Create a new project
  createProject(projectData: any): Observable<Project> {
    return this.http.post<Project>(`${this.API_URL}/create`, projectData);
  }

  // GET /all - Get all projects
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.API_URL}/all`);
  }

  // GET /:id - Get project by ID
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}/${id}`);
  }

  // GET /assigned - Get projects assigned to current user
  getAssignedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.API_URL}/assigned`);
  }

  // PUT /:id - Update project
  updateProject(id: number, projectData: any): Observable<Project> {
    return this.http.put<Project>(`${this.API_URL}/${id}`, projectData);
  }

  // DELETE /:id - Delete project
  deleteProject(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }

  // POST /assign - Assign member to project
  assignMember(projectId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/assign`, {
      projectId,
      userId,
    });
  }

  // GET /removeAssignment - Remove assignment from project
  removeAssignment(projectId: number, userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/removeAssignment?projectId=${projectId}&userId=${userId}`
    );
  }
}
