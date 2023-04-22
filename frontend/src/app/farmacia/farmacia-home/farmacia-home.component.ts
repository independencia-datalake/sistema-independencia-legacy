import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-farmacia-home',
  templateUrl: './farmacia-home.component.html',
  styleUrls: ['./farmacia-home.component.css']
})
export class FarmaciaHomeComponent {

constructor(private router: Router) {

}

goToVenta(): void {
  this.router.navigate(['persona'], {queryParams: {redireccion: 'farmacia'}})
}

}
