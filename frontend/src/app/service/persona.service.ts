import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Persona } from '../interface/core/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/core/persona/`);
  }

  getPersona(): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/core/persona/`);
  }


}
