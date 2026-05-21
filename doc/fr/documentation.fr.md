# Documentation : Category Finder V2 (Recherche par catégorie)

Cette extension pour Visual Studio Code aide à naviguer rapidement parmi les fonctions d'un fichier PHP en se basant sur le tag PHPDoc `@category`, mais aussi sur @package et @subpackage, qui sont traités de la même manière.

Les catégories doivent toutes se trouver sur la même ligne, séparées par des virgules.

> Je ne comprends vraiment pas comment cette extension n'existe pas déjà : ce devrait être une fonctionnalité standard intégrée à VSC !

Elle fonctionne plutôt bien, à l'exception du code commenté. Si vous n'avez pas besoin de lire le code dans les commentaires, alors c'est bon.

> En fait, je ne comprends pas pourquoi quelqu'un a écrit qu'aujourd'hui il est à la mode d'utiliser package plutôt que category : ce sont deux choses complètement différentes ! Y a-t-il vraiment quelqu'un qui utilise package pour catégoriser les fonctions au sein d'un même fichier ?

## Comment l'utiliser

### Activation
- L'extension ajoute une icône à la colonne des extensions de VS Code.
- Pour commencer, ouvrez un fichier de code PHP contenant des fonctions et cliquez sur l'icône.

La barre latérale principale est probablement trop petite pour afficher le contenu de cette extension.<br>
En raison d'une limitation arbitraire et injustifiable de VS Code, il n'est pas possible d'ouvrir directement l'extension de la barre secondaire, que vous pouvez étendre sans chevaucher d'autres extensions. Donc si vous le souhaitez, vous devrez la déplacer manuellement.<br>
![Déplacer extension](../it/spostare%20estensione.png)
* Clic droit sur l'extension que vous voulez déplacer
* "Déplacer vers"
* "Barre latérale secondaire" (ou où vous préférez)

De cette façon, elle occupera le même panneau que Copilot.
Pour la déplacer à nouveau, faites un clic droit sur le titre, puis sur Déplacer vers.

À ce stade, l'étiquette affichée sera "Category Finder" suivie du drapeau de la langue active (sous réserve de l'affichage des emojis du système d'exploitation expliqué dans <a href="bugs%20windows.fr.md" target=_blank>Bugs de Windows</a>) ; si la langue de VSC ne fait pas partie de celles prises en charge par l'extension, un globe apparaîtra et elle sera en anglais.
<!-- Pour des raisons incompréhensibles, pour ce lien la syntaxe markdown ne fonctionne pas, j'ai donc dû utiliser celle de html. La cible ne fonctionne pas toujours. -->

Le dossier "Exemples" contient quelques fichiers sur lesquels faire des tests
* Action est tiré de https://github.com/zendframework/zf1/blob/master/library/Zend/Controller/Action.php
* Abstract est tiré de https://github.com/zendframework/zf1/blob/master/library/Zend/Db/Adapter/Abstract.php

J'ai dû modifier les deux car il semble que sur internet personne n'utilise @Category ou @package.<br>
Je n'ai aucune idée de ce que font ces fichiers, ce ne sont que des exemples pour comprendre le fonctionnement de l'extension.

### Panneau de navigation
📎 Un double-clic sur une fonction déplace le curseur de l'éditeur directement à la ligne correspondante.

Le panneau a deux onglets principaux pour explorer le code.

Dans les Paramètres, vous pouvez décider de lister également les fonctions commentées, c'est-à-dire contenues dans un commentaire, dans une couleur différente, ou de les masquer.

#### Onglet : Toutes les fonctions
Affiche toutes les fonctions identifiées dans le fichier. Triables.

Pour chaque fonction, sont affichés : le numéro de ligne, le nom (en gras) et les éventuelles catégories associées.

- **Filtrer par nom ou catégorie** : Un champ de recherche permet de filtrer instantanément la liste par nom ou catégorie. Il est également indiqué combien de fonctions sont actuellement affichées, X sur Y.
- **Trier par** : Il est possible de trier la liste par numéro de **ligne** ou par ordre alphabétique par **nom** ou par **nom complet**, c'est-à-dire en tenant compte du chemin de l'extension (par exemple, dans quelle classe elle se trouve, mais il est également possible qu'une fonction se trouve à l'intérieur d'une autre fonction ou d'une énumération).

