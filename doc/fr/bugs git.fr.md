# Compiler avec les Actions
La compilation de l'extension fonctionne parfaitement en local. Ce qui est en fait étrange. Bien que seulement depuis le terminal et non depuis VSC.

GitHub, par contre, malgré le yaml formellement correct, refuse de fonctionner.
En ajoutant `--log-level debug` il a daigné m'informer que le code généré par gemini était erroné, car node-version doit être 20 et non 18. Je me demande pourquoi gemini continue de donner des informations incorrectes.

Après cela, cependant, il a généré une erreur qui, selon gemini, informe que le niveau de log n'est pas pris en charge. Mais cela n'a aucun sens.
* D'abord, il a généré un journal, incompréhensible, mais utile à gemini.
* Il a également généré un journal après avoir modifié la version de node. Un journal qui informe en fait que ce paramètre n'est pas pris en charge. Par conséquent, ils ont supprimé un paramètre.

Après avoir supprimé ce paramètre, il a compilé de manière surprenante. Le fichier généré en ligne est légèrement plus petit que celui hors ligne. Ceci est dû au bogue de GitHub qui convertit les fins de ligne sans consentement.<br>
Pour mémoire, la seule façon de l'éviter est d'effectuer une copie binaire des fichiers, mais cela fait perdre le gestionnaire de différences ligne par ligne, comme je l'ai déjà documenté sur https://federicoboccaccio.wordpress.com/penny-backup/ (en italien)