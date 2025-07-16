import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private apiUrl = 'http://localhost:3000/api/subscriptions';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}/plans`, { headers: this.getAuthHeaders() });
  }

  createSubscription(planId: number, paymentMethodId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, { planId, paymentMethodId }, { headers: this.getAuthHeaders() });
  }
}
