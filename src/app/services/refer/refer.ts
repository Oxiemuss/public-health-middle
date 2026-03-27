import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { ReferCase } from '../interface/refer.model';

@Injectable({ providedIn: 'root' })
export class Refer {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private referData = new BehaviorSubject<ReferCase[]>([]);

  sendReferData(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/refer/add`, payload);
  }

  getAllReferData(): Observable<ReferCase[]> {
    return this.http.get<ReferCase[]>(`${this.API_URL}/refer/list`).pipe(
      tap((data) => {
        this.referData.next(data);
      }),
    );
  }

  updateReferStatus(payload: { rid: number; status: string }) {
    return this.http.post(`${this.API_URL}/refer/update`, payload);
  }

  getAllHisData(): Observable<ReferCase[]> {
    return this.http.get<ReferCase[]>(`${this.API_URL}/refer/his`).pipe(
      tap((data) => {
        this.referData.next(data);
      }),
    );
  }

  getCacheData(): ReferCase[] {
    return this.referData.getValue();
  }
}
