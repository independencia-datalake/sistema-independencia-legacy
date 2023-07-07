import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  usuarioActual: string;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userAuthStatus.subscribe(status => {
      if (status === false) {
        if (!!localStorage.getItem('username')){
          this.usuarioActual = localStorage.getItem('username');
        }
        else{
          this.usuarioActual = 'ninguno'
        }
      }
    });
  }

  async logInClick() {
    // const flag_usuario = await this.authService.isAuthenticated();
    // if (flag_usuario === true) {
    //   this.openSnackBar()
    // } else {
    //   this.router.navigate(['login'])
    // }
    if(localStorage.getItem('token')) {
      const flag_usuario = await this.authService.isAuthenticated();
        if (flag_usuario === true) {
          this.openSnackBar()
      } else {
        this.router.navigate(['login'])
      }
    } else {
      this.router.navigate(['login'])
    }

  }

  onButtonClick(): void {

    this.authService.logOut();
  }

  openSnackBar() {
    this._snackBar.open('Error: Ya esta Logueado. Si desea cambiar de usuario, desconéctese primero', 'Aceptar');
  }

  isVisRouteActive(): boolean {
    return this.router.isActive('/vis', false);
  }
}
