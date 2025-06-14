import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    const user = this.storageService.getSession('user'); // o 'token' si usas token


    if (!user) {
      this.router.navigate(['/login']);
    }
  }
}