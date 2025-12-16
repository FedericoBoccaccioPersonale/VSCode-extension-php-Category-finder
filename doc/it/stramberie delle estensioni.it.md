## activate
### Registrazione della classe
La riga: `context.subscriptions.push(vscode.window.registerWebviewViewProvider("category-finder-view", provider));`

**Registra il "cervello" della vista:**

* `vscode.window.registerWebviewViewProvider(...)` è la funzione che dice a Visual Studio Code: "Quando l'utente vuole visualizzare il pannello con l'ID "category-finder-view", usa la logica contenuta nell'oggetto provider per crearlo e gestirlo".
* "category-finder-view" è l'identificativo (ID) della vista, che deve corrispondere esattamente a quello che hai definito nel file package.json.
* provider è l'istanza della classe `CategoryViewProvider`, che contiene il codice per generare l' HTML e gestire i messaggi provenienti dalla webview.

**Gestisce il ciclo di vita dell'estensione:**

* `context.subscriptions.push(...)` è un meccanismo di pulizia. Una lista di "cose da spegnere" quando l'estensione non è più necessaria.
* Quando registri la vista, VS Code restituisce un oggetto "usa e getta" (un Disposable). Aggiungendolo a questa lista, ti assicuri che, quando l' utente disattiva l' estensione o chiude VS Code, la registrazione della tua vista venga annullata correttamente. Questo previene memory leak (perdite di memoria) e assicura che la tua estensione si comporti bene all' interno dell' editor.

### Altre registrazioni
Ci sono 3 `context.subscriptions.push` e volendo potrebbero essere registrate nella stessa istruzione, ma tenendone 3 separate dovrebbe essere più facile la lettura del codice.

**vscode.window.onDidChangeActiveTextEditor** Dovrebbe essere la funzione che si attiva quando viene cambiata la scheda attiva nell' editor, e di conseguenza chiama la funzione da eseguire quando viene cambiata la scheda.

**vscode.workspace.onDidSaveTextDocument** Viene chiamata al salvataggio di un documento.

Questa estensione è progettata per aggiornare la lista in occasione di questi due eventi.

## resolveWebviewView
Questa funzione viene chiamata in automatico e si occupa di configurare il WebView mostrato nella barra laterale.

* Salva un riferimento alla vista (this._view = webviewView).
* Imposta le opzioni necessarie.
* Registra il gestore per i messaggi provenienti dalla webview (`onDidReceiveMessage`).
* Chiama this.update() per la prima volta per caricare il contenuto iniziale.

## Opzioni
Le impostazioni dell' estensione vanno definite nel package.json, come figli di *contributes*.

Per leggerle occorre
```
const config = vscode.workspace.getConfiguration('categoryFinder');
const bgColor = config.get('backgroundColor');
```

### Come funzionano le chiavi di configurazione in VS Code
- In `package.json` dell’estensione, le **chiavi di configurazione** sono definite dentro `"contributes.configuration.properties"`.
- Ogni chiave ha un **namespace** (prefisso) e un nome.  
Esempio: `"categoryFinder.backgroundColor"`  
- `categoryFinder` → è il **namespace** (o sezione di configurazione), quindi non deve coincidere col package name (ma non è vietato).  
- `backgroundColor` → è la proprietà dentro quel namespace.

### Perché si scrive con il punto
Il punto (`.`) non è un operatore arbitrario: è la convenzione di VS Code per separare **namespace** e **chiave**.  
- `"categoryFinder.backgroundColor"` è una singola chiave di configurazione.  
- Quando fai `vscode.workspace.getConfiguration('categoryFinder')`, stai dicendo: "dammi tutte le impostazioni sotto il namespace `categoryFinder`".  
- Poi con `.get('backgroundColor')` accedi alla proprietà specifica.

Se invece scrivessi direttamente:

```js
const bgColor = vscode.workspace.getConfiguration().get('categoryFinder.backgroundColor');
```

