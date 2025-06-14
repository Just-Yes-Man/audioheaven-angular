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

   username: String = "adsoft"; // <- Aquí
   password: String = "123";
   myLogin = new Token();

   callLogin() {
      const myCredential = new Credential();
      myCredential.username = this.username; // <- Aquí
      myCredential.password = this.password;

      this.userService.postLogin(myCredential).subscribe({
         next: (data: any) => {
            console.log('user logged: ', data);
            this.storageService.setSession("user", myCredential.username); // <- Aquí también
            this.storageService.setSession("token", data.accessToken);
            this.router.navigate(['/home']);
         },
         error: (errMsg) => {
            alert(errMsg);
            this.username = "";
            this.password = "";
         }
      });
   }
}
