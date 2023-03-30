import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const flag = await this.authService.isAuthenticated()
    if (flag == true) {
      // console.log(this.authService.isAuthenticated())
      // console.log('permiti el paso ')
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
