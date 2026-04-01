import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { H_Center } from '../interface/h_center.model';

@Injectable({ providedIn: 'root' })
export class HCenter {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private H_CenterData = new BehaviorSubject<H_Center[]>([]);

  getAllHCenterData(): Observable<H_Center[]> {
    return this.http.get<H_Center[]>(`${this.API_URL}/healthcenter/list`).pipe(
      tap((data) => {
        this.H_CenterData.next(data);
      }),
    );
  }

  getCacheData(): H_Center[]{
    return this.H_CenterData.getValue();
  }
}
 