import { Component, OnInit } from '@angular/core';
import { User } from './interface/user';
import { UsersService } from './service/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  private user: User = {
    'id': 3,
    'password': 'prueba',
    'username': 'Esoeratodo',
  }

  constructor(private userService: UsersService) { }

  ngOnInit(): void {

  }

  onGetUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => console.table(response),
      (error: any) => console.log(error),
    )
  }

  onGetUser(): void {
    this.userService.getUser().subscribe(
      (response) => console.table(response),
      (error: any) => console.log(error),
    )
  }

  onCreateUser(): void {
    this.userService.createUser(this.user).subscribe(
      (response) => console.log(response),
      (error: any) => console.log(error),
    )
  }

  onUnpdateUser(): void {
    this.userService.updateUser(this.user).subscribe(
      (response) => console.log(response),
      (error: any) => console.log(error),
    )
  }

  onDeleteUser(): void {
    this.userService.deleteUser(4).subscribe(
      (response) => console.log(response),
      (error: any) => console.log(error),
    )
  }

}
