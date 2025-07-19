import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response) => {
          this.message = response.message;
        },
        error: (error) => {
          this.message = error.error.message;
        }
      });
    }
  }
}
