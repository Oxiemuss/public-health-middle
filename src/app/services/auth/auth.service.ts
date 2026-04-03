import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);
  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  login(credentail: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, credentail).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('AccessToken', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      }),
    );
  }

  getStorageData() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}
