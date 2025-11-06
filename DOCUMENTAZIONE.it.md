# Documentazione: Category Finder

Questa estensione per Visual Studio Code aiuta a navigare rapidamente tra le funzioni in un file basandosi sul tag PHPDoc `@category`.

## Funzionalità Disponibili

### 1. Pannello di Navigazione
Cliccando il pulsante **"Cerca @category"** nella barra del titolo dell'editor, si apre un pannello laterale che analizza il file corrente.

### 2. Tab: Tutte le funzioni
- **Elenco Completo**: Mostra tutte le funzioni identificate nel file.
- **Visualizzazione**: Per ogni funzione, vengono mostrati: numero di riga, nome (in grassetto) e le eventuali categorie associate.
- **Filtro**: Un campo di ricerca permette di filtrare istantaneamente la lista per nome o categoria.
- **Ordinamento**: È possibile ordinare l'elenco per numero di riga o per nome (in ordine alfabetico).
- **Navigazione**: Un doppio click su una funzione sposta il cursore dell'editor direttamente alla riga corrispondente. (non funziona ancora)

### 3. Tab: Tutte le categorie
- **Vista Raggruppata**: Le funzioni vengono raggruppate sotto ogni categoria a cui appartengono. Le funzioni senza categoria sono raggruppate in "Senza categoria".
- **Filtri Multipli**: Sono presenti due campi di ricerca che funzionano in sinergia: uno per filtrare i gruppi di categorie e uno per filtrare le funzioni al loro interno.
- **Visualizzazione Dettagliata**: Accanto a ogni funzione, vengono mostrate tutte le sue categorie. La categoria del gruppo corrente è evidenziata con un colore diverso.
- **Contatori**: Accanto ad ogni titolo di categoria è presente un contatore del numero di funzioni. Un contatore generale mostra le categorie filtrate rispetto al totale.
- **Ordinamento e Navigazione**: Anche in questa vista è possibile ordinare le funzioni all'interno di ogni categoria e navigare con il doppio click.

## Dettagli di Implementazione
L'estensione è scritta in **JavaScript puro** e si integra con VS Code tramite le sue API native.
- **Analisi del Codice**: Il contenuto del file attivo viene analizzato tramite espressioni regolari per identificare le dichiarazioni di funzione. Per ogni funzione trovata, il codice esegue una scansione all'indietro per trovare il blocco di commento PHPDoc e estrarre il tag `@category`.
- **Interfaccia Utente**: Il pannello è una **Webview** di VS Code, il cui contenuto è generato dinamicamente come un'unica stringa HTML. L'interattività (filtri, ordinamento, tab) è gestita da JavaScript eseguito all'interno della Webview stessa.
- **Comunicazione**: La navigazione tramite doppio click è implementata inviando un messaggio (`postMessage`) dalla Webview all'estensione principale, che poi utilizza l'API di VS Code per spostare il cursore.
- **Internazionalizzazione**: Le stringhe statiche dell'interfaccia di VS Code (es. tooltip) sono gestite tramite il sistema `l10n`. **Le stringhe dinamiche all'interno della Webview vengono caricate da file esterni (`en.json`, `it.json`, `fr.json`) situati in una cartella `l10n` dedicata, rendendo il codice più pulito e le traduzioni facili da modificare.**

## Problemi noti e modifiche non implementate
Durante lo sviluppo, sono state riscontrate alcune difficoltà e le seguenti funzionalità richieste non sono state implementate con successo:
1.  **Affidabilità del Doppio Click**: La funzionalità di navigazione con doppio click non è affidabile.
2.  **Contatori Categorie**: Il contatore nella tab delle categorie non si aggiorna correttamente per mostrare il formato "X di Y" durante il filtro.
3.	**Traduzione**: I file in l10n non sono letti ed il pulsante non mostra la stringa tradotta ma il segnaposto.

## Soluzioni
Il progetto è attualmente in sviluppo e conto di risolvere questi problemi.
Allo stato attuale in progetto elenca correttamente le funzioni dividendole in categorie.