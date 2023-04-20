import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Correo } from '../interface/core/correo';
import { Persona } from '../interface/core/persona';
import { PersonaInfoSalud } from '../interface/core/personainfosalud';
import { Telefono } from '../interface/core/telefono';
import { Direccion } from '../interface/core/direccion';

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

  getDireccionByPersona(id_persona): Observable<Direccion> {
    return this.http.get<Direccion>(`${this.apiUrl}/core/direccion-by-persona/${id_persona}`);
  }

  getTelefono(id): Observable<Telefono> {
    return this.http.get<Telefono>(`${this.apiUrl}/core/telefono/${id}`);
  }

  getTelefonoByPersona(id_persona): Observable<Telefono> {
    return this.http.get<Telefono>(`${this.apiUrl}/core/telefono-by-persona/${id_persona}`);
  }

  getCorreo(id): Observable<Correo> {
    return this.http.get<Correo>(`${this.apiUrl}/core/correo/${id}`);
  }

  getCorreoByPersona(id_persona): Observable<Correo> {
    return this.http.get<Correo>(`${this.apiUrl}/core/correo-by-persona/${id_persona}`);
  }

  getPersonaInfoSalud(id): Observable<PersonaInfoSalud> {
    return this.http.get<PersonaInfoSalud>(`${this.apiUrl}/core/personainfosalud/${id}`);
  }

  getPersonaInfoSaludByPersona(id_persona): Observable<PersonaInfoSalud> {
    return this.http.get<PersonaInfoSalud>(`${this.apiUrl}/core/personainfosalud-by-persona/${id_persona}`);
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}/core/persona/`, persona)
  }

  createDireccion(direccion: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(`${this.apiUrl}/core/direccion/`, direccion)
  }

  createCorreo(correo: Correo): Observable<Correo> {
    return this.http.post<Correo>(`${this.apiUrl}/core/correo/`, correo)
  }

  createTelefono(telefono: Telefono): Observable<Telefono> {
    return this.http.post<Telefono>(`${this.apiUrl}/core/telefono/`, telefono)
  }

  createInfosalud(infosalud: PersonaInfoSalud): Observable<PersonaInfoSalud> {
    return this.http.post<PersonaInfoSalud>(`${this.apiUrl}/core/personainfosalud/`, infosalud)
  }
}
