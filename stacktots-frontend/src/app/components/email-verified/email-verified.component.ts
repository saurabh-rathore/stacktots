import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EmailVerifiedComponent implements OnInit {
  message = 'Verifying your email...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (response) => {
          this.message = response.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.message = error.error.message;
        }
      });
    } else {
      this.message = 'Invalid verification link.';
    }
  }
}
