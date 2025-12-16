## activate
### Enregistrement de la classe
La ligne : `context.subscriptions.push(vscode.window.registerWebviewViewProvider("category-finder-view", provider));`

**Enregistre le "cerveau" de la vue :**

* `vscode.window.registerWebviewViewProvider(...)` est la fonction qui dit à Visual Studio Code : "Lorsque l'utilisateur souhaite afficher le panneau avec l'ID 'category-finder-view', utilisez la logique contenue dans l'objet fournisseur pour le créer et le gérer".
* "category-finder-view" est l'identifiant (ID) de la vue, qui doit correspondre exactement à celui que vous avez défini dans le fichier package.json.
* provider est l'instance de la classe `CategoryViewProvider`, qui contient le code pour générer le HTML et gérer les messages provenant de la webview.

**Gère le cycle de vie de l'extension :**

* `context.subscriptions.push(...)` est un mécanisme de nettoyage. Une liste de "choses à éteindre" lorsque l'extension n'est plus nécessaire.
* Lorsque vous enregistrez la vue, VS Code renvoie un objet "jetable" (un Disposable). En l'ajoutant à cette liste, vous vous assurez que, lorsque l'utilisateur désactive l'extension ou ferme VS Code, l'enregistrement de votre vue est correctement annulé. Cela évite les fuites de mémoire (memory leaks) et garantit que votre extension se comporte bien dans l'éditeur.

### Autres enregistrements
Il y a 3 `context.subscriptions.push` et ils pourraient être enregistrés dans la même instruction, mais les garder séparés devrait faciliter la lecture du code.

**vscode.window.onDidChangeActiveTextEditor** Ce devrait être la fonction qui est activée lorsque l'onglet actif dans l'éditeur est modifié, et par conséquent appelle la fonction à exécuter lorsque l'onglet est modifié.

**vscode.workspace.onDidSaveTextDocument** Ceci est appelé lors de l'enregistrement d'un document.

Cette extension est conçue pour mettre à jour la liste lors de ces deux événements.

## resolveWebviewView
Cette fonction est appelée automatiquement et est responsable de la configuration de la WebView affichée dans la barre latérale.

* Elle enregistre une référence à la vue (this._view = webviewView).
* Elle définit les options nécessaires.
* Elle enregistre le gestionnaire pour les messages provenant de la webview (`onDidReceiveMessage`).
* Elle appelle this.update() pour la première fois pour charger le contenu initial.

## Options
Les paramètres de l'extension doivent être définis dans package.json, en tant qu'enfants de *contributes*.

Pour les lire, vous avez besoin de :
```
const config = vscode.workspace.getConfiguration('categoryFinder');
const bgColor = config.get('backgroundColor');
```

### Comment fonctionnent les clés de configuration dans VS Code
- Dans le `package.json` de l'extension, les **clés de configuration** sont définies à l'intérieur de `"contributes.configuration.properties"`.
- Chaque clé a un **espace de noms** (préfixe) et un nom.
Exemple : `"categoryFinder.backgroundColor"`
- `categoryFinder` → est l'**espace de noms** (ou section de configuration), il ne doit donc pas coïncider avec le nom du package (mais ce n'est pas interdit).
- `backgroundColor` → est la propriété dans cet espace de noms.

### Pourquoi est-il écrit avec un point
Le point (`.`) n'est pas un opérateur arbitraire : c'est la convention de VS Code pour séparer l'**espace de noms** et la **clé**.
- `"categoryFinder.backgroundColor"` est une seule clé de configuration.
- Lorsque vous faites `vscode.workspace.getConfiguration('categoryFinder')`, vous dites : "donnez-moi tous les paramètres sous l'espace de noms `categoryFinder`".
- Ensuite, avec `.get('backgroundColor')`, vous accédez à la propriété spécifique.

Si vous écriviez directement :

```js
const bgColor = vscode.workspace.getConfiguration().get('categoryFinder.backgroundColor');
```

cela fonctionnerait de la même manière, car vous lisez la clé complète.<br>
Mais la forme avec `getConfiguration('categoryFinder')` est plus propre et plus modulaire :
- Elle vous permet de lire plusieurs valeurs du même groupe sans répéter le préfixe.
- Elle indique clairement que toutes les options appartiennent à un "bloc" (`categoryFinder`).

