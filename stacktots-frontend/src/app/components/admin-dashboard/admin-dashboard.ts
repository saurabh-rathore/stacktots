import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminDashboardComponent implements OnInit {
  content: any[] = [];
  contentForm: FormGroup;
  isEditing = false;
  currentContentId: number | null = null;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder
  ) {
    this.contentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.contentService.getContent().subscribe({
      next: (response) => {
        this.content = response;
      },
      error: (error) => {
        console.error('Failed to get content', error);
      }
    });
  }

  onSubmit(): void {
    if (this.contentForm.valid) {
      if (this.isEditing) {
        this.contentService.updateContent(this.currentContentId!, this.contentForm.value).subscribe({
          next: () => {
            this.loadContent();
            this.resetForm();
          },
          error: (error) => {
            console.error('Failed to update content', error);
          }
        });
      } else {
        this.contentService.createContent(this.contentForm.value).subscribe({
          next: () => {
            this.loadContent();
            this.resetForm();
          },
          error: (error) => {
            console.error('Failed to create content', error);
          }
        });
      }
    }
  }

  editContent(content: any): void {
    this.isEditing = true;
    this.currentContentId = content.id;
    this.contentForm.patchValue(content);
  }

  deleteContent(id: number): void {
    this.contentService.deleteContent(id).subscribe({
      next: () => {
        this.loadContent();
      },
      error: (error) => {
        console.error('Failed to delete content', error);
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentContentId = null;
    this.contentForm.reset();
  }
}
