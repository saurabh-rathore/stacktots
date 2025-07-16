import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { TtsService } from '../../services/tts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  stories: any[] = [];
  games: any[] = [];
  videos: any[] = [];

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