### En résumé
- **Séparez-les** : car VS Code gère les configurations comme des objets imbriqués (`espace de noms → propriété`).
- **Le point** : est la syntaxe pour définir des clés avec des espaces de noms.
- **Alternatives** : vous pouvez lire `"categoryFinder.backgroundColor"` directement en une seule instruction, mais utiliser `getConfiguration('categoryFinder')` est plus propre et plus évolutif.

### Il n'y a pas de liste
Après une heure de recherche et avoir dérangé à la fois copilot et gemini, je peux affirmer sans crainte de me tromper qu'il n'existe pas de liste de tous les types et formats disponibles. Pour les types, il y a l'intellisense, mais pas pour le format, à moins que le format ne soit une invention de l'IA, qui si elle était un peu plus intelligente serait capable de répondre "roger-roger".<br>
Les énumérations ne sont pas incluses. Pourtant, d'autres paramètres affichent des combos.

Je trouve également très peu pratique de devoir tout mettre entre guillemets. En plus d'être peu pratique, cela empêche le renommage intelligent et l'intellisense avec get.

## Traductions
Finalement, j'ai renoncé à essayer de comprendre comment fonctionnent les traductions, en particulier la raison de certains choix pour le moins bizarres.

Le simple fait que *i18n* (internationalisation) et *L10N* (localisation) existent en tant que normes pour les noms de dossiers crée de la confusion. Bien que l'on puisse affirmer qu'il s'agit de deux choses différentes, d'un point de vue programmation, il s'agit toujours de traduire le programme, et donc d'avoir un ensemble de chaînes dans plusieurs langues.

### Pourquoi y a-t-il plusieurs groupes de fichiers de traduction
Il y a une raison technique précise à cette séparation. Les deux groupes de fichiers servent à deux fins différentes et sont lus par deux "entités" différentes :

