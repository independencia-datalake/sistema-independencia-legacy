import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { Empresas } from '../interface/mapa_legacy/empresas';

@Injectable({
  providedIn: 'root'
})
export class EmpresasServiceService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }


  // ASOCIADO A EMPRESAS
  getEmpresasTotalByUV(): Observable<Empresas> {
    return this.http.get<Empresas>(`${this.apiUrl}/mapa_legacy/empresas-total/`);
  }
  getEmpresasComercialByUV(): Observable<Empresas> {
    return this.http.get<Empresas>(`${this.apiUrl}/mapa_legacy/empresas-comercial/`);
}

}
