import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private apiUrl = 'http://localhost:3000/api/content';
  private uploadUrl = 'http://localhost:3000/api/upload';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getContent(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createContent(content: any): Observable<any> {
    return this.http.post(this.apiUrl, content, { headers: this.getAuthHeaders() });
  }

  updateContent(id: number, content: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, content, { headers: this.getAuthHeaders() });
  }

  deleteContent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('contentFile', file);
    return this.http.post(this.uploadUrl, formData, { headers: this.getAuthHeaders() });
  }
}
