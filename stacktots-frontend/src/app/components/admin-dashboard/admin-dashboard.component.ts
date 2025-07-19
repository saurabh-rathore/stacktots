import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminDashboardComponent implements OnInit {
  content: any[] = [];
  contentForm: FormGroup;
  isEditing = false;
  currentContentId: number | null = null;
  selectedFile: File | null = null;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder
  ) {
    this.contentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: ['', Validators.required]
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.contentForm.valid) {
      if (this.selectedFile) {
        this.contentService.uploadFile(this.selectedFile).subscribe({
          next: (response) => {
            const contentData = { ...this.contentForm.value, filePath: response.filePath };
            this.saveContent(contentData);
          },
          error: (error) => {
            console.error('Failed to upload file', error);
          }
        });
      } else {
        this.saveContent(this.contentForm.value);
      }
    }
  }

  saveContent(contentData: any): void {
    if (this.isEditing) {
      this.contentService.updateContent(this.currentContentId!, contentData).subscribe({
        next: () => {
          this.loadContent();
          this.resetForm();
        },
        error: (error) => {
          console.error('Failed to update content', error);
        }
      });
    } else {
      this.contentService.createContent(contentData).subscribe({
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
    this.selectedFile = null;
    this.contentForm.reset();
  }
}
