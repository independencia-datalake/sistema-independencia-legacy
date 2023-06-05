import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { LicenciaConducir } from '../interface/mapa_legacy/licencia-conducir';
import { DOM } from '../interface/mapa_legacy/DOM';
import { Empresas } from '../interface/mapa_legacy/empresas';

@Injectable({
  providedIn: 'root'
})
export class MapaLegacyService {
  apiUrl = environment.apiURL;
  constructor( private http: HttpClient ) { }


  // EMPRESAS
  getEmpresasByUV(fecha_inicio, fecha_fin): Observable<Empresas> {
    return this.http.get<Empresas>(`${this.apiUrl}/mapa_legacy/empresas-total/${fecha_inicio}/${fecha_fin}/`);
  }

  // LICENCIA DE CONDUCIR
  getTransitoByUV(fecha_inicio, fecha_fin): Observable<LicenciaConducir> {
    return this.http.get<LicenciaConducir>(`${this.apiUrl}/mapa_legacy/transito-total/${fecha_inicio}/${fecha_fin}/`);
  }

  // DOM OBRAS MUNICIPALES
  getObrasMunicipalesTotalByUV(): Observable<DOM> {
    return this.http.get<DOM>(`${this.apiUrl}/mapa_legacy/DOM-total/`);
  }

  // RANGO FECHAS
  getRangoFechasGeneralByTipo(mapa, tipo): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mapa_legacy/rango-fechas/${mapa}/${tipo}`);
  }
}
