import { Component, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription} from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-game-page',
  templateUrl: './gamePage.component.html',
  styleUrls: ['./gamePage.component.scss']
})

/**
 * Page de jeu du Pendu
 * Tout les composants du jeu sont instanciés sur le template de cette page.
 * @class GamePageComponent
 * @implements {OnDestroy} -> Permet un nettoyage personnalisé qui doit avoir lieu lorsque l'instance est détruite.
 */
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

  /**
   * Crée une instance de la class GamePageComponent.
   * @param {ActivatedRoute} activatedRoute -> Injection de la dépendance de gestion des routes.
   * ActivatedRoute peut également être utilisé pour parcourir l'arborescence d'état du routeur.
   * @memberOf GamePageComponentng
   */
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

  /**
   * Permet de choisir un mot aléatoirement dans un tableau de mot.
   * @param  {string[]} wordsArray -> un tableau de mots
   * @returns string -> renvoie un mot du tableau
   */
  getRandomWord = (wordsArray: string[]): string => {
    return wordsArray[Math.floor(Math.random() * wordsArray.length)];
  }

  /**
   * Permet d'associer une valeur booléenne (false) à chaque caractère d'un mot.
   * @param  {string} word -> un mot
   * @returns Map -> renvoie une map caractère / booléen
   */
  setHiddenDisplayForCharacters = (word: string): Map<string, boolean> => {
    const map = new Map<string, boolean>();
    word.split('').forEach((currentCharacter) => {
      map.set(currentCharacter, false);
    });
    return map;
  }

  /**
   * Permet comparer un caractère aux clés d'une map.
   * @param  {string} character -> le caractère à comparer
   * @param  {Map<string, boolean>} map -> map de string/booléen à comparer
   * @returns boolean -> si true, la caractère est présent dans la map
   */
  isCharacterInMap = (character: string, map: Map<string, boolean>): boolean => {
    return map.get(character) === undefined ? false : true;
  }

  /**
   * Permet d'éxécuter une fonction selon la valeur de retour de la fonction isCharacterInMap().
   * @param  {string} characterToTry -> le caractère à comparer
   * @param  {Map<string, boolean>} map -> map de string/booléen à comparer
   * @returns void -> éxécute luckyTry() ou badTry() en fonction du retour booléen de isCharacterInMap()
   */
  tryThisCharacter = (characterToTry: string, map: Map<string, boolean>): void => {
    return this.isCharacterInMap(characterToTry, map) ?
      this.luckyTry(characterToTry, map) : this.badTry();
  }

  /**
   * Permet changer la valeur booléen associé à une clé et de d'envoyer un message à l'utilisateur
   * @param  characterToTry : string -> caractère rentré par l'utilisateur, définit en paramètre de la fonction setDisplayForOneCharacter()
   * @param  map : Map<string, boolean> -> map courant de mot à deviner, définit en paramètre de la fonction setDisplayForOneCharacter()
   * @return void -> messageState.next() & timeout()
   */
  luckyTry = (characterToTry: string, map: Map<string, boolean>): void => {
    this.setDisplayForOneCharacter(characterToTry, map, true);
    if (this.checkForEndOfGame(map)) {
      this.messageState.next('Cool, tu as gagné!  ==> Chargement d\'une nouvelle partie...');
      this.timeout(this.LONG_DISPLAY_DURATION, true);
    }
  }

  /**
   * Permet de changer la valeur booléen associé à une clé.
   * @param  {string} character -> le caractère clé de la map
   * @param  {Map<string,boolean>} map -> représente la map à modifier
   * @param  {boolean} value -> la valeur booléenne à associer à la clé
   * @returns Map -> renvoie une nouvelle map des changements effectués
   */
  setDisplayForOneCharacter = (character: string, map: Map<string, boolean>, value: boolean): Map<string, boolean> => {
    const newSecretWordMap = map;
    return newSecretWordMap.set(character, value);
  }

  /**
   * Permet de vérifier si tout les caractères du mot secret ont été découvert
   * @param  {Map<string,boolean>} map -> représente la map à vérifier
   * @returns boolean -> si true, le mot caché a entierrement été découvert
   */
  checkForEndOfGame = (map: Map<string, boolean>): boolean => {
    const arrayMapValue = Array.from(map.values());
    const arrayTrueValue = arrayMapValue.filter((value: boolean) => value === true);
    return arrayTrueValue.length === arrayMapValue.length;
  }

  /**
   * Permet de décrémenter le nombre d'essais restant (this.tryRemaining) et d'envoyer un message à l'utilsateur
   * @returns void -> modalInjector()
   */
  badTry = (): void => {
    if (this.tryRemaining !== 0) {
      this.tryRemaining -= 1;
      // this.drawPendu(this.tryRemaining);
      this.modalInjector(this.tryRemaining);
    }
  }

  /**
   * Permet d'envoyer un message à l'utilisateur en fonction du nombre d'essais qu'il lui reste.
   * @param {number} tryRemaining -> nombre d'essais restant
   * @returns void -> messageState.next() & timeout() & setSingleTry();
   */
  modalInjector = (tryRemaining: number): void => {
    switch (tryRemaining) {
      case 1:
        this.messageState.next('Erreur → Plus qu\'un essai !');
        this.timeout(this.LONG_DISPLAY_DURATION, false);
        this.setSingleTry();
        break;
      case 0:
        this.messageState.next('GameOver! → Chargement d\'une nouvelle partie...');
        this.timeout(this.LONG_DISPLAY_DURATION, true);
        this.setSingleTry();
        break;
      default:
        this.messageState.next('Erreur');
        this.timeout(this.SHORT_DISPLAY_DURATION, false);
    }
  }

  /**
   * Permet de modifier la typologie du mot chance dans le template de la page.
   */
  setSingleTry = () => this.pluralTryState.next('');


  /**
   * Permet de vider la modal de texte et de relancer le jeu.
   * @param  {number} durationOnMS -> temps en millisecondes, définit en paramètre de la fonction delay()
   * @param  {boolean} reloadGame -> valeur booleen exécutant le rechargement de la page
   */
  timeout = async (durationOnMS: number, reloadGame: boolean): Promise<void> => {
    await this.delay(durationOnMS);
    this.messageState.next('');
    if (reloadGame) {
      this.resetGame();
    }
  }

  /**
   * Permet d'éxécuter une action au bout d'un temps donné en milliseconde.
   * @param  {number} durationOnMS -> temps en millisecondes
   * @returns Promise
   */
  delay = (durationOnMS: number): Promise<void> => {
    return new Promise( resolve => setTimeout(resolve, durationOnMS) );
  }

  /**
   * Permet de relander le jeu
   * @returns void
   */
  resetGame = (): void => {
    location.reload();
    // TODO real reset game with a new word
  }

  // TODO create a Pendu animation.
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
