import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from '../../core/services/note.service';
import { AffectationService } from '../../core/services/affectation.service';
import { AuthService } from '../../core/services/auth.service';
import { Note } from '../../shared/models/note_model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-notes',
  templateUrl: './project-notes.component.html',
  styleUrls: ['./project-notes.component.css'],
})
export class ProjectNotesComponent implements OnInit {
  notes: Note[] = [];
  newNoteContent: string = '';
  searchTerm: string = '';
  selectedProjectId: number | null = null;
  projects: any[] = [];

  isLoadingProjects = true;
  isLoadingNotes = false;
  currentUserId: number | null = null;

  isEditing = false;
  editingNoteId: number | null = null;

  constructor(
    private noteService: NoteService,
    private affectationService: AffectationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.loadMyProjects();
  }

  get filteredNotes() {
    if (!this.searchTerm.trim()) return this.notes;
    return this.notes.filter(
      (note) =>
        note.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        note.userName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadMyProjects(): void {
    this.isLoadingProjects = true;
    this.affectationService.getMyAssignments().subscribe({
      next: (data) => {
        this.projects = data.map((a) => a.project);
        if (this.projects.length > 0 && !this.selectedProjectId) {
          this.selectProject(this.projects[0].id);
        }
        this.isLoadingProjects = false;
      },
      error: () => (this.isLoadingProjects = false),
    });
  }

  selectProject(id: number): void {
    this.cancelEdit();
    this.searchTerm = '';
    this.selectedProjectId = id;
    this.loadNotes();
  }

  loadNotes(): void {
    if (!this.selectedProjectId) return;
    this.isLoadingNotes = true;
    this.noteService.getNotesByProjectId(this.selectedProjectId).subscribe({
      next: (data) => {
        this.notes = data;
        this.isLoadingNotes = false;
      },
      error: () => (this.isLoadingNotes = false),
    });
  }

  saveNote(): void {
    if (!this.newNoteContent.trim() || !this.selectedProjectId) return;

    if (this.isEditing && this.editingNoteId) {
      this.noteService
        .updateNote(this.editingNoteId, { content: this.newNoteContent })
        .subscribe((res: Note) => {
          const index = this.notes.findIndex(
            (n) => n.id === this.editingNoteId
          );
          if (index !== -1) {
            // FIX: Replace the entire object to get the new timestamp from the backend
            this.notes[index] = res;
          }
          this.showToast('Note updated successfully!');
          this.cancelEdit();
        });
    } else {
      const noteData = {
        content: this.newNoteContent,
        project: { id: this.selectedProjectId },
      };
      this.noteService.addNote(noteData).subscribe((note) => {
        this.notes.unshift(note);
        this.newNoteContent = '';
        this.showToast('Note posted successfully!');
      });
    }
  }

  private showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  editNote(note: Note): void {
    this.isEditing = true;
    this.editingNoteId = note.id;
    this.newNoteContent = note.content;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingNoteId = null;
    this.newNoteContent = '';
  }

  deleteNote(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to permanently remove this note?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.noteService.deleteNote(id).subscribe(() => {
          this.notes = this.notes.filter((n) => n.id !== id);
          this.showToast('Note deleted.');
        });
      }
    });
  }
  // Add this getter to your component class
  get isProjectLocked(): boolean {
    const selectedProject = this.projects.find(
      (p) => p.id === this.selectedProjectId
    );
    if (!selectedProject) return false;

    // Define your locked statuses here
    const lockedStatuses = ['ON_HOLD', 'FINISHED', 'COMPLETED'];
    return lockedStatuses.includes(selectedProject.status);
  }
}
