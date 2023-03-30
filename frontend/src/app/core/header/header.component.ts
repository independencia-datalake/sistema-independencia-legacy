import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  usuarioActual: string;

  constructor(private authService: AuthService) { }

  // ngOnInit(): void {
  //   this.authService.usuarioActual$.subscribe((usuario) => {
  //     this.usuarioActual = usuario;
  //   });
  // }
  ngOnInit(): void {
    if (!!localStorage.getItem('username')){
      this.usuarioActual = localStorage.getItem('username');
    }
    else{
      this.usuarioActual = 'ninguno'
    }
  }

  onButtonClick(): void {

    this.authService.logOut();
  }

}
