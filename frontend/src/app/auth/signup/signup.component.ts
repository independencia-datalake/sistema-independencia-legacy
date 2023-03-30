import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { response } from 'express';
import { UsersService } from 'src/app/service/users.service';



interface usuario {
  password: string;
  username: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SignupComponent {
  isLoading = false;

  usuario: usuario;


  constructor( private usersService: UsersService) {

  }

  onSignup(form: NgForm) {

    this.usuario = {
      "password": form.value.password,
      "username": form.value.usuario
    }

    this.createUser(this.usuario)
    // this.deteleUser(5)
  }

  createUser(usuario): void {
    this.usersService.createUser(usuario).subscribe(response => {
      console.log(response)
    })
  }

  deteleUser(usuario): void {
    this.usersService.deleteUser(usuario).subscribe(response =>{
      console.log(response)
    })
  }

}
