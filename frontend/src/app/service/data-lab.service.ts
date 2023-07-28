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
getFarmaciaDataLabList():Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/farmacia/`);
}

getFarmaciaDataLabByUV(uv): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/farmaciaUV/${uv}/`);
}

getEmpresasDataLabList(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/empresas/`);
}

getEmpresasDataLabByUV(uv): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/empresasUV/${uv}/`);
}

getDOMDataLabList(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/DOM/`);
}

getDOMDataLabByUV(uv): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/DOMUV/${uv}/`);
}

getTransitoDataLabList(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/transito/`);
}

getTransitoDataLabByUV(uv): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/data_lab/transitoUV/${uv}/`);
}

}