#### Onglet : Par catégorie
Les fonctions sont regroupées sous chaque catégorie à laquelle elles appartiennent. Les fonctions sans catégorie sont regroupées dans "Sans catégorie" (nom dans le fichier de traduction).<br>
Les catégories sont toujours listées par ordre alphabétique. À l'intérieur, sont listées les fonctions qui ont cette catégorie.<br>
Si une fonction a plusieurs catégories, elle apparaît dans plusieurs groupes.

À côté de chaque fonction, toutes ses catégories sont affichées. La catégorie du groupe actuel est mise en évidence à la fin avec une couleur différente.

À côté de chaque titre de catégorie se trouve un compteur du nombre de fonctions X sur Y, qui se met à jour pendant le filtrage.<br>
En haut se trouve un compteur pour le nombre de catégories affichées. Il n'y a pas de compteur de fonctions car les fonctions avec plusieurs catégories apparaissent dans plusieurs listes.

- **Filtrer par nom de catégorie** et **Filtrer par nom de fonction** : Deux champs de recherche sont présents : un pour filtrer les groupes de catégories et un pour filtrer les fonctions à l'intérieur. Ils peuvent être utilisés ensemble.
- **Trier par** : Dans cette vue également, il est possible de trier les fonctions à l'intérieur de chaque catégorie.

La recherche-filtre est effectuée sur le nom affiché à ce moment-là.
* Si le paramètre "Afficher les noms étendus" est activé, la recherche s'effectue sur le nom complet (ex. NomClasse\nomFonction).
* Si le paramètre est désactivé, la recherche s'effectue uniquement sur le nom court (ex. nomFonction), en ignorant la classe.

### Sélecteur de fichier (menu déroulant)
L'extension comprend un menu déroulant en haut du panneau, qui offre un contrôle sur le fichier à analyser.

#### Pour l'utilisateur
-   **Fichier actuel** : C'est l'option par défaut. La liste des fonctions se mettra automatiquement à jour pour afficher les fonctions contenues dans le fichier sur lequel vous travaillez activement dans l'éditeur.
-   **Liste des fichiers ouverts** : Le reste du menu liste tous les fichiers actuellement ouverts dans les onglets de l'éditeur, par ordre alphabétique. Vous pouvez en sélectionner un pour "figer" la vue sur ce fichier spécifique, quel que soit le fichier actif.
-   **Mise en évidence** : Le fichier actuellement actif dans l'éditeur est mis en évidence avec une couleur de fond dans le menu, ce qui le rend facile à repérer.
-   **Navigation intelligente** :
    -   Si vous double-cliquez sur une fonction du **fichier actif**, l'éditeur sautera directement à cette ligne.
    -   Si vous double-cliquez sur une fonction d'un **fichier non actif**, VS Code ouvrira une fenêtre d'aperçu ("Peek View") sur cette fonction, sans changer le fichier principal sur lequel vous travaillez.

Les fichiers non encore sauvegardés sont exclus. Cependant, les fichiers sont lus à jour (pour la liste des fonctions) même s'ils не sont pas sauvegardés. Le fichier actuel est analysé même s'il n'est pas sauvegardé.

#### Détails de l'implémentation de la combo
- **Source des données** : Pour garantir que la liste des fichiers est toujours exacte, l'extension lit les onglets ouverts via l'API `vscode.window.tabGroups.all`.
- **Gestion de l'état** : Une variable interne (`_selectedFileUri`) garde une trace de la sélection de l'utilisateur. Si elle est `null`, l'extension suit le fichier actif ; sinon, elle utilise l'URI du fichier sélectionné.
- **Mises à jour dynamiques** : L'extension utilise `vscode.window.tabGroups.onDidChangeTabs` pour mettre à jour le menu déroulant en temps réel lorsque les onglets sont ouverts, fermés ou déplacés.
- **Chargement asynchrone** : Pour éviter de bloquer l'interface et gérer les fichiers qui ne sont pas encore chargés en mémoire, la sélection d'un fichier dans le menu déclenche une fonction `async`. Une image de "Fichier en cours d'analyse..." est affichée immédiatement, tandis que le document est chargé en arrière-plan avec `await vscode.workspace.openTextDocument()`. Ou du moins, c'est ainsi que cela devrait être.
- **Aperçu (Peek View)** : La navigation inter-fichiers est implémentée via la commande `editor.action.peekLocations`, à laquelle sont transmis l'URI du fichier et la position de la fonction.

