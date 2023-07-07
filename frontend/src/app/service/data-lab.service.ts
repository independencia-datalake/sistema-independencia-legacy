import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataLabService {
  apiUrl = environment.apiURL;
  constructor( private http: HttpClient ) { }

// VIS

getTransitoDataLabByUV(uv): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/transitoUV/${uv}/`);
}

}
