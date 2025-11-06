Solo italiano 🚀!

Scopo: Elencare le funzioni in base alle @Category

* Deve apparire un pulsante "Cerca @Category" nella barra di stato dell' editor, in rosso o in verde chiaro a seconda se trova funzioni.
* Cliccando su quel pulsante deve apparire un pannello di dimensioni contenute con delle tab:
	* Tutte le funzioni: elenca tutte le funzioni, ovvero le righe che contengono la parola function, la lista deve contenere solo i nomi delle funzioni; se prima della funzione è presente un commento deve cercare la linea che contiene @Caterory e scrivere quello che segue @Category dopo il nome della funzione. Il nome della funzione deve essere in grassetto
	* Tutte le categorie: elenca tutte le categorie, come se fossero elementi di un albero, come figlio di ogni categoria devono esserci i nomi delle funzioni che hanno quella categoria, ogni funzione può quindi appartenere a più categorie. In coda deve esserci un elemento "senza categoria" per le funzioni prive di categoria. Accanto ad ogni categoria deve esserci un contatore che mostra quante funzioni contiene
	* Il pulsante deve essere sempre visibile
	* Deve apparire un pannello che non è un file ma una cosa a parte che non fa perdere il focus al file

* Le categorie sono separate da virgola, quindi quando cercando le categorie si usa la virgola come separatore e poi gli spazi esterni sono tolti con trim.
* In entrambe le tab deve esserci un campo di ricerca (fondo azzurrino) che filtra le funzioni o le categorie a seconda della scheda. Accanto al contatore degli elementi totali deve esserci un contatore degli elementi visualizzati.
* Accanto ad ogni nome di funzione deve esserci anche il numero di riga in cui si trova, seguito da `:` e dal nome funzione.
* Facendo doppio click sul nome di una funzione l' editor deve spostarsi su di essa. Qeusto non è ancora funzionante
* Questo plugin deve funzionare solo nel file attualmente visualizzato.
* Nel tab "Tutte le categorie" devono esserci due campi di ricerca: uno che filtra le categorie e uno che filtra per nome funzione. Anche in questa tab deve esserci, dopo i nomi funzione, il nome di tutte le categorie, scrivendo il nome della categoria contenitore in un colore diverso.
* Le funzioni trovate devono essere ordinabili per nome (case insensitive) o per numero di riga.
* I campi di ricerca devono essere sempre visibili, anche scorrendo il pannello.
* Il conteggio degli elementi deve essere indicato come *Elementi visualizzati* di *Elementi totali*
* L' estensione deve accordarsi con la lingua dell' interfaccia.

* Il pulsante deve essere sempre visibile e mostrare il file corrente, se non diversamente indicato. La lista delle funzioni deve aggiornarsi quando il file viene salvato.

Dovrà esserci un menù a tendina che ha:
* come prima voce "File corrente", questa fa in modo che la lista venga aggiornata ogni volta che un file viene selezionato nell'editor;
* come seconda voce il nome del file corrente, così da poter essere facilmente individuato
* le voci seguenti devono essere l'elenco di tutti i file presenti nella cartella progetto, ordinati come farebbe tree/f, quelli che sono aperti nell' editor devono essere evidenziati

# Problemi
* Non ha accettato la personalizzazione di "publisher"
* I file di lingua sono presenti ma non ancora funzionanti del tutto
* Bisognerebbe spostare esternamente anche la definizione html e css
* Il pannello viene aperto in una seconda visualizzazione, e di conseguenza altri file verranno lì aperti, inoltre perde il focus, è quindi possibile aprire nuovi file accanto al pannello e trascinare i file accanto al pannello
* TypeScript non funziona, quindi devo fare tutto in js puro
* Voglio che nel testo del pulsante ci sia anche un contatore con la listta delle funzioni attuali
* Occorre rimuovere i trattini da dopo i nomi di funzione
* Verificare il funzionamento nelle classi. Nel caso delle classi, le funzioni dovranno essere mostrate come nomeClasse.nomeFunzione e dovranno poter essere ordinate tenendo conto del nome della classe o solo della funzione
* Occorre tradurre anche la scritta di invito ad aprire un file e, in loadTranslations, leggere tutte le varie traduzioni e non un elenco fisso. Sì, anche localize va reimplementata

# Compilazione
Lancia
`vsce package`
da un terminale normale aperto nella cartella del progetto.
