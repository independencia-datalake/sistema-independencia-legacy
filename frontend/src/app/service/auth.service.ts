import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CdkAccordion } from '@angular/cdk/accordion';

@Injectable({
  providedIn: 'root'


})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/users/login/';
  // private apiUrl = 'http://127.0.0.1:8000/api/auth/login/'
  private token: string;
  public usuarioActual: string; // Nueva propiedad para el nombre de usuario
  public usuarioActual$: Subject<string> = new Subject<string>();

  decodedToken: { [key: string]: string };

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      // 'X-CSRFToken': this.csrfToken,

    });
    const body = {username, password};
    // return this.http.post<any>(this.apiUrl, body, {  headers });

    return this.http.post<any>(this.apiUrl, body, {  withCredentials: true, headers });

  }

  setToken(token: string) {
    // this.token = token;
    localStorage.setItem('token', token)
    // this.token = 'ccef7da0a6c023787fe4ada4f7c861c49c02d9be'
    this.token = token
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  logOut() {
    const token_storage = localStorage.getItem('token');
    if (token_storage){
      localStorage.removeItem('token');
      localStorage.removeItem('username')
      this.router.navigate(['/'])
      .then(() => {
        window.location.reload();
      });
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token_check = localStorage.getItem('token');
    const user_exist = await this.checkUserProfile(token_check)

    // Validacion feacha vencimiento token
    const exp_date = this.getExpirationDate(token_check)
    const ahora = new Date().getTime(); // Obtiene la fecha actual en formato epoch
    const fechaExpiracion = new Date(exp_date).getTime(); // convierte la fecha de expiración a formato epoch
    if (fechaExpiracion > ahora) {
      // console.log('El token ha expirado'); // el token ha expirado
      return false
    } else {
      // console.log('El token aun no expira'); // el token es válido
    }

    // console.log(exp_date)
    if (user_exist) {
      // console.log('El usuario existe');
      return true
    } else {
      // console.log('El usuario no existe');
      return false
    }

  }
  async isFarmacia(): Promise<boolean> {
    const token_check = localStorage.getItem('token');
    const grupos = this.getGrupos(token_check)
    // console.log(grupos)
    try {
      if (grupos.includes('Farmacia-Farmaceuta') || grupos.includes('Farmacia-Vendedor') ) {
        // console.log('grupo aceptado')
        return true
      } else {
        // console.log('grupo no encontrado')
        return false
      }
    } catch (error) {
      return false
    }
  }

  // FUNCIONES DEL TOKEN Y DECODE
  decodeToken(access_token) {
    if (access_token) {
    this.decodedToken = jwt_decode(access_token);
    }
  }
  getDecodeToken(access_token) {
    return jwt_decode(access_token);
  }
  getUser(access_token) {
    this.decodeToken(access_token);
    // console.log(this.decodedToken)
    return this.decodedToken ? this.decodedToken['username'] : null;
  }
  getUserId(access_token) {
    this.decodeToken(access_token);
    return this.decodedToken ? this.decodedToken['user_id'] : null;
  }
  getExpirationDate(access_token) {
    this.decodeToken(access_token);
    return this.decodedToken ? this.decodedToken['exp'] : null
  }
  getGrupos(access_token){
    this.decodeToken(access_token);
    return this.decodedToken ? this.decodedToken['groups'] : null;
  }
  getUserProfile(access_token): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${access_token}`);
    return this.http.get<any>(`http://localhost:8000/api/users/profile/`, { headers: headers});
  }
  async checkUserProfile(access_token: string): Promise<boolean> {
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${access_token}`);
      const response = await this.http.get<any>('http://localhost:8000/api/users/profile/', { headers }).toPromise();
      return !!response.id; // Devuelve true si existe un ID en la respuesta
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}
