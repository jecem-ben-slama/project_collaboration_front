import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../shared/models/project_model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      status: [this.data?.status || 'IN_PROGRESS', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    if (this.isEditMode && this.data.id) {
      this.projectService
        .updateProject(this.data.id, this.projectForm.value)
        .subscribe({
          next: () => this.dialogRef.close(true),
        });
    } else {
      this.projectService.createProject(this.projectForm.value).subscribe({
        next: () => this.dialogRef.close(true),
      });
    }
  }
}
