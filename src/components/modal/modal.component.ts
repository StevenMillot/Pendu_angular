import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  // récupère la props passer par le parent
  @Input() modalText = new BehaviorSubject('');

  constructor() {}

  ngOnInit() {
  }



}
