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

   constructor(private userService: UserService,
      private storageService: StorageService,
      private router: Router
   ) { }

   email: String = "adsoft@live.com.mx";
   password: String = "123";
   myLogin = new Token();

   callLogin() {
      const myCredential = new Credential();
      myCredential.email = this.email;
      myCredential.password = this.password;

      this.userService.postLogin(myCredential).subscribe({
         next: (data: any) => {
            console.log('user logged: ', data);
            this.storageService.setSession("user", myCredential.email);
            this.storageService.setSession("token", data.accessToken);
            this.router.navigate(['/home']);
         },
         error: (errMsg) => {
            // errMsg ya es el mensaje extraído por handleError
            alert(errMsg);
            this.email = "";
            this.password = "";
         }
      });
   }
}