## Détails de l'implémentation de l'extension
- **Langage** : L'extension est écrite en **JavaScript pur**, car TypeScript ne fonctionne pas.
- **Interface utilisateur** : Le panneau est une WebView, dont le contenu est généré dynamiquement sous forme de chaîne HTML. L'interactivité (filtres, tri, onglets) est gérée par du JavaScript exécuté à l'intérieur de la WebView elle-même.
- **Communication** : La navigation pour déplacer le curseur par double-clic est implémentée via des événements et des messages.

### buildCategoryTree
Le but de cette fonction est de prendre une liste "plate" de fonctions (un simple tableau) et de la transformer en une structure de données organisée (un "arbre" ou, plus précisément, un regroupement) basée sur leurs @category. De plus, elle trie ces catégories par ordre alphabétique, en s'assurant que les fonctions sans catégorie apparaissent en dernier.

**Ce qu'elle retourne**
La fonction retourne une Map JavaScript au format :

* Clé (Key) : Une chaîne représentant le nom de la catégorie.
* Valeur (Value) : Un tableau d'objets. Chaque objet du tableau est l'objet fonction original qui appartient à cette catégorie. L'objet fonction a la forme : { name: string, lineNumber: number, categories: string[] }.

**Exemple pratique :**
Si l'entrée est une liste de fonctions comme celle-ci :

```json
[
	{ name: "getUser", lineNumber: 10, categories: ["Database", "API"] },
	{ name: "renderButton", lineNumber: 50, categories: ["UI"] },
	{ name: "helperFunc", lineNumber: 80, categories: [] },
	{ name: "fetchData", lineNumber: 120, categories: ["API"] }
]
```
La sortie retournée par buildCategoryTree sera une Map similaire à celle-ci :

```json
Map
{
	"API" =>
	[
		{ name: "getUser", lineNumber: 10, categories: ["Database", "API"] },
		{ name: "fetchData", lineNumber: 120, categories: ["API"] }
	],
	"Database" =>
	[
		{ name: "getUser", lineNumber: 10, categories: ["Database", "API"] }
	],
	"UI" =>
	[
		{ name: "renderButton", lineNumber: 50, categories: ["UI"] }
	],
	"Sans catégorie" =>
	[
		{ name: "helperFunc", lineNumber: 80, categories: [] }
	]
}
```

**Comment ça marche**
1. Crée une Map vide appelée tree. Les Map js, qui contrairement à la philosophie de js sont des classes et même pré-construites, sont une liste d'objets clé-valeur qui conservent cependant l'ordre, contrairement aux objets Map de tous les autres langages que j'ai vus. Bien qu'en réalité d'autres langages aient aussi des itérateurs, donc je ne perçois pas la différence.
2. *Regroupement* La fonction parcourt (forEach) chaque objet func présent dans le tableau functions qu'elle a reçu en entrée.
Pour chaque fonction, elle vérifie si elle a des catégories.
3. *Assignation* D'abord, elle assigne une catégorie fictive aux fonctions sans catégorie, puis elle boucle sur toutes afin d'assigner cette fonction aux étiquettes correspondant aux catégories dont elle fait partie.
4. *Tri* Malheureusement, les tris des maps servent à peu de choses, il faut donc la transformer en tableau, la trier en tenant compte du cas spécial *noCategoryLabel* qui va à la fin, puis la reconvertir en map.

### Trouver les fonctions
La version précédente utilisait des expressions régulières pour trouver les lignes où se trouve une fonction.<br>
C'est bien tant qu'il s'agit d'analyser des bibliothèques de fonctions sans classes ni énumérations.

Pour trouver dans quoi chaque fonction se trouve (imbrication), afin de pouvoir par exemple mettre en évidence les toString des énumérations et savoir qu'elles se trouvent dans une énumération, qui à son tour peut se trouver dans une classe, il faut utiliser le même algorithme que celui qui crée le fil d'Ariane de VSCode : **AST (Abstract Syntax Tree)**, et sur une technique de recherche appelée **Hit Testing (test de collision)**.

Le processus de **construction d'un AST** se divise en deux phases distinctes : Lexing (Tokenisation) et Parsing (Analyse Grammaticale).

#### Phase A : Le Lexer (le scanner)
Le Lexer lit le fichier caractère par caractère et regroupe les caractères en "mots" connus appelés Tokens. Il ne comprend pas le sens, il sait seulement "étiqueter" les morceaux.

* Entrée : `function pippo() { }`
* Sortie du Lexer :
	1. T_FUNCTION (début : 0, fin : 8, ligne : 1)
	0. T_WHITESPACE (" ")
	0. T_STRING ("pippo", début : 9, fin : 14)
	0. T_OPEN_PAREN ("(")
	0. T_CLOSE_PAREN (")")
	0. ...

