import { Component, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription} from 'rxjs';
import { BehaviorSubject } from 'rxjs';

// type positiveNumber = 0 | 1 | 2 | 3 | 10;

// Décorateur angular => attachent des types de métadonnées spécifiques à des classes
// de sorte que le système sache ce que ces classes signifient et comment elles devraient fonctionner.
@Component({
  selector: 'app-gamePage',
  templateUrl: './gamePage.component.html',
  styleUrls: ['./gamePage.component.scss']
})

export class GamePageComponent implements OnDestroy {
  NUMBER_OF_CHANCE = 10;
  SHORT_DISPLAY_DURATION = 3000;
  LONG_DISPLAY_DURATION = 5000;

  // Observable/Observeur => variable qui peux changer ds le temps.
  // reword subjectState
  subjectEtat = new BehaviorSubject(new Map<string, boolean>());
  messageState = new BehaviorSubject('');
  pluralTryState = new BehaviorSubject('s');

  tryRemaining = this.NUMBER_OF_CHANCE;
  currentGameWord: string;
  message: string;
  username: string;
  pluralTry: string;
  mapState = new Map<string, boolean>(); // find all référence ^^ c'est ca et t'a la meme chose pour les occurence
  routeSubscription: Subscription;
  secretWordsArray = ['javascript', 'php', 'java', 'ruby', 'sql', 'pyton', 'lorem'];
  canvasZone = document.getElementById('myCanvas');

