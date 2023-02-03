import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiBaseRout = ''

  constructor(private http: HttpClient) {  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users`);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`https://jsonplaceholder.typicode.com/users/1`);
  }
}