Il compte simplement les caractères depuis le début du fichier (offset).

#### Phase B : Le Parser (la grammaire)
C'est ici que la magie opère. Le Parser prend la liste de jetons et applique des règles grammaticales.

L'algorithme pour comprendre où un nœud (ex. une fonction) commence et se termine
1. **Lookahead (Regarder en avant)** : Le parseur rencontre le jeton T_FUNCTION. Il sait qu'une déclaration de fonction commence. Il enregistre sa position de départ.
0. **Consommation** : Il s'attend (selon la grammaire PHP) à un nom, puis des parenthèses, puis un bloc de code { ... }
0. **Imbrication** : Lorsqu'il rencontre l'accolade ouvrante `{`, il entre en mode "bloc". Il continue à *manger* des jetons. S'il trouve une autre accolade `{` (ex. un if dans la fonction), il descend d'un niveau. S'il trouve `}`, il remonte.
0. **Fermeture** : Lorsqu'il trouve l'accolade fermante `}` qui correspond à celle ouverte de la fonction, il déclare le nœud "complet", en notant sa position.

Le résultat est un objet (Nœud) qui dit : "Je suis une FunctionDeclaration, je contiens ces enfants, je commence à la ligne X et je finis à la ligne Y".

#### (mauvaise) Solution
Utiliser la bibliothèque standard "de facto" php-parser (créée par glayzzle). C'est celle utilisée par des outils comme Prettier pour formater le PHP.

À installer en lançant `npm install php-parser` depuis un terminal cmd dans le dossier du projet. Depuis VSC, cela ne fonctionne pas.

> Cela a cependant **massacré** mon pauvre fichier package.json. Même si cela n'aurait dû ajouter que
> ```
> "dependencies":
> {
>	"php-parser": "^3.2.5"
> }
> ```

Même si j'ai ensuite découvert que la bibliothèque a des dépendances et, apparemment, c'est à moi de mémoriser dans mon package la liste complète des dépendances plutôt que d'hériter en cascade de toutes les dépendances fixées par leur package.

Il faut également modifier le gitignore en ajoutant `node_modules/`, je me demande comment il ne l'a pas ajouté automatiquement.<br>
Il a également ajouté package-lock.json, qui garantit que tout fonctionne.

**Important :** Lorsque vous téléchargez ce projet, vous devrez lancer `npm install`.<br>
Pour mettre à jour la version, qui est invece bloquée, il faut `npm update`, il devrait être possible de spécifier quelle bibliothèque spécifique installer, au cas où il y en aurait plus d'une.

---

Cette solution a cependant un problème : les commentaires sont classés comme des commentaires et donc ignorés.<br>
Je vais donc entrer en récursion dans les commentaires, en accrochant ce nœud comme enfant du commentaire, en ajoutant un nouveau champ à l'objet retourné qui indique qu'il s'agit d'un commentaire.

L'objet retourné sera un arbre de :
```
name: functionName,
lineNumber: lineNumber,	// L'API de VS Code utilise une base 1 pour l'affichage
line: lineNumber,
endLine: lineNumber,
categories: categories,
type: type,				// 'function' ou 'method'
isInComment: isCommented
```
> Je voudrais comprendre comment la tabulation dans VSC est différente de ce qu'elle apparaît dans l'aperçu web

Tout cela est très merveilleux en théorie, mais ce n'est pas ce qui est implémenté dans la fonction parseFunctions, que j'ai renoncé à essayer de comprendre.

Malheureusement, le parseur est **bogué** et n'interprète pas correctement les commentaires. J'ai créé un [issue](https://github.com/glayzzle/php-parser/issues/1169#event-25724448614), mais cela s'est avéré inutile.

### Lisez aussi
[Bizarreries des extensions](bizarreries%20de%20l'extension.fr.md).

## NPM
Un guide d'introduction, en italien, se trouve sur https://kinsta.com/it/blog/cos-e-npm/, conservé (mal) sur https://web.archive.org/web/20251121094837/https://kinsta.com/it/blog/cos-e-npm/

Ce projet utilise **NPM** (Node Package Manager) pour gérer les bibliothèques externes nécessaires au fonctionnement de l'extension (comme `php-parser` pour l'analyse du code) et les outils de développement (comme `vsce` pour créer le paquet final).

### Pourquoi utilisons-nous NPM au lieu de télécharger les bibliothèques à la main ?
NPM offre des avantages critiques pour le développement moderne :

1.  **Gestion de l'arbre des dépendances (L'avantage principal) :**
    Les bibliothèques modernes dépendent souvent d'*autres* bibliothèques pour fonctionner.
      * *Méthode manuelle :* Vous devriez télécharger la bibliothèque A, découvrir qu'elle a besoin de la bibliothèque B, télécharger B, découvrir qu'elle a besoin de C... un cauchemar de gestion manuelle.
      * *Avec NPM :* NPM calcule automatiquement tout l'arbre. Si vous installez `php-parser`, il télécharge automatiquement toutes les sous-bibliothèques nécessaires sans que vous ayez à faire quoi que ce soit.
