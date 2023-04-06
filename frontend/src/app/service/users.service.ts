import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = environment.apiURL

  constructor(private http: HttpClient) {  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/`);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/2/`);
  }

  getUser2(user: User): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${user.id}/`);
  }

  getUserByid(id): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}/`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${user.id}/update/`, user)
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/delete/${id}/`)
  }

}
