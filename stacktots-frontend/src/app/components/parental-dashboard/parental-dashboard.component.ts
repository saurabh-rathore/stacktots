import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ParentalControlService } from '../../services/parental-control.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parental-dashboard',
  templateUrl: './parental-dashboard.component.html',
  styleUrls: ['./parental-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ParentalDashboardComponent implements OnInit {
  settingsForm: FormGroup;
  contentTypes = ['story', 'game', 'video'];

  constructor(
    private fb: FormBuilder,
    private parentalControlService: ParentalControlService
  ) {
    this.settingsForm = this.fb.group({
      allowedContentTypes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.parentalControlService.getSettings().subscribe({
      next: (settings) => {
        if (settings && settings.content_access) {
          const allowedTypes = settings.content_access.split(',');
          const formArray = this.settingsForm.get('allowedContentTypes') as FormArray;
          this.contentTypes.forEach(type => {
            formArray.push(new FormControl(allowedTypes.includes(type)));
          });
        } else {
          const formArray = this.settingsForm.get('allowedContentTypes') as FormArray;
          this.contentTypes.forEach(() => {
            formArray.push(new FormControl(true));
          });
        }
      },
      error: (error) => {
        console.error('Failed to get settings', error);
      }
    });
  }

  get allowedContentTypes(): FormArray {
    return this.settingsForm.get('allowedContentTypes') as FormArray;
  }

  onSubmit() {
    const selectedContentTypes = this.settingsForm.value.allowedContentTypes
      .map((checked: boolean, i: number) => checked ? this.contentTypes[i] : null)
      .filter((value: string | null) => value !== null);

    this.parentalControlService.updateSettings({ content_access: selectedContentTypes.join(',') }).subscribe({
      next: (response) => {
        console.log('Settings updated successfully', response);
      },
      error: (error) => {
        console.error('Failed to update settings', error);
      }
    });
  }
}
