import { Component, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription} from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-gamePage',
  templateUrl: './gamePage.component.html',
  styleUrls: ['./gamePage.component.scss']
})

export class GamePageComponent implements OnDestroy {
  NUMBER_OF_CHANCE = 10;
  SHORT_DISPLAY_DURATION = 3000;
  LONG_DISPLAY_DURATION = 5000;

  cardsState = new BehaviorSubject(new Map<string, boolean>());
  messageState = new BehaviorSubject('');
  pluralTryState = new BehaviorSubject('s');

  currentGameWord: string;
  modalMessage: string;
  username: string;
  pluralTry: string;
  routeSubscription: Subscription;

  secretWordMap = new Map<string, boolean>();
  tryRemaining = this.NUMBER_OF_CHANCE;
  secretWordsArray = ['javascript', 'php', 'java', 'ruby', 'sql', 'pyton', 'lorem', 'basic', 'c++'];

  constructor(private activatedRoute: ActivatedRoute) {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(params => this.username = params.username);
    this.cardsState.subscribe((hashMap: Map<string, boolean>) => this.secretWordMap = hashMap);
    this.messageState.subscribe((modalText: string) => this.modalMessage = modalText);
    this.pluralTryState.subscribe((text: string) => this.pluralTry = text);

    this.currentGameWord = this.getRandomWord(this.secretWordsArray).toUpperCase();
    this.secretWordMap = this.setHiddenDisplayForCharacters(this.currentGameWord);
    this.cardsState.next(this.setHiddenDisplayForCharacters(this.currentGameWord));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.pluralTryState.unsubscribe();
    this.cardsState.unsubscribe();
    this.messageState.unsubscribe();
  }

  getRandomWord = (wordsArray: string[]): string => {
    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
  }

  setHiddenDisplayForCharacters = (word: string): Map<string, boolean> => {
    const map = new Map<string, boolean>();

    word.split('').forEach((currentCharacter) => {
      map.set(currentCharacter, false);
    });
    return map;
  }

  setDisplayForOneCharacter = (character: string, map: Map<string, boolean>, value: boolean): Map<string, boolean> => {
    const newSecretWordMap = map;

    return newSecretWordMap.set(character, value);
  }

  tryThisCharacter = (characterToTry: string, map: Map<string, boolean>): void => {
    return this.isCharacterInMap(characterToTry, map) ?
      this.luckyTry(characterToTry, map) : this.badTry();
  }

  isCharacterInMap = (character: string, map: Map<string, boolean>): boolean => {
    return map.get(character) === undefined ? false : true;
  }

  /**
   * Description de la fonction
   * @param characterToTry : string => caractère rentré par l'utilisateur
   * @param map : Map<string, boolean> =>
   * @return void
   */
  luckyTry = (characterToTry: string, map: Map<string, boolean>): void => {
    this.setDisplayForOneCharacter(characterToTry, map, true);
    if (this.checkForEndOfGame(map)) {
      this.messageState.next('Cool, tu as gagné!  ==> Chargement d\'une nouvelle partie...');
      this.timeout(this.LONG_DISPLAY_DURATION, true);
    }
  }

  checkForEndOfGame = (map: Map<string, boolean>): boolean => {
    const arrayMapValue = Array.from(map.values());
    const arrayTrueValue = arrayMapValue.filter((value: boolean) => value === true);

    return arrayTrueValue.length === arrayMapValue.length;
  }

  badTry = (): void => {
    if (this.tryRemaining !== 0) {
      this.tryRemaining -= 1;
      // this.drawPendu(this.tryRemaining);
      this.modalInjector(this.tryRemaining);
    }
  }

