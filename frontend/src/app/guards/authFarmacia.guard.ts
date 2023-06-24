import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthFarmaciaGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

  async canActivate(): Promise<boolean> {
    const flag = await this.authService.isAuthenticated();
    const flag2 = await this.authService.isFarmacia();
    // const flag2 = true
    if (flag == true && flag2 == true) {
      // console.log(this.authService.isAuthenticated())
      // console.log('permiti el paso ')
      return true;
    }  else if (flag == true && flag2 == false) {
      this.openSnackBar();
      // console.log('negado')
      return false;
    } else {
      this.router.navigate(['/login']);
      return false
    }
  }

  openSnackBar() {

    this._snackBar.open('Error: Usted no tiene los permisos para ingresar. Consulte a Soporte Tencnico', 'Aceptar');
  }
}
