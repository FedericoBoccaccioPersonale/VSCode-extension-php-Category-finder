# WebView
🪲 Même en copiant dans un fichier le code placé dans une WebView, il n'interprète pas le CSS, une fois ouvert dans un navigateur. J'ai tout essayé, même en insérant manuellement la référence au chemin du fichier, et même en copiant le CSS dans un bloc Style. Il ne l'interprète PAS dans le navigateur externe !!!!
Probablement parce qu'il utilise des variables CSS spécifiques à VSCode, mais je ne pense pas que ce soit uniquement dû à cela.

🪲 De plus, il n'est même pas possible de redéfinir ces variables :
```
:root
{
	--vscode-editor-background: green;
}
```
ne fonctionne pas !

🪲 Je ne comprends vraiment pas comment fonctionnent ces variables !<br>
Apparemment, il n'existe aucune variable qui indique la couleur du thème associé aux commentaires. Il n'est donc pas possible d'associer aux fonctions commentées la couleur des commentaires.

À propos, j'ai trouvé https://gist.github.com/estruyf/ba49203e1a7d6868e9320a4ea480c27a
Seulement, les couleurs sont fausses, en fait je ne pense pas que ce soit officiel.
Par exemple, `--vscode-descriptionForeground` qui existe, et que j'ai utilisé dans line-number, est décrit comme rgba(243, 239, 245, 0.7) qui est blanchâtre, alors que dans VSC il apparaît bleu, du moins avec mon thème.

J'ai aussi trouvé https://code.visualstudio.com/api/references/theme-color seulement que :
* Il n'indique pas les noms des variables, mais des noms d'objets, donc, en supposant que ce soient bien les noms des variables, ils doivent être convertis.
* Il n'indique pas la couleur en fonction du thème choisi, ce qui serait utile au moins pour les thèmes par défaut.

J'ai trouvé https://marketplace.visualstudio.com/items?itemName=xiaohuohumax.vscode-theme-css-variables mais il ne montre toujours pas les couleurs.

# Paramètres
🪲 Si dans les paramètres je peux définir une couleur, il n'est pas possible d'utiliser un sélecteur de couleur, comme déjà demandé dans [Add color picker UI for settings with "format": "color" #245848](https://github.com/microsoft/vscode/issues/245848) et [setting UI: support color settings #106041](https://github.com/microsoft/vscode/issues/106041)

🪲 Bug de traduction.<br>
La question concerne un comportement standard de l'interface des paramètres de VS Code : l'éditeur essaie d'être "intelligent" et transforme automatiquement la clé technique (gestioneFunzioni.mostraNomiEstesi) en un titre lisible ("Gestione Funzioni: Mostra Nomi Estesi") en séparant les mots en fonction des majuscules (CamelCase) et des points.

Cependant, il n'est pas possible de traduire la clé elle-même (l'ID du paramètre), car celle-ci doit rester identique pour que le code fonctionne.

Cela entraîne au moins ces problèmes :

§ L'anglicisme de mettre des majuscules partout dans les titres

§ L'affichage de noms non traduits dans les versions traduites<br>
![paramètres non traduits](<../it/impostazioni non tradotte.png>)<br>
Comme vous pouvez le voir, c'est la version anglaise mais certains noms sont en italien, parce que je programme en italien... même si j'utilise certains termes qui ont vaguement plus de sens en anglais.

Ces deux problèmes auraient pu être résolus si VSC prenait en charge une chaîne de traduction également pour ces étiquettes : de nombreuses entrées sont prises en charge, notamment type, format, default, description, et probablement d'autres que je ne connais pas encore, ils pourraient ajouter "displayHead" dans lequel indiquer la partie avant et après les deux-points. Laissant ainsi l'ID non traduit, évidemment, mais en le remplaçant par la chaîne spécifiée dans l'affichage.

De plus, il n'est même pas possible de mettre une infobulle sur l'étiquette de l'extension : il y a *title* (dans package.json) qui essaie de suppléer, mais ce n'est que l'infobulle de l'icône, lorsqu'elle est affichée dans la barre principale, lorsque je la déplace dans la barre secondaire, le titre est directement affiché, sur lequel il n'est pas possible d'afficher une infobulle.

# Éditeur
🪲 Barre des extensions<br>
Ne prend en charge que les svg monochromes

🪲 L'outil de développement, en plus d'être flottant sans rester toujours au premier plan, lorsque je commence à cliquer pour désactiver des règles CSS, après un certain temps, il saute vers le haut, et je dois continuellement faire défiler vers le bas.

# Git
🪲 En plus de nombreux autres problèmes, l'extension "Contrôle du code source" indique en haut l'étiquette de la branche actuelle, mais n'indique pas quand cette branche s'est détachée de son parent.

Quand je change de branche, en plus de les lister dans un ordre absurde et de ne pas toutes les lister et parfois même de ne pas les trouver, quand par exemple je passe à main, il liste à la fois le main local et le main distant, et cela prête à confusion car ils devraient être synchronisés, mais comme il n'est pas explicitement indiqué s'ils sont identiques, le doute s'installe.