import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})


export class CardComponent implements OnInit {

  @Input() character: string;
  @Input() etat = new BehaviorSubject(false);

  constructor() { }

  ngOnInit() {
  }

}
