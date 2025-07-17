import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class QuizComponent implements OnInit {
  quiz: any;
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  quizFinished = false;

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contentService.getContent().subscribe({
        next: (response) => {
          this.quiz = response.find((item: any) => item.id === +id);
        },
        error: (error) => {
          console.error('Failed to get content', error);
        }
      });
    }
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
  }

  nextQuestion(): void {
    if (this.selectedAnswer === this.quiz.data.questions[this.currentQuestionIndex].answer) {
      this.score++;
    }
    this.selectedAnswer = null;
    if (this.currentQuestionIndex < this.quiz.data.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.quizFinished = true;
    }
  }
}
