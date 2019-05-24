import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  goToGamePage = (username: string) => {
    this.router.navigateByUrl(`/game?username=${username}`);
  }
}
