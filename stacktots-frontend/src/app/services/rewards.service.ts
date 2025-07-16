import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {

  private apiUrl = 'http://localhost:3000/api/rewards';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getRewards(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getPoints(): Observable<any> {
    return this.http.get(`${this.apiUrl}/points`, { headers: this.getAuthHeaders() });
  }

  redeemReward(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/redeem/${id}`, {}, { headers: this.getAuthHeaders() });
  }
}