1.  **Les fichiers "Bundle" (`l10n\bundle.l10n.it.json`, etc.)**
    * **À quoi servent-ils :** Ils traduisent l'interface "statique" de VS Code, c'est-à-dire tout ce qui est défini dans le fichier `package.json` (le titre de l'extension, la description, les titres des commandes, les éléments de menu, les paramètres).
    * **Qui les lit :** Ils sont lus directement par **Visual Studio Code** au démarrage de l'extension.
    * **Pourquoi ce nom :** VS Code exige spécifiquement cette convention de nommage (`bundle.l10n.<langue>.json`) lors de l'utilisation de la propriété `"l10n": "./l10n"` dans `package.json`. Si vous ne les nommez pas ainsi, VS Code ne traduira pas les commandes et les menus.
    * **Cependant**, les fichiers à la racine `package.nls.*.json` font également cela. Et celui sans langue est chargé lorsque la langue de VSC n'est pas disponible. En fait, j'ai laissé l10n dans cette version, mais en pratique, ils ne devraient pas être nécessaires.
2.  **Les fichiers simples (`l10n\it.json`, `l10n\en.json`, etc.)**
    * **À quoi servent-ils :** Ils traduisent l'interface "dynamique" à l'intérieur de votre panneau (les onglets, les boutons HTML, les étiquettes à l'intérieur de la WebView).
    * **Qui les lit :** Ils sont lus par le **code JavaScript** (`extension.js`).
    * **Pourquoi sont-ils séparés :** Dans le code (`extension.js`), la fonction `loadTranslations` est programmée pour rechercher des fichiers nommés exactement `it.json`, `en.json`, etc. Bien que vous puissiez techniquement écrire un code plus complexe pour lui faire lire les "bundles", les avoir séparés est souvent plus propre : un ensemble est pour "l'extérieur" (VS Code), l'autre est pour "l'intérieur" (l'extension).
3.  Les fichiers à l'intérieur de i18n devraient également être ceux lus par la fonction de traduction.

En d'autres termes, c'est un choix discutable.

Et si pour une raison quelconque vous devez mentionner un terme de l'interface dans le programme, vous devez répliquer la chaîne.

Ce que je ne comprends pas :
* Si les fichiers de l'interface, les *bundles* et les *nls* sont lus automatiquement, pourquoi les autres ne sont-ils pas lus et remplacés automatiquement, étant donné qu'ils suivent ce qui devrait être une norme ?
* "Ne puis-je pas dire à loadTranslations de lire les fichiers nls ?" Réponse : Techniquement oui, mais c'est une mauvaise pratique. Les fichiers nls sont réservés au système automatique de VS Code pour package.json. Mélanger les chaînes de la webview créerait de la confusion et irait à l'encontre des conventions. Il est plus propre et plus sûr de garder les deux systèmes séparés.
* "Le problème, ce sont les webviews, pas le JS." car gemini divague en disant qu'une fonction loadTranslation est nécessaire parce que la WebView ne peut pas lire ces fichiers, mais les chaînes sont lues puis injectées par extension.js, ce qui est une norme. Réponse : Vous avez raison. Le problème est le contexte isolé de la webview. Notre extension.js doit servir de pont, en chargeant manuellement les traductions et en les "injectant" dans le HTML, car le système automatique de VS Code не peut pas atteindre l'intérieur de la webview.<br>
Pour moi, ce n'est pas une réponse. Je sais que extension.js lit le fichier puis l'injecte, ce que je veux savoir, c'est pourquoi une fonction explicite est nécessaire pour cela. Voir le premier point.
* "l10n ou i18n ?" Réponse : Mon erreur. Le dossier l10n était incorrect. La convention standard est i18n (Internationalization), et c'est ce que je vais utiliser maintenant.
* "Les clés de traduction doivent-elles avoir un point ?" Réponse : Non, ce n'est pas une exigence technique. Cependant, l'utilisation de points (par exemple, functions.search_placeholder) est une convention très répandue qui aide à organiser les chaînes en groupes logiques, rendant le code plus lisible.
* Pourquoi "l10n" doit-il être ajouté à package.json, alors que les autres non ?
* Les autres fichiers de traduction se trouvent dans un dossier, les fichiers nls non, ils doivent être à la racine du projet ! Créant de la confusion.

Donc, si vous voulez ajouter une nouvelle langue à l'extension, vous devrez créer de nombreux fichiers.<br>
Si vous voulez améliorer une traduction, vous devrez rechercher la chaîne dans plusieurs fichiers.<br>
Comme si les nombreux fichiers de documentation ne suffisaient pas, au moins ils sont tous dans le même dossier.

### Tester
Si vous voulez tester l'apparence de l'extension dans une autre langue :<br>
Ctrl + Maj + P pour ouvrir la *Palette de commandes* > `configure display language`<br>
Voilà, les commandes sont disponibles à la fois en version originale et traduite. Les options ne le sont pas.

L'activation des Outils de développement peut également être utile.

## package.json
`publisher` est un champ obligatoire qui devrait contenir mon ID sur la marketplace des extensions, mais jusqu'à ce que j'en crée un, et ce n'est pas prévu, il peut contenir n'importe quelle chaîne, du moins en théorie, en pratique, il se vexe si elle ne ressemble pas à un ID.<br>
Il compose le nom unique de l'extension.

`categories` indique où classer l'extension. Bien qu'il ne soit pas clair lesquelles elles sont.

`keywords` sert à saisir les mots-clés pour lesquels je veux que l'extension apparaisse.

`"commands"."command": "category-finder-view.focus"` devrait être géré automatiquement par VSC, et en fait je pense que j'ai laissé le bloc uniquement au cas où je voudrais ajouter des commandes à l'avenir.<br>
Cela devrait concerner le menu contextuel sur l'étiquette de l'extension et les commandes Maj+Ctrl+P.

# Compilation
Lancer
`vsce package`
à partir d'un terminal normal ouvert dans le dossier du projet. Cela ne semble pas fonctionner à partir du terminal de VSC.<br>
Il pourrait suggérer de mettre à jour vscode/vsce avec `npm install -g @vscode/vsce`. C'est étrange car VSC n'a pas signalé la présence de mises à jour.

## Gestion des fichiers
La compilation suggère de créer un bundle, car il y a beaucoup de fichiers, mais gemini suggère pour le moment d'ignorer le conseil, car je ne crée pas de bundle. Je suis confus.

Cependant, la compilation ne semble pas lire gitignore et inclut également certains fichiers inutiles dans l'extension. Il est donc nécessaire de créer un vscodeignore, qui indique quels fichiers exclure de la compilation.<br>
J'étais convaincu qu'il comprendrait de lui-même quoi inclure et quoi exclure de la compilation. Ou qu'il y avait un drapeau pour indiquer l'exclusion automatique.

## Compilation en ligne depuis github
Il devrait être possible d'effectuer automatiquement une compilation en ligne à chaque nouveau commit, mais je trouve cela excessif.<br>
Il faut créer un fichier .github/workflows/build.yml et y insérer, par rapport à ce qu'il est maintenant :
```
on:
push:				<-- Ceci activait la construction automatique
	branches:
	- main
workflow_dispatch:	<-- Ceci activait la construction manuelle
```

Ce que je peux supposer signifie compiler main lorsqu'un push a lieu sur main.

Pour compiler manuellement, à l'état actuel :

0. Allez sur la page de votre dépôt sur GitHub (GitLab ne semble pas être pris en charge).
0. Cliquez sur l'onglet Actions en haut.
0. Dans la colonne de gauche, cliquez sur le nom de votre workflow ("Build Extension", ou ce qui apparaît après "name:"). S'il n'apparaît pas, c'est que le chemin du fichier est incorrect.
0. Sur la droite, vous verrez une bannière bleue (ou grise) avec un bouton "Run workflow".
0. Cliquez sur Run workflow (puis sur le bouton vert de confirmation). Il devrait également être possible de choisir la branche.

GitHub démarrera la machine virtuelle, compilera l'extension et, après environ une minute, vous trouverez le fichier .vsix téléchargeable en bas dans la section Artifacts de l'exécution qui vient de se terminer. Pour obtenir cela, vous devez ouvrir le processus.

Un e-mail avec le résultat de la compilation arrivera également.

### Bogue de YAML
Voici une autre bonne raison de **détester** yaml !

**YAML interdit strictement l'utilisation des tabulations pour l'indentation**.

Vous devez utiliser **uniquement des espaces**.

Si vous utilisez une tabulation pour indenter, l'analyseur YAML renverra une erreur de syntaxe. C'est l'une des règles les plus strictes de la norme YAML pour garantir que le fichier est lu de la même manière sur n'importe quel système et éditeur (car leurs développeurs pensent que la largeur visuelle d'une tabulation peut varier, alors qu'un espace est toujours un espace, ce qui est manifestement faux : il est vrai que chaque éditeur peut attribuer une largeur différente en px à la tabulation, mais il attribue toujours la même à toutes, utiliser une tabulation aide plutôt à éviter des erreurs comme mettre 3 espaces au lieu de 2).

De plus, il semble être autorisé d'utiliser n'importe quel nombre d'espaces pour définir l'indentation.<br>
Considérez également que chaque éditeur peut avoir une taille de police différente, donc il apparaîtra différemment. Et il est possible qu'un développeur utilise Arial qui n'est pas à largeur fixe.

### Extension
VSC suggère d'installer l'extension *GitHub Actions*.

Elle devrait :
* Ajouter un bouton pour la compilation en ligne, mais cela nécessite une connexion supplémentaire, même si je devrais déjà être connecté au dépôt
* Cette extension offre IntelliSense (auto-complétion) spécifique aux fichiers GitHub Actions.
    * Elle vous suggère les bonnes clés (runs-on, steps, uses).
    * Elle vous marque en rouge si vous faites une erreur d'indentation avant de faire le commit.

### Abomination suprême
Bien que tout fonctionne parfaitement lors du test (F5), lorsque j'ai essayé de compiler, j'ai obtenu un nombre astronomique d'erreurs. Toutes liées à l'absence de chaînes de traduction. Mais il ne m'a pas donné immédiatement la liste complète : non, il commence d'abord à faire semblant d'essayer de compiler et ce n'est qu'à la fin qu'il m'indique, une par une, les chaînes manquantes. Tout cela parce que le système de traduction est tout simplement *stupéfiant*.