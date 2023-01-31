import { Component } from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../app.component.css','../static/bootstrap.min.css']
})
export class HeaderComponent {

  form_independencia:string = "assets/form-independencia.png";
  logo_ic:string = "assets/logo-ic.png";
  logo_m:string = "assets/logo-m.png";

}
