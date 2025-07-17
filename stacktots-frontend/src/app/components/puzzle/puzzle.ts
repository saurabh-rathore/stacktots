import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.html',
  styleUrls: ['./puzzle.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PuzzleComponent implements OnInit {
  puzzle: any;

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contentService.getContent().subscribe({
        next: (response) => {
          this.puzzle = response.find((item: any) => item.id === +id);
        },
        error: (error) => {
          console.error('Failed to get content', error);
        }
      });
    }
  }
}
