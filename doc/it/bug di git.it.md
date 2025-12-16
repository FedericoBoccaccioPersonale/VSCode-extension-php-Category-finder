# Compilare con le Action
La compilazione dell' estensione funziona perfettamente in locale. Che in effetti è strano. Anche se solo da terminale e non da VSC.

GitHub, invece, nonostante lo yaml formalmente corretto, rifiuta di funzionare.
Aggiungendo `--log-level debug` si è degnato di informarmi che il codice generato da gemini era sbagliato, perchè node-version deve essere 20 e non 18. Mi chiedo perchè gemini continui a dare informazioni errate.

Dopo di questo, invece, ha generato un errore che, secondo gemini, informa che log level non è supportato. Ma non ha alcun senso.
* Prima ha generato un log, incomprensibile, ma utile a gemini.
* Ha generato un log anche dopo aver modificato node version. Un log che in effetti informa che quel parametro non è supportato. Di conseguenza hanno tolto un parametro.

Dopo aver tolto quel parametro, ha stupefacentemente compilato. Il file generato on line è lievemente più piccolo di quello offline. Questo a causa del bug di GitHub che converte i delimitatori di riga senza consenso.<br>
Per la cronaca, l' unico modo per evitarlo è di eseguire una copia binaria dei file, solo che questo fa perdere il gestore delle differenze per riga, come ho già documentato in https://federicoboccaccio.wordpress.com/penny-backup/ (in italiano)