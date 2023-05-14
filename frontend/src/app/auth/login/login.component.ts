import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { UsersService } from 'src/app/service/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  isLoading = false;

  usuario: string;
  contraseña: string;

  constructor( private usersService: UsersService, private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {

  }

  onLogin(form: NgForm) {
    console.log(form.value)
    // this.usuario = form.value.username
    // this.contraseña = form.value.password
    // this.usuario = 'daniel-datalake'
    // this.contraseña = 'danipa55re'

    // this.authService.login(this.usuario, this.contraseña).subscribe(
      this.authService.login(form.value.usuario, form.value.password).subscribe(
      (response) => {
        // Maneja la respuesta de la API de Django
        const token = response.token;
        const access_token = response.access
        console.log(response.id)
        this.authService.setToken(token);

        // console.log('Token guardado:', token);
        // localStorage.setItem('token', token);
        localStorage.setItem('token', access_token);
        // console.log(this.authService.getUser(access_token))
        localStorage.setItem('username', response.username)
        this.router.navigate(['/'])
        .then(() => {
          window.location.reload();
        });
      },
      (error) => {
        // Maneja el error de la solicitud HTTP
        console.log(error)
        this.openSnackBar();
      }
    );

  }

  getUser(usuario): void {
    this.usersService.getUser2(usuario).subscribe(response => {
      console.log(response)
    })
  }

  onSubmit() {
    this.authService.login(this.usuario, this.contraseña).subscribe(
      (response) => {
        // Maneja la respuesta de la API de Django
        this.authService.setToken(response.token);
        console.log('Token:', response.token);
        console.log('pog')
      },
      (error) => {
        // Maneja el error de la solicitud HTTP
        this.openSnackBar()
        console.log(error)
      }
    );
  }

  openSnackBar() {
    this._snackBar.open('Error: Ingrese un usuario valido o revise su constraseña');
  }

}