2.  **Dépôt léger et propre :**
    Le code des bibliothèques externes est lourd (des centaines de fichiers).
      * *Méthode manuelle :* Vous seriez obligé de charger tous ces fichiers inutiles dans votre système de gestion de versions (Git), alourdissant le projet.
      * *Avec NPM :* Le code des bibliothèques **n'est pas commité**. Dans le projet, nous ne sauvegardons qu'une "liste de courses" (`package.json`). Quiconque télécharge le projet lancera une commande et NPM téléchargera les fichiers frais à ce moment-là.
	  * Problème : Cela rend dépendant du fait que les bibliothèques tierces continueront d'exister.
3.  **Versionnement sécurisé (`package-lock.json`) :**
    NPM génère un fichier appelé `package-lock.json`. Ce fichier "gèle" les versions de chaque bibliothèque installée. Cela garantit que si le projet fonctionne sur votre ordinateur aujourd'hui, il fonctionnera à l'identique sur l'ordinateur d'un autre développeur dans un an, évitant le problème "mais sur mon pc ça fonctionnait".
4.  **Mises à jour simplifiées :**
    Pour mettre à jour une bibliothèque vers la nouvelle version, il suffit de taper `npm update`. Le faire à la main nécessiterait de retélécharger, décompresser et écraser les fichiers manuellement, avec un risque élevé d'erreurs.

### Comment installer NPM

NPM est automatiquement inclus dans **Node.js**. Vous n'avez pas besoin de l'installer séparément.

