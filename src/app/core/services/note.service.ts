import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Note } from '../../shared/models/note_model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly API_URL = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  addNote(noteData: any): Observable<Note> {
    return this.http.post<Note>(`${this.API_URL}/add`, noteData);
  }

  getNotesByProjectId(projectId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.API_URL}/project/${projectId}`);
  }

  // PUT /:id - Update a note
  updateNote(id: number, noteData: any): Observable<Note> {
    return this.http.put<Note>(`${this.API_URL}/${id}`, noteData);
  }

  // DELETE /:id - Delete a note
  deleteNote(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }
}
