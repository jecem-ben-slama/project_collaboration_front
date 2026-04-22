import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Affectation,
  AffectationRequest,
} from '../../shared/models/affectation_model';
import { ProjectOverview } from '../../shared/models/project_details_model';

@Injectable({ providedIn: 'root' })
export class AffectationService {
  private readonly API_URL = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}
  getProjectsOverview(): Observable<ProjectOverview[]> {
    // Assuming the endpoint is /projects/overview or similar
    return this.http.get<ProjectOverview[]>(`${this.API_URL}/all-details`);
  }
  assignUserToProject(data: AffectationRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/assign`, data);
  }

  getAffectationsByProject(projectId: number): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.API_URL}/project/${projectId}`);
  }

  removeAffectation(projectId: number, userId: number): Observable<string> {
    return this.http.delete(
      `${this.API_URL}/${projectId}/remove-user/${userId}`,
      { responseType: 'text' } // ✅ Tell Angular it's not JSON
    );
  }
  updateAffectation(payload: any): Observable<any> {
    // Matches the structure you tested in Postman
    return this.http.put(`${this.API_URL}/update`, payload);
  }
}
