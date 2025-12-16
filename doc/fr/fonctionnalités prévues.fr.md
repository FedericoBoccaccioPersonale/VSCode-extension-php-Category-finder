Objectif : Lister les fonctions en fonction de @Category<br>
Puis j'ai découvert que les gens de PHP ont décidé, de manière trompeuse, de déprécier @Category en faveur de @package et @subpackage.

* Un bouton doit apparaître dans la barre des extensions, que l'utilisateur peut déplacer à un endroit plus approprié. Le bouton doit toujours être visible.
* Il doit contenir les onglets :
    * Toutes les fonctions : liste toutes les fonctions, c'est-à-dire les lignes contenant le mot fonction, la liste ne doit contenir que les noms des fonctions ; si un commentaire est présent avant la fonction, il doit rechercher la ligne contenant @Category et écrire ce qui suit @Category après le nom de la fonction. Le nom de la fonction doit être en gras.<br>
    Il doit y avoir un champ de recherche pour les noms de catégories.
    * Toutes les catégories : liste toutes les catégories, comme si elles étaient des éléments d'un arbre, en tant qu'enfant de chaque catégorie, il doit y avoir les noms des fonctions qui ont cette catégorie, donc chaque fonction peut appartenir à plusieurs catégories. Les fonctions "non classées" doivent être en bas, avec une entrée dédiée. À côté de chaque catégorie, il doit y avoir un compteur indiquant le nombre de fonctions qu'elle contient.<br>
    Il doit y avoir un champ de recherche pour le nom de la fonction et la catégorie.
    * Les fonctions trouvées doivent pouvoir être triées par nom (insensible à la casse) ou par numéro de ligne.
    * Un panneau doit apparaître qui n'est pas un fichier mais une chose distincte qui ne fait pas perdre le focus au fichier - ceci pour fonctionner mieux qu'une version précédente.

* Les catégories sont séparées par des virgules, donc lors de la recherche de catégories, vous devez utiliser la virgule comme séparateur, puis supprimer les espaces extérieurs avec trim.
* Dans les deux onglets, il doit y avoir un champ de recherche (fond bleu clair, personnalisable) qui filtre les fonctions ou les catégories et fonctions en fonction de l'onglet. À côté du compteur total d'éléments, il doit y avoir un compteur pour les éléments affichés. En d'autres termes, X sur Y.
* À côté de chaque nom de fonction, il doit également y avoir le numéro de ligne où il se trouve, suivi de `:` et du nom de la fonction. Le début du nom de la fonction doit toujours être aligné, le numéro de ligne doit être aligné à droite.
* Un double-clic sur un nom de fonction devrait déplacer l'éditeur vers celui-ci.

* Les champs de recherche doivent toujours être visibles, même en faisant défiler le panneau.
* Le nombre d'éléments doit être indiqué comme *Éléments affichés* sur *Éléments totaux*
* L'extension doit correspondre à la langue de l'interface.

* Les fonctions commentées doivent être mises en évidence différemment.
* Dans le cas des classes, les fonctions doivent être affichées comme nomClasse.nomFonction et doivent pouvoir être triées en tenant compte du nom de la classe ou uniquement du nom de la fonction.

* Il doit y avoir un menu déroulant avec :
    * comme premier élément "Fichier actuel", cela garantit que la liste des fonctions est mise à jour chaque fois qu'un fichier est sélectionné dans l'éditeur ;
    * les éléments suivants doivent être la liste de tous les fichiers ouverts.
    * le fichier actuel doit être mis en surbrillance, pour être trouvé plus facilement

    La liste doit être mise à jour lorsqu'un fichier est ouvert ou fermé.

* Lors du changement de fichier, si nécessaire, ne laissez pas l'ancienne liste de fonctions mais indiquez "traitement en cours" avec une image sans texte, ce qui permet d'économiser sur la traduction. Cette image doit également être affichée lors de la phase d'initialisation de l'extension.

# Idées abandonnées
Utiliser un bouton dans la barre d'état ou à côté des boutons en bas de la barre des fichiers ouverts.<br>
De plus, il n'est pas possible de changer la couleur du bouton dans la barre d'état.<br>
Ce bouton aurait également inclus un décompte du nombre total de fonctions.

Mettre en évidence si une fonction apparaît plusieurs fois dans un fichier, ce qui est assez inutile.

Dans le menu qui indique les fonctions de quel fichier lister, j'ai laissé de côté la liste de l'ensemble du dossier du projet, triée comme le ferait tree/f, car il pourrait y avoir trop de fichiers, et cela créerait de la confusion avec les fichiers ouverts, même en les mettant en surbrillance, car rien n'empêche d'ouvrir un dossier et quelques fichiers supplémentaires.

Comme deuxième élément du menu déroulant, insérer le nom du fichier actuel, afin qu'il puisse être facilement identifié. Remplacé par la mise en surbrillance.