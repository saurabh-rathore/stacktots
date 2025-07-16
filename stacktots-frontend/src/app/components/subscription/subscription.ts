import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { CommonModule } from '@angular/common';

declare var stripe: any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.html',
  styleUrls: ['./subscription.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SubscriptionComponent implements OnInit, AfterViewInit {
  plans: any[] = [];
  selectedPlan: any = null;

  @ViewChild('cardElement') cardElement!: ElementRef;

  stripe: any;
  card: any;

  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
    this.subscriptionService.getPlans().subscribe({
      next: (response) => {
        this.plans = response;
      },
      error: (error) => {
        console.error('Failed to get plans', error);
      }
    });
  }

  ngAfterViewInit(): void {
    this.stripe = stripe('pk_test_YOUR_STRIPE_PUBLIC_KEY');
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
  }

  selectPlan(plan: any): void {
    this.selectedPlan = plan;
  }

  async subscribe(): Promise<void> {
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
    });

    if (error) {
      console.error(error);
    } else {
      this.subscriptionService.createSubscription(this.selectedPlan.id, paymentMethod.id).subscribe({
        next: (response) => {
          console.log('Subscription successful', response);
        },
        error: (error) => {
          console.error('Subscription failed', error);
        }
      });
    }
  }
}