funzionerebbe lo stesso, perché stai leggendo la chiave completa.<br>
Ma la forma con `getConfiguration('categoryFinder')` è più ordinata e modulare:  
- Ti permette di leggere più valori dello stesso gruppo senza ripetere il prefisso.  
- Mantiene chiaro che tutte le opzioni appartengono a un "blocco" (`categoryFinder`).

### In sintesi
- **Separarle**: perché VS Code gestisce le configurazioni come oggetti annidati (`namespace → proprietà`).  
- **Il punto**: è la sintassi per definire chiavi con namespace.  
- **Alternative**: puoi leggere direttamente `"categoryFinder.backgroundColor"` in un’unica istruzione, ma usare `getConfiguration('categoryFinder')` è più pulito e scalabile.

### Non esiste un elenco
Dopo un' ora di ricerca e aver scomodato sia copilot che gemini posso affermare senza timore di smentita che non esiste un elenco di tutti i tipi e formati disponibili. Per i type esiste l' intellisense, per il format no, a meno che il format non sia un invenzione dell' IA, che se solo fosse un po' più intelligente riuscirbbe a rispondere "roger-roger".<br>
Le enum non sono comprese. Eppure altre impostazioni mostrano delle combo.

Inoltre trovo davvero scomodo dover virgolettare tutto. Oltre ad essere scomodo, impedisce la rinominazione intelligente e l' intellisense col get.

## Traduzioni
Alla fine mi sono arreso al tentativo di capire come funzionano le traduzioni, in particolare del perchè di alcune scelte a dir poco bizzarre.

Già il fatto stesso che esistano *i18n* (internazionalizzazione) e *L10N* (localizzazione) come standard per i nomi delle cartelle crea confusione. Anche se si può affermare che siano due cose diverse, dal punto di vista della programmazione si tratta sempre di tradurre il programma, e quindi di avere un' insieme di stringhe in più lingue.

### Perchè ci sono vari gruppi di file di traduzione
C'è una ragione tecnica precisa per questa separazione. I due gruppi di file servono a due scopi diversi e vengono letti da due "entità" diverse:

1.  **I file "Bundle" (`l10n\bundle.l10n.it.json`, ecc.)**
    * **A cosa servono:** Traducono l'interfaccia "statica" di VS Code, ovvero tutto ciò che è definito nel file `package.json` (il titolo dell'estensione, la descrizione, i titoli dei comandi, le voci dei menu, le impostazioni).
    * **Cosa li legge:** Vengono letti direttamente da **Visual Studio Code** all' avvio dell'estensione.
    * **Perché questo nome:** VS Code richiede specificamente questa convenzione di nomenclatura (`bundle.l10n.<lingua>.json`) quando si usa la proprietà `"l10n": "./l10n"` nel `package.json`. Se non li chiami così, VS Code non tradurrà i comandi e i menu.
	* **Tuttavia** anche i file nella root `package.nls.*.json` fanno questo. E quello senza lingua viene caricato nel momento in cui la lingua di VSC non è disponibile. Infatti ho lasciato l10n in questa versione, ma in pratica non dovrebbero essere necessari.
2.  **I file semplici (`l10n\it.json`, `l10n\en.json`, ecc.)**
    * **A cosa servono:** Traducono l'interfaccia "dinamica" interna al tuo pannello (le tab, i pulsanti HTML, le etichette dentro la WebView).
    * **Cosa li legge:** Vengono letti dal **codice JavaScript** (`extension.js`).
    * **Perché sono separati:** Nel codice (`extension.js`), la funzione `loadTranslations` è programmata per cercare file chiamati esattamente `it.json`, `en.json`, ecc. Anche se tecnicamente potresti scrivere un codice più complesso per fargli leggere i "bundle", averli separati è spesso più pulito: un set è per "fuori" (VS Code), l'altro è per "dentro" (l' estensione').
3.	Anche i file dentro a i18n dovrebbero essere quelli letti dalla funzione di traduzione.

