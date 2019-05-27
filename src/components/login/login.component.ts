import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Composant login permettant de récupérer le pseudo de l'utilisateur.
 * @class LoginComponent
 * @implements {OnInit} -> Permet un lancement personnalisé qui doit avoir lieu lors de l'initialisation du composant.
 */
export class LoginComponent {

  username = '';

  /**
   * Crée une instance de la class LoginComponent.
   * @param {Router} router -> Injection de la dépendance de gestion des routes permet notament de naviguer d'une vue à l'autre.
   * @memberof LoginComponent
   */
  constructor(private router: Router) {}

  /**
   * Permet de rediriger l'app vers la page du jeu
   * @param  {string} username -> pseudo de l'utilsateur ajouté en paramètre à l'URL
   * @returns Promise
   */
  goToGamePage = (username: string): Promise<boolean> => {
    return this.router.navigateByUrl(`/game?username=${username}`);
  }
}
