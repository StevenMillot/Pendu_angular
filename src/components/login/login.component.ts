import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login', // nom de markup
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { // à déclarer dans le app-module

  username = '';

  // Injection de dépendance
  constructor(private router: Router) {}

  ngOnInit() {}

  goToGamePage = (username: string) => {
    this.router.navigateByUrl(`/game?username=${username}`);
  }
}