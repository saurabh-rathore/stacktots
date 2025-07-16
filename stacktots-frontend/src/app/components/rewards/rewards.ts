import { Component, OnInit } from '@angular/core';
import { RewardsService } from '../../services/rewards.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.html',
  styleUrls: ['./rewards.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RewardsComponent implements OnInit {
  rewards: any[] = [];
  points = 0;

  constructor(private rewardsService: RewardsService) { }

  ngOnInit(): void {
    this.loadRewards();
    this.loadPoints();
  }

  loadRewards(): void {
    this.rewardsService.getRewards().subscribe({
      next: (response) => {
        this.rewards = response;
      },
      error: (error) => {
        console.error('Failed to get rewards', error);
      }
    });
  }

  loadPoints(): void {
    this.rewardsService.getPoints().subscribe({
      next: (response) => {
        this.points = response.points;
      },
      error: (error) => {
        console.error('Failed to get points', error);
      }
    });
  }

  redeemReward(id: number): void {
    this.rewardsService.redeemReward(id).subscribe({
      next: () => {
        this.loadPoints();
      },
      error: (error) => {
        console.error('Failed to redeem reward', error);
      }
    });
  }
}
