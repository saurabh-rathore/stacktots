import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { TtsService } from '../../services/tts.service';
import { CommonModule } from '@angular/common';
import { fadeInAnimation } from '../../animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [fadeInAnimation]
})
export class DashboardComponent implements OnInit {
  stories: any[] = [];
  games: any[] = [];
  videos: any[] = [];
  quizzes: any[] = [];
  puzzles: any[] = [];
  cartoons: any[] = [];

  constructor(
    private contentService: ContentService,
    private ttsService: TtsService
  ) { }

  ngOnInit(): void {
    this.contentService.getContent().subscribe({
      next: (response) => {
        this.stories = response.filter((item: any) => item.type === 'story');
        this.games = response.filter((item: any) => item.type === 'game');
        this.videos = response.filter((item: any) => item.type === 'video');
        this.quizzes = response.filter((item: any) => item.type === 'quiz');
        this.puzzles = response.filter((item: any) => item.type === 'puzzle');
        this.cartoons = response.filter((item: any) => item.type === 'cartoon');
      },
      error: (error) => {
        console.error('Failed to get content', error);
      }
    });
  }

  listen(id: number): void {
    this.ttsService.getAudio(id).subscribe({
      next: (response) => {
        const audio = new Audio(URL.createObjectURL(response));
        audio.play();
      },
      error: (error) => {
        console.error('Failed to get audio', error);
      }
    });
  }
}
