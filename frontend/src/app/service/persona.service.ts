import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  token = localStorage.getItem('token')
  headers = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers = this.headers.set('Authorization', `Bearer ${this.token}`);
   }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/core/persona/`, {headers: this.headers});
  }

  getPersonasLista(search = '',page: number, pageSize: number): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/core/persona-lista/?page=${page}&page_size=${pageSize}&search=${search}`, {headers: this.headers});
  }

  getPersona(id_persona): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/core/persona/${id_persona}`, {headers: this.headers});
  }

  // test dani

  getDireccionByPersona(id_persona): Observable<Direccion> {
    return this.http.get<Direccion>(`${this.apiUrl}/core/direccion-by-persona/${id_persona}`, {headers: this.headers});
  }

  getTelefono(id): Observable<Telefono> {
    return this.http.get<Telefono>(`${this.apiUrl}/core/telefono/${id}`, {headers: this.headers});
  }

  getTelefonoByPersona(id_persona): Observable<Telefono> {
    return this.http.get<Telefono>(`${this.apiUrl}/core/telefono-by-persona/${id_persona}`, {headers: this.headers});
  }

  getCorreo(id): Observable<Correo> {
    return this.http.get<Correo>(`${this.apiUrl}/core/correo/${id}`, {headers: this.headers});
  }

  getCorreoByPersona(id_persona): Observable<Correo> {
    return this.http.get<Correo>(`${this.apiUrl}/core/correo-by-persona/${id_persona}`, {headers: this.headers});
  }

  getPersonaInfoSalud(id): Observable<PersonaInfoSalud> {
    return this.http.get<PersonaInfoSalud>(`${this.apiUrl}/core/personainfosalud/${id}`, {headers: this.headers});
  }

  getPersonaInfoSaludByPersona(id_persona): Observable<PersonaInfoSalud> {
    return this.http.get<PersonaInfoSalud>(`${this.apiUrl}/core/personainfosalud-by-persona/${id_persona}`, {headers: this.headers});
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(`${this.apiUrl}/core/persona/`, persona, {headers: this.headers})
  }

  createDireccion(direccion: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(`${this.apiUrl}/core/direccion/`, direccion, {headers: this.headers})
  }

  createCorreo(correo: Correo): Observable<Correo> {
    return this.http.post<Correo>(`${this.apiUrl}/core/correo/`, correo, {headers: this.headers})
  }

  createTelefono(telefono: Telefono): Observable<Telefono> {
    return this.http.post<Telefono>(`${this.apiUrl}/core/telefono/`, telefono, {headers: this.headers})
  }

  createInfosalud(infosalud: PersonaInfoSalud): Observable<PersonaInfoSalud> {
    return this.http.post<PersonaInfoSalud>(`${this.apiUrl}/core/personainfosalud/`, infosalud, {headers: this.headers})
  }
}
