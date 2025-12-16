# Documentazione: Category Finder V2 (Cerca per categoria)

Questa estensione per Visual Studio Code aiuta a navigare rapidamente tra le funzioni in un file php basandosi sul tag PHPDoc `@category`, ma anche su @package e @subpackage, che sono trattati alla stessa maniera.

Le categorie devono stare tutte sulla stessa riga, separate da virgola.

> Davvero non capisco come questa estensione non esiste già: dovrebbe essere una funzione standard integrata in VSC!

Funziona piuttosto bene, eccettuato per il codice commentato. Se non hai bisogno di leggere il codice nei commenti allora va bene.

> In effetti non capisco perchè qualcuno ha scritto che oggigiorno va di moda usare package piuttosto che category: sono due cose completamente differenti! Davvero c' è qualcuno che usa package per categorizare le funzioni all' interno dello stesso file?

## Come si usa

### Attivazione
- L'estensione aggiunge un' icona alla colonna delle estensioni di VS Code.
- Per iniziare, apri un file di codice php contenente delle funzioni e clicca sull'icona.

Probabilmente la barra laterale primaria è troppo piccola per mostrare il contenuto di questa estensione.<br>
A causa di una arbitraria e ingiustficabile limitazione di VS Code non è possibile aprire direttamente l' estensione della barra secondaria, che puoi espandere senza sovrapporti alle altre estensioni. Quindi se lo desideri dovrai spostarla a mano.<br>
![Spostare estensione](spostare%20estensione.png)
* Click col tasto destro sull' estensione che vuoi spostare
* "Sposta in"
* "Barra laterale secondaria" (o dove preferisci)

In questo modo occuperà lo stesso pannello di Copilot.
Per muoverla ancora, tasto destro sul titolo e poi Sposta in.

A questo punto l' etichetta visualizzata sarà "Category Finder" seguito dalla bandiera della lingua attiva (al netto della visualizzazione emoji del sistema operativo spiegato in <a href="bug di windows.it.md" target=_blank>Bug di Windows</a>) se invece la lingua di VSC non è tra quelle supportate dall' estensione apparirà un mappamondo e sarà in inglese.
<!-- Per ragioni incomprensibili, per questo link la sitassi markdown non funziona, così ho dovuto suare quella html. Il target non sempre funziona. -->

La cartella "Esempi" contiene alcuni file su cui fare le prove
* Action è tratto da https://github.com/zendframework/zf1/blob/master/library/Zend/Controller/Action.php
* Abstract è tratto da https://github.com/zendframework/zf1/blob/master/library/Zend/Db/Adapter/Abstract.php

Entrambi ho dovuto modificarli perchè sembra che su internet nessuno usi @Category o @package.<br>
Non ho idea di cosa facciano quei file, sono solo esempi per comprendere il funzionamento dell' estensione.

### Pannello di Navigazione
📎 Un doppio click su una funzione sposta il cursore dell' editor direttamente alla riga corrispondente.

Il pannello ha due tab principali per esplorare il codice.

Nelle Impostazioni puoi decidere se elencate anche le funzioni commentate, cioè contenute in un commento, in un colore differente, oppure se nasconderle.

#### Tab: Tutte le funzioni
Mostra tutte le funzioni identificate nel file. Ordinabili.

Per ogni funzione, vengono mostrati: numero di riga, nome (in grassetto) e le eventuali categorie associate.