Detto altrimenti, è una scelta discutibile.

E se per qualche ragione devi citare nel programma un termine dell' interfaccia, devi replicare la stringa.

Quello che non capisco:
* Se i file dell' interfaccia, i *bundle* e i *nls* vengono letti in automatico, perchè non vengono letti e sostituiti in automatico anche gli altri, considerato che seguono quello che dovrebbe essere uno standard?
* "Non posso dire a loadTranslations di leggere i file nls?" Risposta: Tecnicamente sì, ma è una cattiva pratica. I file nls sono riservati al sistema automatico di VS Code per package.json. Mescolare le stringhe della webview creerebbe confusione e andrebbe contro le convenzioni. È più pulito e sicuro tenere i due sistemi separati.
* "Il problema sono le webview, non il JS." perchè gemini farnetica che è necessaria una funzione loadTranslation perchè il WebView non riesce a leggere quei file, ma le stringhe vengono lette e poi iniettate da extension.js, che è uno standard. Risposta: Hai ragione. Il problema è il contesto isolato della webview. Il nostro extension.js deve agire da ponte, caricando manualmente le traduzioni e "iniettandole" nell'HTML, perché il sistema automatico di VS Code non può raggiungere l'interno della webview.<br>
Questa per me non è una risposta. Lo so da me che extension.js legge il file e poi lo inietta, quello che voglio sapere è perchè serve una funzione esplicita per questo. Vedi primo punto.
* "l10n o i18n?" Risposta: Errore mio. La cartella l10n era sbagliata. La convenzione standard è i18n (Internationalization), ed è quella che userò ora.
* "Le chiavi di traduzione devono avere il punto?" Risposta: No, non è un obbligo tecnico. Tuttavia, usare i punti (es. functions.search_placeholder) è una convenzione molto diffusa che aiuta a organizzare le stringhe in gruppi logici, rendendo il codice più leggibile
* Perchè "l10n" va aggiunto nel package.json, mentre gli altri no?
* Gli altri file di traduzione stanno in una cartella, gli nls no, devono stare nella radice del progetto! Creando confusione.


Quindi, se vuoi aggiungere una nuova lingua all' estensione, dovrai creare numerosi file.<br>
Se vuoi migliorare una traduzione, dovrai cercare la stringa tra più file.<br>
Come se non bastassero i numerosi file di documentazione, che almeno sono tutti nella stessa cartella.

### Fare i test
Se vuoi testare come appare l' estensione in un altra lingua:<br>
Ctrl + Shift + P per aprire il *Riquadro comandi (Command Palette)* > `configure display language`<br
Ecco, i comandi sono disponibili sia in originale che tradotti. Le opzioni no.

Anche attivare gli Strumenti di sviluppo può tornare comodo.

## package.json
`publisher` è un campo necessario che dovrebbe contenere il mio ID sul marketplace delle estensioni, ma fino a quando non lo creo, e la cosa non è in programma, può contenere una stringa qualsiasi, almeno in teoria, in pratica si offende se non somiglia a un ID.<br>
Va a comporre il nome univoco dell' estensione.

`categories` indica dove classificare l'estensione. Anche se non è chiaro quali siano.

`keywords` serve per inserire le parole chiave per le quali voglio che l' estensione appaia.

`"commands"."command": "category-finder-view.focus"` dovrebbe essere gestito in automatico da VSC, e in effetti credo di aver lasciato il blocco solo nel caso volessi aggiungere dei comandi in futuro.<br>
Dovrebbe avere a che fare col menù contestuale sull' etichetta dell' estensione e sui comandi di Shift+Ctrl+P.

# Compilazione
Lancia
`vsce package`
da un terminale normale aperto nella cartella del progetto. Non sembra funzionare dal terminale di VSC.<br>
Potrebbe suggerire di aggiornare vscode/vsce con `npm install -g @vscode/vsce`. Questo è strano perchè VSC non ha segnalato la presenza di aggiornamenti.

