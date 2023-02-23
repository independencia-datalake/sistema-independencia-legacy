import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Correo } from '../interface/core/correo';
import { Persona } from '../interface/core/persona';
import { PersonaInfoSalud } from '../interface/core/personainfosalud';
import { Telefono } from '../interface/core/telefono';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  apiUrl = environment.apiURL;
  id_persona = 1;

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/core/persona/`);
  }

  getPersona(id_persona): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/core/persona/${id_persona}`);
  }

  // test dani

  getTelefono(id_persona): Observable<Telefono> {
    return this.http.get<Telefono>(`${this.apiUrl}/core/telefono/${id_persona}`);
  }

  getCorreo(id_persona): Observable<Correo> {
    return this.http.get<Correo>(`${this.apiUrl}/core/correo/${id_persona}`);
  }

  getPersonaInfoSalud(id_persona): Observable<PersonaInfoSalud> {
    return this.http.get<PersonaInfoSalud>(`${this.apiUrl}/core/personainfosalud/${id_persona}`);
  }
}
