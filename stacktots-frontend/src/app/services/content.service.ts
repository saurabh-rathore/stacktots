import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getContent(): Observable<any> {
    return this.http.get(`${this.apiUrl}/content`);
  }
}