  modalInjector = (chanceNumber: number): void => {
    switch (chanceNumber) {
      case 1:
        this.messageState.next('Erreur → Plus qu\'un essai !');
        this.timeout(this.LONG_DISPLAY_DURATION, false);
        this.setPluralTry();
        break;
      case 0:
        this.messageState.next('GameOver! → Chargement d\'une nouvelle partie...');
        this.timeout(this.LONG_DISPLAY_DURATION, true);
        this.setPluralTry();
        break;
      default:
        this.messageState.next('Erreur');
        this.timeout(this.SHORT_DISPLAY_DURATION, false);
    }
  }

  setPluralTry = () => this.pluralTryState.next('');

  timeout = async (durationOnMS: number, reloadGame: boolean): Promise<void> => {
    await this.delay(durationOnMS);
    this.messageState.next('');
    if (reloadGame) {
      this.resetGame();
    }
  }

  delay = (durationOnMS: number): Promise<void> => {
    return new Promise( resolve => setTimeout(resolve, durationOnMS) );
  }

  resetGame = () => {
    location.reload();
    // TODO real reset game
  }

  // drawPendu = (tryRemaining: number) => {
  //   const canvasZone = document.getElementById('myCanvas');
  //   if (canvasZone.getContext) {
  //     const ctx = canvasZone.getContext('2d');
  //     switch (tryRemaining) {
  //       case 10:
  //         ctx.beginPath();
  //         ctx.lineCap = 'round';
  //         ctx.lineWidth = "10";
  //         ctx.lineJoin = 'round';
  //         ctx.strokeStyle = "rgb(23, 145, 167)";
  //         ctx.moveTo(35, 295);
  //         ctx.lineTo(5, 295);
  //         ctx.stroke();
  //         break;
  //       case 9:
  //         ctx.moveTo(20, 295);
  //         ctx.lineTo(20, 5);
  //         ctx.stroke();
  //         break;
  //       case 8:
  //         ctx.lineTo(200, 5);
  //         ctx.stroke();
  //         break;
  //       case 7:
  //         ctx.lineTo(200, 50);
  //         ctx.stroke();
  //         break;
  //       case 6:
  //         ctx.moveTo(20, 50);
  //         ctx.lineTo(70, 5);
  //         ctx.stroke();
  //         break;
  //       case 5:
  //         ctx.beginPath();
  //         ctx.fillStyle = "red";
  //         ctx.arc(200, 50, 20, 0, Math.PI * 2);
  //         ctx.fill();
  //         break;
  //       case 4:
  //         ctx.beginPath();
  //         ctx.strokeStyle = "red";
  //         ctx.moveTo(200, 50);
  //         ctx.lineTo(200, 150);
  //         ctx.stroke();
  //         break;
  //       case 3:
  //         ctx.beginPath();
  //         ctx.moveTo(200, 80);
  //         ctx.lineTo(160, 110);
  //         ctx.stroke();
  //         break;
  //       case 2:
  //         ctx.beginPath();
  //         ctx.moveTo(200, 80);
  //         ctx.lineTo(240, 110);
  //         ctx.stroke();
  //         break;
  //       case 1:
  //         ctx.beginPath();
  //         ctx.moveTo(200, 150);
  //         ctx.lineTo(180, 200);
  //         ctx.stroke();
  //         break;
  //       case 0:
  //         ctx.beginPath();
  //         ctx.moveTo(200, 150);
  //         ctx.lineTo(220, 200);
  //         ctx.stroke();
  //         ctx.beginPath();
  //         ctx.fillStyle = "rgb(23, 145, 167)";
  //         ctx.arc(200, 62, 16, 0, Math.PI * 2);
  //         ctx.fill();
  //         ctx.beginPath();
  //         ctx.fillStyle = "red";
  //         ctx.arc(200, 50, 20, 0, Math.PI * 2);
  //         ctx.fill();
  //         break;

  //        default:
  //         ctx.clearRect(0, 0, 300, 300);
  //     }
  //   }
  // }
}


// commentaire automatique
// documentation

// TODO liste des caractère deja entrés
// facto mixin and variable css
// rework validation button for 1 character



// you need to use XXX version of node , for that you can white : nvm userInfo
