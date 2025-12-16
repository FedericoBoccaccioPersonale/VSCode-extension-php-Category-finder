Scopo: Elencare le funzioni in base alle @Category<br>
Poi ho scoperto che quelli di php hanno gattopardescamente deciso di deprecare @Category in favore di @package e @subpackage.

* Deve apparire un pulsante nella barra delle estensioni, che l' utente può spostare in un posto più consono. Il pulsante deve essere sempre visibile.
* Deve contenere le tab:
	* Tutte le funzioni: elenca tutte le funzioni, ovvero le righe che contengono la parola function, la lista deve contenere solo i nomi delle funzioni; se prima della funzione è presente un commento deve cercare la linea che contiene @Caterory e scrivere quello che segue @Category dopo il nome della funzione. Il nome della funzione deve essere in grassetto.<br>
	Deve esserci un campo di ricerca per i nomi delle categorie.
	* Tutte le categorie: elenca tutte le categorie, come se fossero elementi di un albero, come figlio di ogni categoria devono esserci i nomi delle funzioni che hanno quella categoria, ogni funzione può quindi appartenere a più categorie. Le funzioni "senza categoria" devono essere in fondo, con una voce dedicata. Accanto ad ogni categoria deve esserci un contatore che mostra quante funzioni contiene.<br>
	Deve esserci sia un campo di ricerca per nome funzione che per categoria.
	* Le funzioni trovate devono essere ordinabili per nome (case insensitive) o per numero di riga.
	* Deve apparire un pannello che non è un file ma una cosa a parte che non fa perdere il focus al file - questo per funzionare meglio di una versione precedente.

* Le categorie sono separate da virgola, quindi cercando le categorie bisogna usare la virgola come separatore e poi eliminare gli spazi esterni con trim.
* In entrambe le tab deve esserci un campo di ricerca (fondo azzurrino, personalizzabile) che filtra le funzioni o le categorie e funzioni a seconda della scheda. Accanto al contatore degli elementi totali deve esserci un contatore degli elementi visualizzati. Detto altrimenti, X di Y.
* Accanto ad ogni nome di funzione deve esserci anche il numero di riga in cui si trova, seguito da `:` e dal nome funzione. L' inizio del nome della funzione deve essere sempre incolonnato, il numero di riga deve essere allineato a destra.
* Facendo doppio click sul nome di una funzione l' editor deve spostarsi su di essa.

* I campi di ricerca devono essere sempre visibili, anche scorrendo il pannello.
* Il conteggio degli elementi deve essere indicato come *Elementi visualizzati* di *Elementi totali*
* L' estensione deve accordarsi con la lingua dell' interfaccia.

* Le funzioni commentate devono essere evidenziate in modo diverso.
* Nel caso delle classi, le funzioni dovranno essere mostrate come nomeClasse.nomeFunzione e dovranno poter essere ordinate tenendo conto del nome della classe o solo della funzione

* Deve esserci un menù a tendina con:
	* come prima voce "File corrente", questa fa in modo che la lista funzioni venga aggiornata ogni volta che un file viene selezionato nell'editor;
	* le voci seguenti devono essere l' elenco di tutti i file aperti.
	* il file corrente deve essere evidenziato, per essere trovato più facilmente

	La lista deve aggiornarsi quando un file viene aperto o chiuso


* Al cambio file, se necessario, non lasciare il vecchio elenco funzioni ma indicare "elaborazione in corso" con un' immagine priva di testo, così si risparmia sulla traduzione. Tale immagine deve mostrarsi anche in fase di inizializzazione dell' estensione.

# Idee abbandonate
Usare un pulsante nella barra di stato o accanto ai pulsanti in fondo alla barra dei file aperti.<br>
Per di più non è possibile cambiare il colore al pulsante nella barra di stato.<br>
In quel pulsante ci sarebbe andato anche un conteggio del numero totale di funzioni.

Evidenziare se una funzione appare più volte in un file, che è abbastanza inutile.

Nel menù che indica di quale file elencare le funzioni, ho lasciato stare l' elenco di tutta la cartella progetto, ordinati come farebbe tree/f, perchè potrebbero essere troppi file, e farebbe confusione coi file aperti, anche evidenziandoli, perchè nulla vieta di aprire una cartella e qualche file extra.

Come seconda voce del menù a tendina inserire il nome del file corrente, così da poter essere facilmente individuato. Sostituito dall' evidenziazione.