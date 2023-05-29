import { Component, OnInit } from '@angular/core';
import { User } from './interface/user';
import { UsersService } from './service/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  private user: User = {
    'id': 3,
    'password': 'prueba',
    'username': 'Esoeratodo',
  }

  constructor(private userService: UsersService) {}

  ngOnInit(): void {

  }

  onGetUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => console.table(response),
      (error: any) => console.log(error),
      () => console.log('Done Users')
    )
  }

  onGetUser(): void {
    this.userService.getUser().subscribe(
      (response) => console.table(response),
      (error: any) => console.log(error),
      () => console.log('Done User')
    )
  }

  onCreateUser(): void {
    this.userService.createUser(this.user).subscribe(
      (response) => console.log(response),
      (error: any) => console.log(error),
      () => console.log('Done create user')
    )
  }

  onUnpdateUser(): void {
    this.userService.updateUser(this.user).subscribe(
      (response) => console.log(response),
      (error: any) => console.log(error),
      () => console.log('Done update user')
    )
  }

  onDeleteUser(): void {
    this.userService.deleteUser(4).subscribe(
      (response) => console.log(response),
      (error: any) => console.log(error),
      () => console.log('Delete User')
    )
  }

}
