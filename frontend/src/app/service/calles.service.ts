import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CallesIndependencia } from '../interface/core/callesindependencia';

@Injectable({
  providedIn: 'root'
})
export class CallesService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  getCalles() {
    return this.http.get(`${this.apiUrl}/core/callesindependencia/`)
      .pipe(map((response:[]) => response.map(item => item['calle'])));
  }

}