  constructor(private activatedRoute: ActivatedRoute) {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.username = params.username;
    });
    this.currentGameWord = this.getRandomWord(this.secretWordsArray).toUpperCase();
    this.mapState = this.setHiddenDisplayForCharacters(this.currentGameWord);
    // .next => push (crée un commit)
    this.subjectEtat.next(this.setHiddenDisplayForCharacters(this.currentGameWord));

    // permet de sousrire a notre observable, le surveille et retourne les changements
    // a chaque changement de valeur (chaque nouveau .next), je stoque la valeur actuel dans mapState
    this.subjectEtat.subscribe((hashMap: Map<string, boolean>) => this.mapState = hashMap);
    this.messageState.subscribe((modalText: string) => this.message = modalText);
    this.pluralTryState.subscribe((text: string) => this.pluralTry = text);
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.subjectEtat.unsubscribe();
    this.messageState.unsubscribe();
  }

  getRandomWord = (wordsArray: string[]): string => {
    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
  }

  setHiddenDisplayForCharacters = (word: string): Map<string, boolean> => {
    const map = new Map<string, boolean>();
    // crée un tableau de chaque caractere
    word.split('').forEach((currentCharacter) => {
      map.set(currentCharacter, false);
    });
    return map;
  }

  setDisplayForOneCharacter = (character: string, map: Map<string, boolean>, value: boolean): Map<string, boolean> => {
    const newMapState = map;
    return newMapState.set(character, value);
  }

  isCharacterInMap = (character: string, map: Map<string, boolean>): boolean => {
    return map.get(character) === undefined ? false : true;
  }

  tryThisCharacter = (characterToTry: string, map: Map<string, boolean>): void => {
    return this.isCharacterInMap(characterToTry, map) ?
    this.luckyTry(characterToTry, map) : this.badTry();
  }

  luckyTry = (characterToTry: string, map: Map<string, boolean>): void => {
    this.setDisplayForOneCharacter(characterToTry, map, true);
    if (this.checkForEndOfGame(map)) {
      this.messageState.next('Cool, tu as gagné!  ==> Chargement d\'une nouvelle partie...');
      this.timeout(this.LONG_DISPLAY_DURATION, true);
    }
  }

    checkForEndOfGame = (map: Map<string, boolean>): boolean => {
      // construit un array des values de la map
      const arrayMapValue = Array.from(map.values());
      // construit un nouveau tableau avec uniquement les value a true
      const arrayTrueValue = arrayMapValue.filter((value: boolean) => value === true);

      return arrayTrueValue.length === arrayMapValue.length;
    }

  // not a pure function because we change a global variables
  badTry = (): void => {
    if (this.tryRemaining !== 0) {
      this.tryRemaining -= 1;
      // this.drawPendu(this.tryRemaining, this.canvasZone);
      this.modalInjector(this.tryRemaining);
    }
  }

  modalInjector = (chanceNumber: number): void => {
    switch (chanceNumber) {
      case 1:
        this.messageState.next('Erreur ==> Plus qu\'un essai !');
        this.timeout(this.LONG_DISPLAY_DURATION, false);
        this.setPluralTry();
        break;
      case 0:
        this.messageState.next('GameOver!  ==> Chargement d\'une nouvelle partie...');
        this.timeout(this.LONG_DISPLAY_DURATION, true);
        this.setPluralTry();
        break;
      default:
        this.messageState.next('Erreur');
        this.timeout(this.SHORT_DISPLAY_DURATION, false);
    }
  }

  setPluralTry = () => this.pluralTryState.next('');

  // timeout = (this.messageState) => setTimeout(this.messageState.next(''), 30000);
  timeout = async (durationOnMS: number, reloadGame: boolean) => {
    await this.delay(durationOnMS);
    this.messageState.next('');
    if (reloadGame) {
      this.resetGame();
    }
  }

  delay = (durationOnMS: number) => {
    return new Promise( resolve => setTimeout(resolve, durationOnMS) );
  }

  resetGame = () => {
    location.reload();
    // TODO real reset game
    /* const newWordsArray = this.secretWordsArray.filter((word) => word !== this.currentGameWord);
    this.getRandomWord(newWordsArray); */
  }

  /* drawPendu = (tryRemaining: number, canvasZone) => {
/*     var canvas = document.getElementById('myCanvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');

      ctx.fillStyle = "#D74022";
      ctx.fillRect(25, 25, 150, 150);

      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.clearRect(60, 60, 120, 120);
      ctx.strokeRect(90, 90, 80, 80);
    } */
    /* switch (tryRemaining) {
      case 10:
        canvasZone.beginPath(); // On démarre un nouveau tracé
        canvasZone.lineCap = 'round';
        canvasZone.lineWidth = "10";
        canvasZone.lineJoin = 'round';
        canvasZone.strokeStyle = "rgb(23, 145, 167)";
        canvasZone.moveTo(35, 295);
        canvasZone.lineTo(5, 295);
        canvasZone.stroke();
        break;
      case 9:
        canvasZone.moveTo(20, 295);
        canvasZone.lineTo(20, 5);
        canvasZone.stroke();
        break;
      case 8:
        canvasZone.lineTo(200, 5);
        canvasZone.stroke();
        break;
      case 7:
        canvasZone.lineTo(200, 50);
        canvasZone.stroke();
        break;
      case 6:
        canvasZone.moveTo(20, 50);
        canvasZone.lineTo(70, 5);
        canvasZone.stroke();
        break;
      case 5:
        canvasZone.beginPath();
        canvasZone.fillStyle = "red";
        canvasZone.arc(200, 50, 20, 0, Math.PI * 2);
        canvasZone.fill();
        break;
      case 4:
        canvasZone.beginPath();
        canvasZone.strokeStyle = "red";
        canvasZone.moveTo(200, 50);
        canvasZone.lineTo(200, 150);
        canvasZone.stroke();
        break;
      case 3:
        canvasZone.beginPath();
        canvasZone.moveTo(200, 80);
        canvasZone.lineTo(160, 110);
        canvasZone.stroke();
        break;
      case 2:
        canvasZone.beginPath();
        canvasZone.moveTo(200, 80);
        canvasZone.lineTo(240, 110);
        canvasZone.stroke();
        break;
      case 1:
        canvasZone.beginPath();
        canvasZone.moveTo(200, 150);
        canvasZone.lineTo(180, 200);
        canvasZone.stroke();
        break;
      case 0:
        canvasZone.beginPath();
        canvasZone.moveTo(200, 150);
        canvasZone.lineTo(220, 200);
        canvasZone.stroke();
        canvasZone.beginPath();
        canvasZone.fillStyle = "rgb(23, 145, 167)";
        canvasZone.arc(200, 62, 16, 0, Math.PI * 2);
        canvasZone.fill();
        canvasZone.beginPath();
        canvasZone.fillStyle = "red";
        canvasZone.arc(200, 50, 20, 0, Math.PI * 2);
        canvasZone.fill();
        break;

       default:
        canvasZone.clearRect(0, 0, 300, 300);
    }
  } */
}


// commentaire automatique
// documentation
// TODO liste des caractère deja entrés
// facto mixin and variable css
