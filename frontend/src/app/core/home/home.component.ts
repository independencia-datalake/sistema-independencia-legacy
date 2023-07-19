import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private authService: AuthService) {
  }

  isAdmin:any;

  getIsDeveloper() {
    return this.authService.isDeveloper();
  }

  ngOnInit(): void {
    // this.authService.isAuthenticated()
    this.getIsDeveloper().then(data => this.isAdmin = data);
    if(localStorage.getItem('token')) {
      this.authService.isAuthenticated()
    }
  }

}