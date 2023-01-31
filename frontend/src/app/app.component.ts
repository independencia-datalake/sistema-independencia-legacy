import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./static/bootstrap.min.css' ]
})
export class AppComponent {
  title = 'frontend';
  form_independencia:string = "assets/form-independencia.png";
  logo_ic:string = "assets/logo-ic.png";
  logo_m:string = "assets/logo-m.png";

  status:boolean=false;
  onDesplegable() {
    this.status = !this.status;
  }


}
