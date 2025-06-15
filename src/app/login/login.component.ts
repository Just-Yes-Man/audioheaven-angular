import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Credential } from '../models/user/Credentials';
import { Router } from '@angular/router';
import { Token } from '../models/user/Token';
import { StorageService } from "../services/storage.service";


@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})

export class LoginComponent {
   constructor(
      private userService: UserService,
      private storageService: StorageService,
      private router: Router
   ) { }

   username: String = "";
   password: String = "";
   myLogin = new Token();

   callLogin() {
      const myCredential = new Credential();
      myCredential.username = this.username;
      myCredential.password = this.password;

      this.userService.postLogin(myCredential).subscribe({
         next: (data: any) => {
            console.log('user logged: ', data);
            this.storageService.setSession("user", myCredential.username);
            this.storageService.setSession("token", data.accessToken);
            this.router.navigate(['/home']);
         },
         error: (errMsg) => {

            this.username = "";
            this.password = "";
         }
      });
   }
}
