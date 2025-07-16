import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParentalControlService } from '../../services/parental-control.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parental-dashboard',
  templateUrl: './parental-dashboard.html',
  styleUrls: ['./parental-dashboard.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ParentalDashboardComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private parentalControlService: ParentalControlService
  ) {
    this.settingsForm = this.fb.group({
      contentAccess: [''],
    });
  }

  ngOnInit(): void {
    this.parentalControlService.getSettings().subscribe({
      next: (settings) => {
        this.settingsForm.patchValue(settings);
      },
      error: (error) => {
        console.error('Failed to get settings', error);
      }
    });
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      this.parentalControlService.updateSettings(this.settingsForm.value).subscribe({
        next: (response) => {
          console.log('Settings updated successfully', response);
        },
        error: (error) => {
          console.error('Failed to update settings', error);
        }
      });
    }
  }
}
