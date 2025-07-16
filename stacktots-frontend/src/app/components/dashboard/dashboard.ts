import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  content: any[] = [];

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contentService.getContent().subscribe({
      next: (response) => {
        this.content = response;
      },
      error: (error) => {
        console.error('Failed to get content', error);
      }
    });
  }
}
