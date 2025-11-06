# Documentation : Chercheur de Catégories

Cette extension pour Visual Studio Code aide à naviguer rapidement parmi les fonctions d'un fichier en se basant sur le tag PHPDoc `@category`.

## Fonctionnalités Disponibles

### 1. Panneau de Navigation
En cliquant sur le bouton **"Chercher @category"** dans la barre de titre de l'éditeur, un panneau latéral s'ouvre et analyse le fichier actuel.

### 2. Onglet : Toutes les fonctions
- **Liste Complète**: Affiche toutes les fonctions identifiées dans le fichier.
- **Affichage**: Pour chaque fonction, il montre : le numéro de ligne, le nom (en gras) et les catégories associées.
- **Filtre**: Un champ de recherche permet de filtrer instantanément la liste par nom ou par catégorie.
- **Tri**: La liste peut être triée par numéro de ligne ou par nom (alphabétiquement).
- **Navigation**: Un double-clic sur une fonction déplace le curseur de l'éditeur directement à la ligne correspondante.

### 3. Onglet : Toutes les catégories
- **Vue Groupée**: Les fonctions sont regroupées sous chaque catégorie à laquelle elles appartiennent. Les fonctions sans catégorie sont regroupées sous "Sans catégorie".
- **Filtres Multiples**: Deux champs de recherche fonctionnent ensemble : un pour filtrer les groupes de catégories et un pour filtrer les fonctions à l'intérieur de ceux-ci.
- **Affichage Détaillé**: À côté de chaque fonction, toutes ses catégories sont affichées. La catégorie du groupe actuel est surlignée d'une couleur différente.
- **Compteurs**: Un compteur de fonctions est présent à côté de chaque titre de catégorie. Un compteur général indique les catégories filtrées par rapport au total.
- **Tri et Navigation**: Dans cette vue, il est également possible de trier les fonctions au sein de chaque catégorie et de naviguer par double-clic.

## Détails d'Implémentation
L'extension est écrite en **JavaScript pur** et s'intègre à VS Code via ses API natives.
- **Analyse du Code**: Le contenu du fichier actif est analysé à l'aide d'expressions régulières pour identifier les déclarations de fonction. Pour chaque fonction trouvée, le code effectue une analyse ascendante pour trouver le bloc de commentaires PHPDoc et extraire le tag `@category`.
- **Interface Utilisateur**: Le panneau est une **Webview** de VS Code, dont le contenu est généré dynamiquement sous la forme d'une seule chaîne HTML. L'interactivité (filtres, tri, onglets) est gérée par du JavaScript exécuté à l'intérieur de la Webview.
- **Communication**: La navigation par double-clic est mise en œuvre en envoyant un message (`postMessage`) de la Webview à l'extension principale, qui utilise ensuite l'API de VS Code pour déplacer le curseur.
- **Internationalisation**: Les chaînes statiques de l'interface VS Code (par ex. les infobulles) sont gérées via le système `l10n`. **Les chaînes dynamiques dans la Webview sont chargées à partir de fichiers externes (`en.json`, `it.json`, `fr.json`) situés dans un dossier `l10n` dédié, ce qui rend le code plus propre et les traductions faciles à modifier.**

## Problèmes Connus et Modifications non Implémentées
Lors du développement, certaines difficultés ont été rencontrées et les fonctionnalités demandées suivantes n'ont pas été implémentées avec succès :
1.  **Fiabilité du Double-Clic**: Il a été signalé que la fonctionnalité de navigation par double-clic n'est pas toujours fiable.
2.  **Compteurs de Catégories**: Le compteur dans l'onglet des catégories ne se met pas à jour correctement pour afficher le format "X sur Y" lors du filtrage.
3.  **Traduction** : les fichiers dans l10n ne sont pas lus et le bouton n'affiche pas la chaîne traduite, mais le paramètre.

