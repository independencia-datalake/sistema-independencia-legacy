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

// ASOCIADO A EMPRESAS POR FECHA
  getEmpresasTotalByUvFecha(fecha_inicio, fecha_fin): Observable<Empresas> {
    return this.http.get<Empresas>(`${this.apiUrl}/mapa_legacy/empresas-total-fecha/${fecha_inicio}/${fecha_fin}`);
  }

  getEmpresasByUvFechaTipo(fecha_inicio, fecha_fin, tipo): Observable<Empresas> {
    return this.http.get<Empresas>(`${this.apiUrl}/mapa_legacy/empresas-total-fecha/${fecha_inicio}/${fecha_fin}/${tipo}`);
  }

  getEmpresasTotalByUvFechaRank(fecha_inicio, fecha_fin): Observable<Empresas> {
    return this.http.get<Empresas>(`${this.apiUrl}/mapa_legacy/empresas-total-fecha-rank/${fecha_inicio}/${fecha_fin}`);
  }

  // RANGO FECHAS
  getRangoFechasByTipo(tipo): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mapa_legacy/rango-fechas/${tipo}`);
  }
}
