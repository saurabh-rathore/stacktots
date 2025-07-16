import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentalControlService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/parental-controls`);
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/parental-controls`, settings);
  }
}
