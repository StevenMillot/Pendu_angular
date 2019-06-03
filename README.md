# Jeu du pendu

Le Pendu est un jeu consistant à trouver un mot en devinant quelles sont les lettres qui le composent.

### Déroulement

Une fois votre pseudo enregistré, le jeu génère un mot caché aléatoirement.
Le joueur doit deviner le mot en proposant à l'interface des caractères un part un.
Vous disposez de 10 essais pour trouver le mot.
Lorsque vous trouvez un bon caractère, toutes les lettres identiques seront révélées et aucun essai ne vous est retiré.

Le jeu se termine lorsque le joueur trouve le mot caché, ou a utilisé toutes ses chances.
Après un message de félicitation, ou non, le jeu se relance directement sur une nouvelle partie.


# Installation

La version actuelle d'Angular nécessite d'avoir [Node.js](https://nodejs.org/fr/) en version **8.9** au minimum.
Si vous disposez de [Node Version Manager](https://github.com/nvm-sh/nvm/blob/master/README.md) sur votre machine, la commande `nvm use` vous permet de changer rapidement de version pour passer à celle minimum requise.

La commande `npm install` vous permettra d'installer toutes les dépendances dont le projet a besoin pour fonctionner.

### Serveur de développement

La commande `ng serve` permet de créer un serveur local sur le port 4200.
Naviguez via l'adresse: `http://localhost:4200/`.
L'application se recharge automatiquement lorsque des changements sur le code source sont enregistrés.

### Build

La commande `ng build` permet de build le projet.
Le build généré sera disponible dans le répertoire `dist/`. Utilisez le préfix `--prod` pour lancer un build de production.


# Développement

Le but de ce projet est de recréer le Jeu du Pendu en JavaScript, avec le framework Angular7.

### Contraintes

- Utilisation du framework AngularN
- Développement sous forme de composants
- Développement en ES6 obligatoire
- Interdiction d'utiliser Yeoman
- Écrire une documentation permettant d'installer / configurer et utiliser le Pendu

Au démarrage, je suis invité à rentrer mon pseudo.
Un mot dont les lettres sont masquées est généré.
Je dois cliquer ou saisir un caractère pour l'afficher dans le mot caché, s'il est présent.
Je dispose d'un compteur qui me permet de connaître le nombre d'essais restant.
L'application doit me féliciter ou non en fin de partie.

### Critères de qualité

- Le code doit être structuré et commenté
- Le projet doit être responsive et un minimum stylisé

### Evolutions à venir

- Enregistrer le score des participants, et pouvoir consulter tous les résultats depuis l'application.
- Afficher à l'utilisateur les caractères qu'il a déjà rentrés dans l'application pour découvrir le mot caché.
- Voir l'évolution des chances restantes grâce à une animation du pendu.
- Proposer plusieurs thèmes de mot à deviner.
- Permettre à l'utilisateur de créer un thème ainsi que sa propre liste de mot, disponible online.
- Lorsque le joueur relance une partie, le prochain mot à deviner devra obligatoirement être différent des mots déjà proposés, ou indiquer que tous les mots de son thème on été devinés.
- Proposer à l'utilisateur de rentrer un mot comme réponse.
