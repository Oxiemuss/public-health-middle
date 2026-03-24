import { HttpClient } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ReferCase } from '../interface/refer.model';

@Injectable({ providedIn: 'root', })
export class Refer {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  
  sendReferData(payload : any): Observable<any>{
    return this.http.post(`${this.API_URL}/refer/add`,payload);
  }

  getAllReferData(): Observable<ReferCase[]>{
    return this.http.get<ReferCase[]>(`${this.API_URL}/refer/list`);
  }
}