## Gestione file
La compilazione suggerisce di creare un bundle, perchè ci sono molti file, ma gemini suggerisce per il momento di ignorare il consiglio, per il fatto che non sto creando un bundle. Sono confuso.

Tuttavia la compilazione non sembra leggere gitignore e include nell' estensione anche alcuni file inutili. Occorre quindi creare un vscodeignore, che indica quali file escludere dalla compilazione.<br>
Ero convinto che capisse da solo cosa includere e cosa escludere dalla compilazione. O che ci fosse un flag in cui indicare l' esclusione automatica.

## Compilazione online da github
Dovrebbe essere possibile effettuare automaticamente una compilazione online ad ogni nuovo commit, ma lo trovo eccessivo.<br>
Occorre creare un file .github/workflows/build.yml e inserirci, rispetto a quanto è ora:
```
on:
push:				<-- Questo attivava la build automatica
	branches:
	- main
workflow_dispatch:	<-- Questo attivava la build manuale
```

Che posso supporre significare di compilare il main quando avviene un push sul main.

Per compilare manualmente, allo stato attuale:

0. Vai sulla pagina del tuo repository su GitHub (GitLab non sembra essere supportato).
0. Clicca sulla tab in alto Actions (Azioni).
0. Nella colonna di sinistra, clicca sul nome del tuo workflow ("Build Extension", o comunque quanto appare dopo "name:"). Se non appare è perchè il percorso del file è errato.
0. Sulla destra, vedrai una fascia blu (o grigia) con un pulsante "Run workflow".
0. Clicca Run workflow (e poi il pulsante verde di conferma). Dovrebbe anche essere possibile scegliere il ramo.

GitHub avvierà la macchina virtuale, compilerà l'estensione e, dopo circa un minuto, troverai il file .vsix scaricabile in basso nella sezione Artifacts dell' esecuzione appena completata. Per ottenere questo devi aprire il processo.

Arriverà anche un email con l' esito della compilazione.

### Bug di YAML
Ecco un altro buon motivo per **detestare** yaml!

Lo **YAML proibisce rigorosamente l'uso dei tabulatori (tab) per l'indentazione**.

Devi usare **solo spazi**.

Se usi un tab per indentare, il parser YAML restituirà un errore di sintassi. Questa è una delle regole più severe dello standard YAML per garantire che il file venga letto allo stesso modo su qualsiasi sistema e editor (poiché i loro sviluppatori credono che la larghezza visiva di un tab può variare, mentre uno spazio è sempre uno spazio, cosa palesemente falsa: è vero che ogni editor può assegnare al tab una diversa larghezza in px, ma assegna sempre la stessa a tutti, usare un tab invece aiuta a evitare errori come mettere 3 spazi invece di 2).

Inoltre, sembra essere consentito usare un numero qualsiasi di spazi per definire l' indentazione.<br>
Considera anche che ogni editor può avere una dimensione del font differente, quindi apparire diverso. Ed esiste la possibilità che qualche sviluppatore usi Arial che non è a larghezza fissa.

### Estensione
VSC suggerisce di istallare l' estensione *GitHub Actions*.

Dovrebbe:
* Aggiungere un pulsante per la compilazione online, ma questo richiede un login supplementare, anche se dovrei già essere collegato al repository
* Questa estensione offre IntelliSense (autocompletamento) specifico per i file di GitHub Actions.
	* Ti suggerisce le chiavi giuste (runs-on, steps, uses).
	* Ti segna in rosso se sbagli l'indentazione prima che tu faccia il commit.

### Sommo abominio
Benchè in test (F5) funzioni tutto perfettamente, provando a compilare mi ha tirato fuori un fantastiliardo di errori. E tutti legati all' assenza di stringhe di traduzione. Ma non mi ha dato subito l' elenco completo: no, prima comincia a fingere di tentare una compilazione e solo alla fine mi dice, una alla volta, le strighe assenti. Tutto perchè il sistema di traduzione è seplicemente *stupefacente*.