- **Filtra per nome o categoria**: Un campo di ricerca permette di filtrare istantaneamente la lista per nome o categoria. È anche indicato quante funzioni sono attualmente visualizzate, X di Y.
- **Ordina per**: È possibile ordinare l' elenco per numero di **linea** o alfaberico per **nome** oppure per **nome completo** ovvero tenendo conto del percorso dell' estensione (ad esempio in che classe si trova, ma è anche possibile che una funzione si trovi dentro un' altra funzione o una enum).

#### Tab: Per categoria
Le funzioni vengono raggruppate sotto ogni categoria a cui appartengono. Le funzioni senza categoria sono raggruppate in "Senza categoria" (nome nel file di traduzione).<br>
Le categorie sono sempre elencate in ordine alfabetico. Al loro interno vengono elencate le funzioni che hanno quella categoria.<br>
Se una funzione ha più categorie appare in più gruppi.

Accanto a ogni funzione, vengono mostrate tutte le sue categorie. La categoria del gruppo corrente è evidenziata in coda con un colore diverso.

Accanto ad ogni titolo di categoria è presente un contatore del numero di funzioni X di Y, che si aggiorna durante il filtro.<br>
In cima è presente un contatore per il numero di categorie mostrate. Non è presente un contatore di funzioni perchè le funzioni con più categorie appaiono in più elenchi.

- **Filtra per nome categorie** e **Filtra per nome funzione**: Sono presenti due campi di ricerca: uno per filtrare i gruppi di categorie e uno per filtrare le funzioni al loro interno. Possono essere usati assieme.
- **Ordina per**: Anche in questa vista è possibile ordinare le funzioni all' interno di ogni categoria.

La ricerca-filtro viene effettuata sul nome visualizzato in quel momento.
* Se l'impostazione "Mostra nomi estesi" è attiva, la ricerca avviene sul nome completo (es. NomeClasse\nomeFunzione).
* Se l'impostazione è disattiva, la ricerca avviene solo sul nome breve (es. nomeFunzione), ignorando la classe.

### Selettore del file (menù a tendina)
L'estensione include un menù a tendina nella parte superiore del pannello, che offre un controllo su quale file analizzare.

#### Per l'utente
-   **File corrente**: Questa è l'  opzione predefinita. La lista delle funzioni si aggiornerà automaticamente per mostrare le funzioni contenute nel file su cui stai lavorando attivamente nell' editor.
-   **Lista dei file aperti**: Il resto del menù elenca tutti i file attualmente aperti nelle schede dell'editor, in ordine alfabetico. Puoi selezionarne uno per "fissare" la vista su quel file specifico, indipendentemente da quale file sia attivo.
-   **Evidenziazione**: Il file attualmente attivo nell'editor è evidenziato con un colore di sfondo nel menù, rendendolo facile da individuare.
-   **Navigazione intelligente**:
    -   Se fai doppio click su una funzione del **file attivo**, l' editor salterà direttamente a quella riga.
    -   Se fai doppio click su una funzione di un **file non attivo**, VS Code aprirà una finestra di anteprima ("Peek View") su quella funzione, senza cambiare il file principale su cui stai lavorando.

I file non ancora salvati sono esclusi. Tuttavia i file vengono letti aggiornati (per l' elencazione funzioni) anche se non salvati. Il file corrente viene analizzato anche se non è salvato.

#### Dettagli di implementazione della combo
- **Fonte dei dati**: Per garantire che l' elenco dei file sia sempre accurato, l' estensione legge le schede aperte tramite l'API `vscode.window.tabGroups.all`.
- **Gestione dello stato**: Una variabile interna (`_selectedFileUri`) tiene traccia della selezione dell' utente. Se è `null`, l' estensione segue il file attivo; altrimenti, utilizza l'URI del file selezionato.
- **Aggiornamenti dinamici**: L'estensione utilizza `vscode.window.tabGroups.onDidChangeTabs` per aggiornare il menù a tendina in tempo reale quando le schede vengono aperte, chiuse o spostate.
- **Caricamento asincrono**: Per evitare blocchi dell' interfaccia e gestire file non ancora caricati in memoria, la selezione di un file dal menù attiva una funzione `async`. Un immagine di "File in analisi..." viene mostrato immediatamente, mentre il documento viene caricato in background con `await vscode.workspace.openTextDocument()`. O così dovrebbe essere.
- **Anteprima (Peek View)**: La navigazione cross-file è implementata tramite il comando `editor.action.peekLocations`, a cui vengono passati l'URI del file e la posizione della funzione.

## Dettagli di implementazione dell' estensione
- **Linguaggio**: L'estensione è scritta in **JavaScript puro**, perchè TypeScript non funziona.
- **Interfaccia utente**: Il pannello è una WebView, il cui contenuto è generato dinamicamente come una stringa HTML. L'interattività (filtri, ordinamento, tab) è gestita da JavaScript eseguito all' interno della Webview stessa.
- **Comunicazione**: La navigazione per spostare il cursore tramite doppio click è implementata tramite eventi e messaggi.

### buildCategoryTree
Lo scopo di questa funzione è prendere una lista "piatta" di funzioni (un semplice array) e trasformarla in una struttura dati organizzata (un "albero" o, più precisamente, un raggruppamento) basata sulle loro @category. Inoltre, ordina queste categorie alfabeticamente, assicurandosi che le funzioni senza categoria appaiano per ultime.

**Cosa restituisce**
La funzione restituisce una Map di JavaScript con formato:

* Chiave (Key): Una string che rappresenta il nome della categoria.
* Valore (Value): Un array di oggetti. Ogni oggetto nell' array è l'oggetto funzione originale che appartiene a quella categoria. L'oggetto funzione ha la forma: { name: string, lineNumber: number, categories: string[] }.

**Esempio Pratico:**
Se l'input è una lista di funzioni come questa:

```json
[
	{ name: "getUser", lineNumber: 10, categories: ["Database", "API"] },
	{ name: "renderButton", lineNumber: 50, categories: ["UI"] },
	{ name: "helperFunc", lineNumber: 80, categories: [] },
	{ name: "fetchData", lineNumber: 120, categories: ["API"] }
]
```
L'output restituito da buildCategoryTree sarà una Map simile a questa:

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
	"Senza categoria" =>
	[
		{ name: "helperFunc", lineNumber: 80, categories: [] }
	]
}
```

**Come funziona**
1. Crea una Map vuota chiamata tree. Le Map js, che contrariamente alla filosofia di js sono classi e pure precostruite, sono una lista di oggetti chiave-valore che però mantengono l' ordinamento, contrariamente agli oggetti Map di ogni altro linguaggio che ho visto. Anche se in realtà anche altri linguaggi hanno gli iteratori, quindi non percepisco la differenza.
2. *Raggruppamento* La funzione scorre (forEach) ogni singolo oggetto func presente nell'array functions che ha ricevuto come input.
Per ogni funzione, controlla se ha delle categorie.
3. *Assegnazione* Dapprima assegna una categoria fittizia alle funzioni prive di categoria, dopo cicla su tutte al fine di assegnare quella funzione alle etichette corrispondenti alle categorie di cui fa parte.
4. *Ordinamento* Purtroppo gli ordinamenti delle mappe servono ben a poco, va quindi trasformata in array, ordinata tenendo conto del caso speciale *noCategoryLabel* che va in fondo, quindi riconvertito in mappa.

### Trovare le funzioni
La precedente versione usava espressioni regolari per trovare le righe alle quali si trova una funzione.<br>
Questo va bene fino a quando si tratta di analizzare librerie di funzioni senza classi o enum.

Per trovare ogni funzione dentro a cosa si trova (annidamento), per poter ad esempio evidenziare i toString delle enum e sapere che si trovano dentro una enum, che a sua volta può trovarsi dentro una classe, occorre usare lo stesso algoritmo che crea la breadcrumb di VSCode: **AST (Abstract Syntax Tree)**, e su una tecnica di ricerca chiamata **Hit Testing (test di collisione)**.

Il processo di **costruzione di un AST** si divide in due fasi distinte: Lexing (Tokenizzazione) e Parsing (Analisi Grammaticale).

#### Fase A: Il Lexer (lo scanner)
Il Lexer legge il file carattere per carattere e raggruppa i caratteri in "parole" conosciute chiamate Token. Non capisce il significato, sa solo "etichettare" i pezzi.

* Input: `function pippo() { }`
* Output del Lexer:
	1. T_FUNCTION (start: 0, end: 8, line: 1)
	0. T_WHITESPACE (" ")
	0. T_STRING ("pippo", start: 9, end: 14)
	0. T_OPEN_PAREN ("(")
	0. T_CLOSE_PAREN (")")
	0. ...

Conta semplicemente i caratteri dall'inizio del file (offset).

#### Fase B: Il Parser (la grammatica)
Qui avviene la magia. Il Parser prende la lista di token e applica delle regole grammaticali.

L'algoritmo per capire dove inizia e finisce un nodo (es. una funzione)
1. **Lookahead (Guardare avanti)**: Il parser incontra il token T_FUNCTION. Sa che sta iniziando una dichiarazione di funzione. Registra la sua posizione di partenza
0. **Consumo**: Si aspetta (secondo la grammatica PHP) un nome, poi parentesi, poi un blocco di codice { ... }
0. **Annidamento**: Quando incontra la graffa aperta `{`, entra in modalità "blocco". Continua a *mangiare* token. Se trova un' altra graffa `{` (es. un if dentro la funzione), scende di un livello. Se trova `}`, risale.
0. **Chiusura**: Quando trova la graffa chiusa `}` che corrisponde a quella aperta della funzione, dichiara il nodo "completo", segnandosi la posizione.

Il risultato è un oggetto (Nodo) che dice: "Sono una FunctionDeclaration, contengo questi figli, inizio a riga X e finisco a riga Y".

#### (pessima) Soluzione
Usare la libreria standard "de facto" php-parser (creata da glayzzle). È quella usata da strumenti come Prettier per formattare il PHP.

Da istallare lanciando `npm install php-parser` da terminale cmd nella cartella del progetto. Da VSC non funziona.

> Questo tuttavia ha **massacrato** il mio povero file package.json. Anche se dovrebbe aver solo aggiunto
> ```
> "dependencies":
> {
>	"php-parser": "^3.2.5"
> }
> ```

Anche se ho poi scoperto che la libreria ha delle dipendenze e, a quanto pare, devo essere io a memorizzare nel mio package la lista completa delle dipendenze piuttosto che ereditare a cascata tutte le dipendenze fissate dal loro package.

Occorre inoltre modificare il gitignore aggiungendo `node_modules/`, mi chiedo come non lo abbia aggiunto in automatico.<br>
Ha anche aggiunto package-lock.json, che garantisce che tutto funzioni.

**Importante:** Quando scarichi questo progetto dovrai lanciare `npm install`.<br>
Per aggiornare la versione, che invece è bloccata, occorre `npm update`, dovrebbe essere possibile specificare quale specifica libreria istallare, nel caso ce ne fosse più di una.

---

Questa soluzione ha però un problema: i commenti vengono classificati come commenti e quindi ignorati.<br>
Perciò andrò in ricorsione dentro ai commenti, agganciando quel nodo come figlio del commento, aggiungendo un nuovo campo all' oggetto restituito che indica che si tratta di un commento.

L' oggetto restituito sarà un albero di:
```
name: functionName, 
lineNumber: lineNumber,	// VS Code API usa 1-based per la visualizzazione
line: lineNumber,
endLine: lineNumber,
categories: categories,
type: type,				// 'function' o 'method'
isInComment: isCommented
```
> Io vorrei capire come la tabulazione in VSC sia diversa da come appare nell' anteprima web

Questo è tutto molto meraviglioso in teoria, ma non è quanto implementato nella funzione parseFunctions, che ho desistito dal cercare di comprendere.

Purtroppo il parser è **buggato** e non interpreta correttamente i commenti.

### Leggi anche
[Stramberie delle estensioni](stramberie%20delle%20estensioni.it.md).

## NPM
Una guida introduttiva, in italiano è su https://kinsta.com/it/blog/cos-e-npm/, preservato (male) in https://web.archive.org/web/20251121094837/https://kinsta.com/it/blog/cos-e-npm/

Questo progetto utilizza **NPM** (Node Package Manager) per gestire le librerie esterne necessarie al funzionamento dell'estensione (come `php-parser` per l'analisi del codice) e gli strumenti di sviluppo (come `vsce` per creare il pacchetto finale).

### Perché usiamo NPM invece di scaricare le librerie a mano?
NPM offre vantaggi critici per lo sviluppo moderno:

1.  **Gestione dell'Albero delle Dipendenze (Il vantaggio principale):**
    Le librerie moderne spesso dipendono da *altre* librerie per funzionare.
      * *Metodo Manuale:* Dovresti scaricare la libreria A, scoprire che le serve la libreria B, scaricare la B, scoprire che serve la C... un incubo di gestione manuale.
      * *Con NPM:* NPM calcola automaticamente tutto l'albero. Se installi `php-parser`, lui scarica automaticamente anche tutte le sotto-librerie necessarie senza che tu debba fare nulla.
2.  **Repository Leggero e Pulito:**
    Il codice delle librerie esterne è pesante (centinaia di file).
      * *Metodo Manuale:* Saresti costretto a caricare tutti questi file inutili nel tuo sistema di versionamento (Git), appesantendo il progetto.
      * *Con NPM:* Il codice delle librerie **non viene committato**. Nel progetto salviamo solo un "elenco della spesa" (`package.json`). Chiunque scarichi il progetto lancerà un comando e NPM scaricherà i file freschi in quel momento.
	  * Problema: Questo rende succubi del fatto che le librerie di terzi continueranno ad esistere.
3.  **Versionamento Sicuro (`package-lock.json`):**
    NPM genera un file chiamato `package-lock.json`. Questo file "congela" le versioni di ogni singola libreria installata. Questo garantisce che se il progetto funziona sul tuo computer oggi, funzionerà identico sul computer di un altro sviluppatore tra un anno, evitando il problema "ma sul mio pc funzionava".
4.  **Aggiornamenti Semplificati:**
    Per aggiornare una libreria alla nuova versione, basta digitare `npm update`. Farlo a mano richiederebbe di riscaricare, scompattare e sovrascrivere i file manualmente, con alto rischio di errori.

### Come Installare NPM

NPM è incluso automaticamente all'interno di **Node.js**. Non devi installarlo separatamente.

1.  Vai sul sito ufficiale: [nodejs.org](https://nodejs.org/)
2.  Scarica la versione indicata come **LTS** (Long Term Support).
3.  Esegui l'installazione standard (Avanti, Avanti, Fine).

Per verificare che sia installato correttamente, apri un terminale (Prompt dei comandi o PowerShell) e digita:

```bash
node -v
npm -v
```

Se vedi dei numeri di versione (es. `v20.x.x`), sei pronto.

### Come Inizializzare il Progetto

Una volta scaricato questo progetto sul tuo computer, la cartella delle librerie (`node_modules`) non sarà presente (perché, come spiegato sopra, non viene salvata su Git).

Per scaricare tutte le dipendenze necessarie in un colpo solo:

1.  Apri il terminale nella cartella del progetto.
2.  Lancia il comando:
    ```bash
    npm install
    ```

NPM leggerà il file `package.json`, scaricherà `php-parser` e tutti gli altri strumenti necessari, e creerà automaticamente la cartella `node_modules`. Ora sei pronto per premere `F5` e avviare l'estensione.

Con questo dovresti essere in grado di eseguire il progetto.

## Come Contribuire
Questo progetto è aperto a contributi. Se desideri suggerire nuove funzionalità o partecipare allo sviluppo, sei il benvenuto. Apri una issue o una pull request sul repository del progetto su GitHub, se possibile. Ricorda di aggiornare la documentazione quando apporti delle modifiche, possibilmente almeno nella tua lingua e in inglese, lasciando un segnaposto nelle altre lingue che indica l' assenza.

A quanto pare il mio stile di sintassi si avvicina all' *Allman*, anche se differisce per i blocchi monoriga, quindi ti invito a seguirlo. Un nome più appropriato sembra non esistere ancora, quindi lo posso definire come "Allman con omissione delle graffe per istruzioni singole, che se sono abbastanza corte non vanno a capo, tuttavia se le istruzioni singole contengono altre istruzioni possono stare in un blocco, ma tenedo conto delle simmetria negli if/else". Sentiti libero di scrivere i commenti e i nomi delle funzioni in inglese, se preferisci.

Ti prego solo di specificare se, in caso di uso di IA, hai accuratamente controllato che il codice generato abbia senso, oltre ovviamente a controllare che funzioni correttamente. E che non siano state tolte funzionalità, per questo fai riferimento anche a [Funzionalità previste](<funzionalità previste.it.md>).

### parseFunctions
A questo punto, **mi arrendo**, dichiaro la mia resa!<br>
Tanto per cominciare qui ridichiaro che è **sbagliato** che debba essere io a scrivere questa funzione. Il mio campo è scrivere programmi, non estensioni di supporto per scrivere programmi che dovrebbero far parte degli IDE come standard!!!!

La parseFunctions attuale nella region 3 non ho idea di come faccia a funzionare, e sono anche certo che è sbagliata perchè:
* usa le regex piuttosto che andare in ricorsione passando il commento al parser stesso, che a questo punto so essere buggato perchè non è in grado di ignorare gli errori tipici del codice commentato
* usa sintassi contorte come le funzioni anonime nelle costanti o passate come argomento

Come dicevo più sopra, dovrebbe entrare in ricorsione e non usare regex!!!!

La prima cosa da modificare quindi è risolvere che per i commenti non inserisce il percorso reale (che nno sempre esiste). E in generale la corretta gestione dei commenti, che manca del tutto.

### È eterno a partire
La mia idea era di far apparire la lente (corretta) contenuta nella cartella webview immediatamente al caricamento di VSC e al cambio di file, in pratica durante l' analisi del file. Ma non sembra essere possibile: tutti i tentativi si sono rivelati degli epici fallimenti in cui prima il pannello appare grigio per una frazione di secondo, poi parte l' elaborazione con una barra blu nella parte superiore, poi (inutilmente) appare la gif e poi l' elenco funzioni.<br>
Ovviamente, non ha senso.<br>
Il problema dovrebbe essere dovuto al fatto che la lettura del file corrente, e dell' elenco di file, è molto lunga, e l' html viene generato solo alla fine di ciò.<br>
Io non ne sono così sicuro, perchè cambiando file ci mette molto meno di un secondo, anche quando il file è lungo. Ed elencare i file non può volerci una vita se sono meno di 10.

> Ed ecco altri due bug:<br>
> * Bug di VSC: Affidarsi a JS che è un **pessimo** linguaggio.
> * Bug di JS: Non esiste un' istruzione per forzare il rendering immediatamente.
> * Vedi anche https://federicoboccaccio.wordpress.com/2025/08/05/bug-di-vs-code/ e https://federicoboccaccio.wordpress.com/2025/07/11/quello-che-odio-di-js/ (in italiano)

### (Altri) Possibili (ma poco probabili) miglioramenti
* Un menù contestuale nell' Esplora risorse per impostare quel file come da visualizzare nell' estensione.
* Personalizzazione di tutti i colori.
* Opzione per decidere cosa fare quando si fa doppio click su una funzione, nel caso la funzione sia in un file a parte o nel file corrente. Tra: "salta alla funzione in quel file", "mostra nel punto corrente come se fosse un click su 'reference'", "chiedi ogni volta tra queste opzioni", "personalizza azione in base alla pressione di Alt o Ctrl", "menù contestuale sulle funzioni per scegliere".
* Menù contestuale sul nome funzione, per avere una seconda via per accedere alla funzione, dato che il click funziona una volta su due, ma anche una voce per copiare il testo: nome funzione, nome completamente qualificato (comprensivo di classe), il numero di riga, il `li` completo.
* Tooltip col nome e percorso completo di una funzione, utile per quando viene mostrato solo il nome senza percorso. Mostrare anche tooltip con commento `/**` completo.
* Opzione (chk) per indicare su cosa lavorare tra category, package e subpackage.
* Migliorare il filtro-ricerca facendo scegliere se cercare come è ora, se cercare sempre solo per nome funzione o sempre nel nome completo. Valutare anche le espressioni regolari.

Nella prossima versione, eliminare le funzioni non in uso.