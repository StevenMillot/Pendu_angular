import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

/**
 * Composant modal permettant d'afficher un message à l'utilisateur.
 * @class CardComponent
 * @Input character -> props du caractère à afficher dans le template du composant, au dos de notre "carte".
 * @Input state -> props d'état, définit si la caractère est a dévoiler, ou non.
 */
export class CardComponent {

  @Input() character: string;
  @Input() state: boolean;

  constructor() {}
}
