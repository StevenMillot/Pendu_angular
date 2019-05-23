import { Component, OnInit, OnDestroy} from '@angular/core';
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
  NUMBER_OF_CHANCE = 3;
  SHORT_DISPLAY_DURATION = 3000;
  LONG_DISPLAY_DURATION = 5000;

  // Observable/Observeur => variable qui peux changer ds le temps.
  subjectEtat = new BehaviorSubject(new Map<string, boolean>());
  messageState = new BehaviorSubject('');

  chanceLeft = this.NUMBER_OF_CHANCE;
  currentGameWord: string;
  message: string;
  username: string;
  mapState = new Map<string, boolean>(); // find all référence ^^ c'est ca et t'a la meme chose pour les occurence
  routeSubscription: Subscription;
  secretWordsArray = ['javascript', 'php', 'java', 'ruby', 'sql', 'pyton', 'lorem'];

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
    this.luckyTry(characterToTry, map, this.messageState) : this.badTry(this.messageState);
  }

  // not a pure function because we change a global variables
  badTry = (message$: BehaviorSubject<string>): void => {
    if (this.chanceLeft !== 0) {
      this.chanceLeft -= 1;
      this.modalInjector(this.chanceLeft, this.messageState);
      if (!message$) {
        message$.next('Erreur');
        this.timeout(message$, this.SHORT_DISPLAY_DURATION, false);
      }
    }
  }

  luckyTry = (characterToTry: string, map: Map<string, boolean>, message$: BehaviorSubject<string>): void => {
    this.setDisplayForOneCharacter(characterToTry, map, true);
    if (this.checkForEndOfGame(map)) {
      message$.next('Cool, tu as gagné!  ==> Chargement d\'une nouvelle partie...');
      this.timeout(message$, this.LONG_DISPLAY_DURATION, true);
    }
  }

    checkForEndOfGame = (map: Map<string, boolean>): boolean => {
      // construit un array des values de la map
      const arrayMapValue = Array.from(map.values());
      // construit un nouveau tableau avec uniquement les value a true
      const arrayTrueValue = arrayMapValue.filter((value: boolean) => value === true);

      return arrayTrueValue.length === arrayMapValue.length;
    }

  modalInjector = (chanceNumber: number, message$: BehaviorSubject<string>): void => {
    switch (chanceNumber) {
      case 1:
        message$.next('Erreur ==> Plus qu\'un essai :-/');
        this.timeout(message$, this.SHORT_DISPLAY_DURATION, false);
        break;
      case 0:
        message$.next('GameOver!  ==> Chargement d\'une nouvelle partie...');
        this.timeout(message$, this.LONG_DISPLAY_DURATION, true);
        break;
    }
  }

  // timeout = (message$) => setTimeout(message$.next(''), 30000);
  timeout = async (message$: BehaviorSubject<string>, duration, reloadGame: boolean) => {
    await this.delay(duration);
    message$.next('');
    if (reloadGame) {
      this.resetGame();
    }
  }

  delay = (ms: number) => {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  resetGame = () => {
    location.reload();
/*     const newWordsArray = this.secretWordsArray.filter((word) => word !== this.currentGameWord);
    this.getRandomWord(newWordsArray); */
  }
}

// commentaire automatique
// documentation
// remove inline css (rotate card etc..)
// liste des caractère deja entrés
