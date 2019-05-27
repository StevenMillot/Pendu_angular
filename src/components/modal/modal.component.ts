import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

/**
 * Composant modal permettant d'afficher un message à l'utilisateur.
 * @class ModalComponent
 * @Input message -> props de message, à afficher dans le template du composant
 */
export class ModalComponent {

  @Input() message: string;

  constructor() {}
}