1.  Allez sur le site officiel : [nodejs.org](https://nodejs.org/)
2.  Téléchargez la version indiquée comme **LTS** (Long Term Support).
3.  Exécutez l'installation standard (Suivant, Suivant, Terminer).

Pour vérifier qu'il est correctement installé, ouvrez un terminal (Invite de commandes ou PowerShell) et tapez :

```bash
node -v
npm -v
```

Si vous voyez des numéros de version (ex. `v20.x.x`), vous êtes prêt.

### Comment initialiser le projet

Une fois que vous avez téléchargé ce projet sur votre ordinateur, le dossier des bibliothèques (`node_modules`) ne sera pas présent (car, comme expliqué ci-dessus, il n'est pas sauvegardé sur Git).

Pour télécharger toutes les dépendances nécessaires en une seule fois :

1.  Ouvrez le terminal dans le dossier du projet.
2.  Lancez la commande :
    ```bash
    npm install
    ```

NPM lira le fichier `package.json`, téléchargera `php-parser` et tous les autres outils nécessaires, et créera automatiquement le dossier `node_modules`. Vous êtes maintenant prêt à appuyer sur `F5` et à démarrer l'extension.

Avec cela, vous devriez être en mesure d'exécuter le projet.

## Comment contribuer
Ce projet est ouvert aux contributions. Si vous souhaitez suggérer de nouvelles fonctionnalités ou participer au développement, vous êtes le bienvenu. Ouvrez une issue ou une pull request sur le dépôt du projet sur GitHub, si possible. N'oubliez pas de mettre à jour la documentation lorsque vous apportez des modifications, si possible au moins dans votre langue et en anglais, en laissant un espace réservé dans les autres langues indiquant l'absence.

Apparemment, mon style de syntaxe se rapproche de l'*Allman*, bien qu'il diffère pour les blocs d'une seule ligne, je vous invite donc à le suivre. Un nom plus approprié ne semble pas encore exister, je peux donc le définir comme "Allman avec omission des accolades pour les instructions uniques, qui si elles sont assez courtes ne vont pas à la ligne, cependant si les instructions uniques contiennent d'autres instructions, elles peuvent être dans un bloc, mais en tenant compte de la symétrie dans les if/else". N'hésitez pas à écrire les commentaires et les noms des fonctions en anglais, si vous préférez.

Je vous demande seulement de préciser si, en cas d'utilisation de l'IA, vous avez soigneusement vérifié que le code généré a du sens, en plus bien sûr de vérifier qu'il fonctionne correctement. Et que des fonctionnalités n'ont pas été supprimées, pour cela référez-vous également à [Fonctionnalités prévues](<fonctionnalités%20prévues.fr.md>).

### parseFunctions
À ce stade, **j'abandonne**, je déclare ma reddition !<br>
Pour commencer, je répète ici qu'il est **erroné** que ce soit à moi d'écrire cette fonction. Mon domaine est d'écrire des programmes, pas des extensions de support pour écrire des programmes qui devraient faire partie des IDE en standard !!!!

La parseFunctions actuelle dans la région 3, je n'ai aucune idée de comment elle fonctionne, et je suis également certain qu'elle est erronée car :
* elle utilise des regex plutôt que de faire de la récursion en passant le commentaire au parseur lui-même, qui à ce stade je sais qu'il est bogué car il n'est pas capable d'ignorer les erreurs typiques du code commenté
* elle utilise une syntaxe alambiquée comme les fonctions anonymes dans les constantes ou passées en argument

Comme je le disais plus haut, elle devrait entrer en récursion et non utiliser de regex !!!!

La première chose à modifier est donc de résoudre le fait que pour les commentaires, elle n'insère pas le chemin réel (qui n'existe pas toujours). Et en général la gestion correcte des commentaires, qui fait totalement défaut.

### C'est une éternité à démarrer
Mon idée était de faire apparaître la loupe (correcte) contenue dans le dossier webview immédiatement au chargement de VSC et au changement de fichier, en pratique pendant l'analyse du fichier. Mais cela ne semble pas être possible : toutes les tentatives se sont soldées par des échecs épiques où d'abord le panneau apparaît gris pendant une fraction de seconde, puis le traitement commence avec une barre bleue en haut, puis (inutilement) le gif apparaît et enfin la liste des fonctions.<br>
Évidemment, ça n'a aucun sens.<br>
Le problème devrait être dû au fait que la lecture du fichier courant, et de la liste des fichiers, est très longue, et le html n'est généré qu'à la fin de cela.<br>
Je n'en suis pas si sûr, car le changement de fichier prend beaucoup moins d'une seconde, même lorsque le fichier est long. Et lister les fichiers ne peut pas prendre une éternité s'il y en a moins de 10.

> Et voici deux autres bugs :<br>
> * Bug de VSC : Se fier à JS qui est un **mauvais** langage.
> * Bug de JS : Il n'y a pas d'instruction pour forcer le rendu immédiatement.
> * Voir aussi https://federicoboccaccio.wordpress.com/2025/08/05/bug-di-vs-code/ et https://federicoboccaccio.wordpress.com/2025/07/11/quello-che-odio-di-js/ (en italien)

### (Autres) Améliorations possibles (mais peu probables)
* Un menu contextuel dans l'Explorateur de fichiers pour définir ce fichier comme à afficher dans l'extension.
* Personnalisation de toutes les couleurs.
* Option pour décider quoi faire lorsqu'on double-clique sur une fonction, au cas où la fonction se trouve dans un fichier séparé ou dans le fichier courant. Entre : "sauter à la fonction dans ce fichier", "afficher à l'endroit actuel comme s'il s'agissait d'un clic sur 'référence'", "demander à chaque fois parmi ces options", "personnaliser l'action en fonction de l'appui sur Alt ou Ctrl", "menu contextuel sur les fonctions pour choisir".
* Menu contextuel sur le nom de la fonction, pour avoir une deuxième voie d'accès à la fonction, étant donné que le clic fonctionne une fois sur deux, mais aussi une entrée pour copier le texte : nom de la fonction, nom complet (y compris la classe), le numéro de ligne, le `li` complet.
* Infobulle avec le nom et le chemin complet d'une fonction, utile lorsque seul le nom est affiché sans le chemin. Afficher également une infobulle avec le commentaire `/**` complet.
* Option (case à cocher) pour indiquer sur quoi travailler entre category, package et subpackage.
* Améliorer le filtre-recherche en laissant le choix de chercher comme maintenant, de toujours chercher uniquement par nom de fonction ou toujours dans le nom complet. Évaluer également les expressions régulières.

Dans la prochaine version, éliminer les fonctions non utilisées.