# WebView
🪲 Anche copiando in un file il codice messo in una WebView, non interpreta il CSS, una volta aperto in un browser. Ci ho provato in tutti i modi, perfino inserendo manualmente il riferimento al percorso del file, e addirittura copiando il CSS dentro un blocco Style. NON lo interpreta nel browser esterno!!!!
Probabilmente perchè usa variabili CSS specifiche di VSCode, ma non credo sia dovuto solo a quello.

🪲 Per di più non è neanche possibile ridefinire quelle variabili:
```
:root
{
	--vscode-editor-background: green;
}
```
non funziona!

🪲 Io davvero non capisco come funzionano quelle variabili!<br>
A quanto pare non esiste alcuna variabile che indica il colore del tema associato ai commenti. Così non è possibile associare alle funzioni commentate il colore dei commenti.

A proposito, ho trovato https://gist.github.com/estruyf/ba49203e1a7d6868e9320a4ea480c27a
Solo che i colori sono sbagliati, in effetti non credo sia ufficiale.
Ad esempio `--vscode-descriptionForeground` che esiste, e che ho usato in line-number, viene descritto come rgba(243, 239, 245, 0.7) che è biancastro, mentre in VSC appare azzurro, almeno col mio tema.

Ho trovato anche https://code.visualstudio.com/api/references/theme-color solo che:
* Non indica i nomi delle variabili, ma nomi di oggetti, quindi, ammesso che davvero siano i nomi delle variabili, vanno convertiti.
* Non indica il colore in base al tema scelto, che sarebbe utile almeno per i temi perdefiniti.

Ho trovato https://marketplace.visualstudio.com/items?itemName=xiaohuohumax.vscode-theme-css-variables ma ancora non mostra i colori.

# Impostazioni
🪲 Se nelle impostazioni posso definire un colore, non è possibile usare un color picker, come già richiesto in [Add color picker UI for settings with "format": "color" #245848](https://github.com/microsoft/vscode/issues/245848) e [setting UI: support color settings #106041](https://github.com/microsoft/vscode/issues/106041)

🪲 Bug di traduzione.<br>
La questione riguarda un comportamento standard dell'interfaccia delle Impostazioni di VS Code: l'editor cerca di essere "intelligente" e trasforma automaticamente la chiave tecnica (gestioneFunzioni.mostraNomiEstesi) in un titolo leggibile ("Gestione Funzioni: Mostra Nomi Estesi") separando le parole in base alle maiuscole (CamelCase) e ai punti.

Tuttavia, non è possibile tradurre la chiave stessa (l'ID dell'impostazione), perché quella deve rimanere identica per far funzionare il codice.

Questo comporta almeno questi problemi:

§ L' inglesata di mettere le maiuscole ovunque nei titoli

§ La visualizzazione di nomi non tradotti nelle versioni tradotte<br>
![impostazioni non tradotte](<impostazioni non tradotte.png>)<br>
Come puoi vedere, quella è la versione inglese ma alcuni nomi sono in italiano, perchè io programmo in italiano... anche se uso alcuni termini che hanno vagamente più senso in albionico.

Entrambi questi problemi sarebbero potuti venire risolti se VSC supportasse una stringa di traduzione anche per quelle etichette: sono supportate numerose voci, tra cui type, format, default, description, e probabilmente altre che ancora non conosco, potrebbero aggiungere "displayHead" in cui indicare la parte prima e dopo i due punti. Lasciando così l' ID non tradotto, ovviamente, ma sostituendolo con la stringa specificata in visualizzazione.

Del resto non è neanche possibile mettere un tooltip all' etichetta dell' estensione: c' è *title* (in package.json) che cerca di supplire, ma questo è solo il tooltip dell' icona, quando è visualizzato nella barra principale, quando la sposto nella barra secondaria viene direttamente visualizzato il title, su cui non è possibile mostrare un tooltip.

# Editor
🪲 Barra delle estensioni<br>
Supporta solo svg monocromatiche

🪲 La developer tool, oltre ad essere fluttuante senza stare sempre in primo piano, quando comincio a cliccare per disattivare delle regole CSS dopo un po' salta in alto, e devo continuamente scorrere in basso.

# Git
🪲 Oltre a numerosissimi altri problemi, l' estensione "Controllo del codice sorgente" indica in cima l' etichetta del ramo corrente, ma non indica quando quel ramo di è staccato dal genitore.

Quando cambio ramo, oltre ad elencarli in ordine assurdo e a non elencarli tutti e a volte neanche a trovarli, quando ad esempio passo al main, elenca sia il main locale che il main remoto, e la cosa confonde perchè dovrebbero essere sincronizzati, però non esplicitando se sono uguali viene il dubbio.