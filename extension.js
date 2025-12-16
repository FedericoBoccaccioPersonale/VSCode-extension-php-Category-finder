const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const PhpParser = require('php-parser');

class CategoryViewProvider
{
	_view;
	_doc;
	_sortType = 'line'; // Impostazione predefinita
	_activeTab = 'functions'; // Impostazione predefinita
	_selectedFileUri = null; // URI del file selezionato, null = file attivo
	_translations = {}; // Oggetto per contenere le traduzioni caricate

	constructor(extensionUri)
	{
		this._extensionUri = extensionUri;
		this.loadTranslations();
	}

	/**
	 * Carica le stringhe di traduzione da un file JSON in base alla lingua di VS Code.
	 * Se il file della lingua specificata non viene trovato, ripiega sull'inglese.
	 */
	loadTranslations()
	{
		const language = vscode.env.language; // Es. 'it-IT', 'en-US', 'en'
		const baseLanguage = language.split('-')[0]; // Es. 'it', 'en'
		const defaultLang = 'en';

		const filesToTry =
		[
			path.join(this._extensionUri.fsPath, 'i18n', `${language}.json`),
			path.join(this._extensionUri.fsPath, 'i18n', `${baseLanguage}.json`),
			path.join(this._extensionUri.fsPath, 'i18n', `${defaultLang}.json`)
		];

		let loaded = false;
		for (const file of filesToTry)
		{
			if (fs.existsSync(file))
			{
				try
				{
					const data = fs.readFileSync(file, 'utf8');
					this._translations = JSON.parse(data);
					loaded = true;
					break; // Interrompi al primo caricamento riuscito
				}
				catch (error)
				{
					console.error(`Errore nel caricamento o parsing del file di traduzione: ${file}`, error);
				}
			}
		}

		// Se tutti i tentativi falliscono, carica il file inglese di default come ultima risorsa
		// In realtà se non lo ha caricato prima non lo caricherà neanche adesso, dato che è il terzo di filesToTry
		if (!loaded)
		{
			try
			{
				const fallbackFile = path.join(this._extensionUri.fsPath, 'i18n', `${defaultLang}.json`);
				const data = fs.readFileSync(fallbackFile, 'utf8');
				this._translations = JSON.parse(data);
			}
			catch (error)
			{
				console.error('Impossibile caricare anche il file di traduzione di default:', error);
				this._translations = {}; // Imposta a vuoto per evitare errori
			}
		}
	}

	/**
	 * Documentato in "Stramberie delle estensioni"
	 * Metodo chiamato da VS Code per inizializzare la webview.
	 * Configura la webview, imposta i gestori di eventi e avvia il primo aggiornamento.
	 * @param {*} webviewView
	 * @param {*} context
	 * @param {*} _token
	 */
	resolveWebviewView(webviewView, context, _token)
	{
		this._view = webviewView;

		webviewView.webview.options =
		{
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		this.update();

		webviewView.webview.onDidReceiveMessage(
			message =>
			{
				switch (message.command)
				{
					case 'goToLine':
						this.goToLine(message); // Passa l'intero messaggio invece della linea
						return;
					case 'sort':
						this._sortType = message.sortBy;
						this._activeTab = message.activeTab;
						this.update();
						return;
					case 'fileSelected':
						// Se il valore è vuoto, significa "File corrente"
						this._selectedFileUri = message.uri === '' ? null : vscode.Uri.parse(message.uri);
						this.update();
						return;
				}
			}
		);
	}

	/**
	 * Invia un messaggio alla webview per mostrare/nascondere l'indicatore di caricamento.
	 */
	_setLoadingState(isLoading)
	{
		if (this._view) this._view.webview.postMessage({ command: 'setLoadingState', isLoading: isLoading });
	}

	/**
	 * Chiamata al salvataggio del file corrente, quando viene cambiata la tab attiva e in fase di inizializzazione.
	 * Aggiorna la WebView, quindi la lista funzioni.
	 */
	async update()
	{
		if (!this._view) return;

		let documentToParse = null;
		let nextUriToParse = null;

		// Determina quale URI dovrebbe essere analizzato
		if (this._selectedFileUri)nextUriToParse = this._selectedFileUri;
		else if (vscode.window.activeTextEditor)nextUriToParse = vscode.window.activeTextEditor.document.uri;

		// Se l'URI è cambiato, mostra l'indicatore di caricamento
		const uriChanged = nextUriToParse && (!this._doc || this._doc.uri.toString() !== nextUriToParse.toString());
		if (uriChanged) this._setLoadingState(true);

		// Prova a caricare il documento
		if (nextUriToParse)
		{
			try
			{
				documentToParse = await vscode.workspace.openTextDocument(nextUriToParse);
			}
			catch (error)
			{
				// Se il file non può essere aperto (es. è stato eliminato), torna alla modalità "File corrente"
				console.error(`Impossibile aprire il file: ${this._selectedFileUri.toString()}`, error);
				this._selectedFileUri = null;
				documentToParse = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document : null;
			}
		}
		// Altrimenti, usa il file dell'editor attivo
		else
		{
			documentToParse = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document : null;
		}

		if (documentToParse)
		{
			this._doc = documentToParse;
			this._view.webview.html = this._getHtmlForWebview(this._view.webview);
			if (uriChanged) this._setLoadingState(false);
		}
		else
		{
			this._doc = null; // Assicurati che il documento sia nullo
			this._view.webview.html = this._translations['extension.open_file_prompt'];
		}
	}

	/**
	 * Chiamata in resolveWebviewView al doppio click sul nome di una funzione.
	 * @param {object} message Oggetto con `uri` e `line`.
	 */
	goToLine(message)
	{
		const targetUri = vscode.Uri.parse(message.uri);
		const line = message.line;
		const editor = vscode.window.activeTextEditor;

		if (editor && editor.document.uri.toString() === targetUri.toString())
		{
			// Il file è già attivo: salta alla riga
			const position = new vscode.Position(line - 1, 0);
			editor.selection = new vscode.Selection(position, position);
			editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
		}
		else
		{
			// Il file non è attivo: apri in modalità "peek"
			const position = new vscode.Position(line - 1, 0);
			const location = new vscode.Location(targetUri, position);
			vscode.commands.executeCommand('editor.action.peekLocations', editor.document.uri, editor.selection.active, [location], 'peek');
		}
	}

	/**
	 * Dato che i LI vengono scritti praticamente uguali in due posti diversi, unifico il modo di scriverli.
	 * Anche se la concatenazione di stringhe rialloca la memoria ogni volta, il parser JS usato in VSC dovrebbe essere in grado di accorgersene e sostituire in automatico con un array push e join alla fine. Inoltre, il limitato numero di funzioni in un file è probabile che comporti comunque tempi molto rapidi.
	 * @param {object} func L' oggetto funzione da renderizzare.
	 * @param {string} listaDaScrivere L'HTML delle etichette di categoria da includere.
	 * @returns {string} La stringa HTML per l'elemento `<li>`.
	 */
	scritturaDeiLI(func, listaDaScrivere)
	{
		// Leggi la configurazione per mostrare o meno i nomi estesi
		const config = vscode.workspace.getConfiguration('gestioneFunzioni');
		const mostraNomiEstesi = config.get('mostraNomiEstesi');
		const mostraCommentate = config.get('mostraCommentate');

		const commentedClass = func.isCommented ? ' class="commented-function"' : '';
		if(commentedClass && !mostraCommentate)return ""; // Se ho impostato di non mostrare le commentate ritorno stringa vuota.

		let scopeHtml = '';
		// Se l'utente vuole i nomi estesi, mostriamo lo scope intero, altrimenti solo il nome funzione
		if (func.scope && mostraNomiEstesi)scopeHtml = `<span class="function-scope">${func.scope}.</span>`;

		const fullName = func.scope ? `${func.scope}.${func.name}` : func.name;

		return `<li
					class="list-item"
					data-line="${func.lineNumber}"
					data-uri="${this._doc.uri.toString()}"
					data-name="${func.name.toLowerCase()}"
					data-fullname="${fullName.toLowerCase()}"
					data-path="${func.scope || ''}">
						<span class="line-number">${func.lineNumber}:</span>
						${scopeHtml}
						<b${commentedClass}>${func.name}</b>
						${listaDaScrivere}
				</li>`;
	}

	/**
	 * Restituisce il codice HTML da mostrare nella WebView.
	 * Al momento le funzioni vengono lette e riorganizzate ogni volta, anche se nulla è cambiato.
	 * @param {*} webview
	 * @returns
	 */
	_getHtmlForWebview(webview)
	{
		if (!this._doc) return this._translations['extension.no_active_document'];

		let functions = this.parseFunctions(this._doc);
		const categoryTree = this.buildCategoryTree(functions);

		// Ordina le funzioni all'interno di ogni categoria
		categoryTree.forEach((funcs, category) =>
		{
			funcs.sort((a, b) =>
			{
				if (this._sortType === 'line') return a.lineNumber - b.lineNumber;
				if (this._sortType === 'name') return a.name.localeCompare(b.name);
				if (this._sortType === 'fullname')
				{
					const fullNameA = a.scope ? `${a.scope}.${a.name}` : a.name;
					const fullNameB = b.scope ? `${b.scope}.${b.name}` : b.name;
					return fullNameA.localeCompare(fullNameB);
				}
				return 0;
			});
		});

		// Ordina anche l'elenco completo delle funzioni
		functions.sort((a, b) =>
		{
			if (this._sortType === 'line') return a.lineNumber - b.lineNumber;
			if (this._sortType === 'name') return a.name.localeCompare(b.name);
			if (this._sortType === 'fullname')
			{
				const fullNameA = a.scope ? `${a.scope}.${a.name}` : a.name;
				const fullNameB = b.scope ? `${b.scope}.${b.name}` : b.name;
				return fullNameA.localeCompare(fullNameB);
			}
			return 0;
		});

		// Nel caso te lo stessi chiedendo, sì, le due funzioni sort sono assolutamente identiche, ma non voglio usare una funzione anonima associata a una costante: trovo che quella sintassi peggiori la leggibilità. Casomai la sposto in una funzione esterna.

		// Qui crea l' elenco in ordine alfabetico di tutte le funzioni. Per quanto strano, immagino che sia più efficiente calcolare tutti i valori e poi prendere quelli da visualizzare
		let allFunctionsHtml = '';
		functions.forEach(func =>
		{
			// Verifica se è necessario aggiungere la lista delle etichette: quanto fatto in buildCategoryTree è locale ad esso, quindi in functions possono esserci categorie vuote
			const categoryLabel = func.categories.length > 0 ? `<span class="category">${func.categories.join(', ')}</span>` : '';
			allFunctionsHtml += this.scritturaDeiLI(func, categoryLabel);
		});

		// Qui crea l' elenco di tutte le categorie, in cui raggruppa le funzioni
		let allCategoriesHtml = '';
		categoryTree.forEach((funcs, parentCategory) =>
		{
			let functionLinks = '';
			// Per ogni funzione del gruppo di categorie
			funcs.forEach(func =>
			{
				//console.log("gf"); // Sembra funzionare solo se ci sono punti di interruzione, in debug
				func.categories.splice(func.categories.indexOf(parentCategory), 1); // Questo rimuove il nome della categoria di questo gruppo, che andrà messo in fondo
				func.categories.push(parentCategory);

				// Questo elenca le categorie, differenziando
				const allCatsHtml = func.categories.map(cat =>
				{
					if (cat === parentCategory) return `<span class="category parent-category">${cat}</span>`; // Al momento questa riga verrà sempre eseguita per ultima. Tengo la struttura sia perchè è più facile da scrivere sia perchè così se volessi tornare indietro basterebbe rimuovere le righe sopra
					return `<span class="category other-category">${cat}</span>`;
				}).join(' ');
				functionLinks += this.scritturaDeiLI(func, allCatsHtml);
			});
			// Aggiunge la categoria-gruppo
			allCategoriesHtml += `
				<div class="category-group">
					<!-- La prossima è la riga che viene sostituita da function openTab(evt, tabName). Non credo sia possibile chiamare da qui direttamente quella funzione -->
					<h3 class="category-title" data-original-title="${parentCategory}">${parentCategory} (${funcs.length})</h3>
					<ul class="function-sublist">${functionLinks}</ul>
				</div>`;
		});

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'webview', 'script.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'webview', 'style.css'));

		// Gestione della personalizzazione dei colori dell' estensione
		const config = vscode.workspace.getConfiguration('categoryFinder');
		const bgColor = config.get('backgroundColor');
		const inputBgColor = config.get('inputBackgroundColor');

		// Questo verrà aggiunto in cima alla pagina web, perchè non è possibile modificare direttamente il css
		let customStyles = '<style>:root {';
		if (bgColor) customStyles += `--colore-sfondo: ${bgColor};`;
		if (inputBgColor) customStyles += `--colore-sfondo-input: ${inputBgColor};`;
		customStyles += '}</style>';

		// Creazione del selettore file
		let fileSelectorHtml = '<select class="fileSelector">';
		// Opzione per seguire il file attivo
		const isCurrentFileSelected = this._selectedFileUri === null;
		fileSelectorHtml += `<option value="" ${isCurrentFileSelected ? 'selected' : ''}>${this._translations['extension.current_file']}</option>`;

		const activeEditor = vscode.window.activeTextEditor;
		// Qui è dove elenca i file attualmente aperti
		const allTabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);
		const uniqueUris = new Set(); // Per evitare duplicati

		// Raccogli solo gli URI unici, scartando quello che non è un file. Quindi esclude i file non ancora salvati. Tuttavia i file vengono letti aggiornati anche se non salvati.
		allTabs.forEach(tab =>
		{
			if (tab.input instanceof vscode.TabInputText && tab.input.uri.scheme === 'file') uniqueUris.add(tab.input.uri.toString());
		});

		// Converti in array, ordina e genera HTML
		Array.from(uniqueUris).sort((a, b) => 
		{
			// Estrai i nomi dei file al volo per il confronto
			const nameA = path.basename(vscode.Uri.parse(a).fsPath);
			const nameB = path.basename(vscode.Uri.parse(b).fsPath);
			return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
		})
		.forEach(uriString =>
		{
			const uri = vscode.Uri.parse(uriString); // Ricostruisci l'URI dalla stringa
			const fileName = path.basename(uri.fsPath);
			
			const isSelected = this._selectedFileUri && uriString === this._selectedFileUri.toString();
			const isActive = activeEditor && uriString === activeEditor.document.uri.toString();
			const activeClass = isActive ? ' class="active-file"' : '';
			
			fileSelectorHtml += `<option value="${uriString}"${activeClass} ${isSelected ? 'selected' : ''}>${fileName}</option>`;
		});

		fileSelectorHtml += '</select>';
		const configGestioneFunzioni = vscode.workspace.getConfiguration('gestioneFunzioni');
		if (!configGestioneFunzioni.get('mostraSelettoreFile')) fileSelectorHtml = ''; // Se non ho impostato di mostrarlo, annullo la stringa, faccio comunque il lavoro prima nel caso cambiassi impostazione: per qualche ragione le impostazioni sembrano avere effetto in tempo reale.

		const l10n = this._translations;
		const functionsCounterText = l10n['functions.counter']
			.replace('{0}', `<span id="visibleFunctions">${functions.length}</span>`)
			.replace('{1}', `<span id="totalFunctions">${functions.length}</span>`);

		const categoriesCounterText = l10n['categories.counter']
			.replace('{0}', `<span id="visibleCategories">${categoryTree.size}</span>`)
			.replace('{1}', `<span id="totalCategories">${categoryTree.size}</span>`);

		const variables =
		{
			styleUri: styleUri,
			scriptUri: scriptUri,
			customStyles: customStyles,
			fileSelector: fileSelectorHtml,
			allFunctionsHtml: allFunctionsHtml,
			totalFunctions: functions.length,
			visibleFunctions: functions.length,
			allCategoriesHtml: allCategoriesHtml,
			totalCategories: categoryTree.size,
			visibleCategories: categoryTree.size,
			functionsTabActive: this._activeTab === 'functions' ? 'active' : '',
			categoriesTabActive: this._activeTab === 'categories' ? 'active' : '',
			l10n: l10n,
			functionsCounterText: functionsCounterText,
			categoriesCounterText: categoriesCounterText,
			l10nJson: JSON.stringify(l10n)
		};

		// Quello che segue in questa funzione era prima gestito da getWebviewContent, Jules ha perpetrato questa stramberia e ha rifiutato di spiegarne la ragione.
		// Tuttavia, per quanto visibilmente orripilante e con una lambda, dovrebbe funzionare meglio
		const htmlPath = path.join(this._extensionUri.fsPath, 'webview', 'index.html');
		let html = fs.readFileSync(htmlPath, 'utf8');

		html = html.replace(/\$\{(.*?)\}/g, (match, key) =>
		{
			if (key.startsWith("l10n['") && key.endsWith("']"))
			{
				const translationKey = key.substring(6, key.length - 2);
				return variables.l10n[translationKey] || match;
			}
			if (variables.hasOwnProperty(key))
			{
				return variables[key];
			}
			return match;
		});

		return html;
	}
	
	/**
	 * Restituisce una lista di funzioni contenute nel file corrente.
	 * Questa è la versione precedente che non usa la libreria di parsing.
	 * È comunque buono se non c' è bisogno di tenere conto delle classi.
	 * @param {*} document
	 * @returns array(string name, int lineNumber, array<string> categories)
	 * @deprecated
	 */
	parseFunctions_versionePrecedente1(document)
	{
		const functions = [];
		const text = document.getText();
		const lines = text.split('\n');
		const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/;

		// Verifico se devo mostrare anche le funzioni commentate
		const config = vscode.workspace.getConfiguration('gestioneFunzioni'); // 
		const mostraCommentate = config.get('mostraCommentate');
		// Le categorie vengono comunque calcolate, anche se è uno spreco, solo alla fine viene deciso se includerle e meno nell' elenco.
		// Questo perchè [A] è più facile da implementare, [B] tiene più stabile il tempo di esecuzione.

		// Cerca tutte le righe "function"
		lines.forEach((lineText, index) =>
		{
			const match = lineText.match(functionRegex);
			if (match)
			{
				const functionName = match[1];
				const lineNumber = index + 1;
				const isCommented = this.isFunctionCommented(text, index, functionName);
				let categories = [];
				for (let i = index - 1; i >= 0; i--)
				{
					// Va a ritroso a trovare la riga @category
					const prevLine = lines[i].trim();
					if (prevLine.startsWith('*/')) continue;
					if (prevLine.startsWith('/**')) break;
					if (prevLine.startsWith('}')) break; // È una funzione senza commento, questa è direttamente quella precedente
					if (prevLine.toLowerCase().startsWith('* @category'))
					{
						const catLine = prevLine.substring(prevLine.toLowerCase().indexOf('@category') + 9).trim();
						categories = catLine.split(',').map(cat => cat.trim()).filter(cat => cat);
						break;
					}
				}
				if(!isCommented || mostraCommentate)functions.push({ name: functionName, lineNumber, categories, isCommented });
			}
		});
		return functions;
	}

	/**
	 * Analizza il codice usando la libreria php-parser (AST).
	 * Gestisce scope (Classi/Enum) e "Parser nel Parser" per i commenti.
	 * @deprecated
	 */
	parseFunctions_versioneprecedente2_che_funziona_senza_ragione(document)
	{
		const text = document.getText();
		const functions = [];
		
		// 1. Configura il parser della libreria
		const parser = new PhpParser
		({
			parser: { extractDoc: true },
			ast: { withPositions: true }
		});

		try
		{
			// 2. Parsa il codice attivo
			const ast = parser.parseCode(text);

			// 3. Funzione ricorsiva per navigare l'albero e tracciare lo SCOPE (Classe/Enum)
			// Questo è un orrore del js "moderno": un assegnazione di funzione a una variabile, che avrà il nome "traverse", poi ci sono le variabili e la cosiddetta freccia grassa indica che è una funzione
			// Di conseguenza, la prima volta che ci arriva, il debug non entrerà mai perchè si limita ad assegnare la funzione.
			const traverse = (nodes, currentScope = '') =>
			{
				if (!nodes) return;
				if (!Array.isArray(nodes)) nodes = [nodes]; // Normaizzazione: se non è un array, trasformalo in array usando le parentesi quadre

				nodes.forEach(node =>
				{
					let nextScope = currentScope;

					// Se entriamo in un Namespace, Classe, Trait o Enum, aggiorniamo lo scope
					if (['namespace', 'class', 'trait', 'interface', 'enum'].includes(node.kind))
					{
						const name = node.name.name || node.name; // Gestisce nomi complessi
						nextScope = currentScope ? `${currentScope}\\${name}` : name;
					}

					// Se troviamo una funzione o un metodo
					if (['method', 'function'].includes(node.kind))
					{
						let categories = [];
						// Estrazione categorie dai commenti PHPDoc del nodo (forniti dal parser)
						if (node.leadingComments)
						{
							node.leadingComments.forEach(comment =>
							{
								const match = comment.value.match(/@category\s+(.*)/i);
								if (match)categories = match[1].split(',').map(c => c.trim()).filter(c => c);
							});
						}

						functions.push(
						{
							name: node.name.name || node.name,
							lineNumber: node.loc.start.line,
							categories: categories,
							scope: currentScope, // <--- ECCO IL PATH (es. NomeClasse)
							isCommented: false
						});
					}

					// Ricorsione sui figli (body, children, etc.)
					for (const key in node)
					{
						if (node[key] && typeof node[key] === 'object' && key !== 'loc' && key !== 'leadingComments')traverse(node[key], nextScope);
					}
				});
			};

			// Avvia l'analisi del codice attivo
			traverse(ast.children);

			// 4. PARSER NEL PARSER (Analisi dei commenti)
			// Il parser ci ha già dato tutti i commenti in ast.comments (se configurato) 
			// oppure li estraiamo se la libreria li attacca solo ai nodi.
			// Per sicurezza, iteriamo i commenti trovati o usiamo una strategia ibrida sicura sui token.
			// Dato che php-parser attacca i commenti ai nodi, per trovare funzioni INTERAMENTE commentate
			// (che non sono nodi), dobbiamo fare una scansione grezza dei blocchi di commento.

			// Questo non dovrebbe affatto funzionare, ma funziona quindi non lo tocco.
			// Avrebbe dovuto entrare in ricorsione addirittura sulla funzione parseFunctions, che avrebbe dovuto analizzare del testo piuttosto che un oggetto.
			
			// Nota: Per non appesantire, qui uso una logica semplificata:
			// Se trovo un blocco di commento, provo a parsarlo con la libreria.
			
			// Regex SOLO per individuare i blocchi di commento (non per analizzarli)
			const commentBlockRegex = /(\/\*[\s\S]*?\*\/)|(\/\/.*)|(#.*)/g;
			let match;
			while ((match = commentBlockRegex.exec(text)) !== null)
			{
				const commentContent = match[0];
				// "Sbuccia" il commento
				const cleanCode = commentContent.replace(/^(\s*)(\/\/|#|\/\*|\*\/|\*)/gm, '$1');
				
				// Prova a parsare il contenuto del commento con la libreria
				try
				{
					// Avvolgiamo in una classe Fantoccio perché "public function" fallisce se globale
					const FantoccioWrapper = `<?php class FantoccioParserScope { ${cleanCode} }`;
					const commentAst = parser.parseCode(FantoccioWrapper);
					
					// Navighiamo questo mini-AST
					const traverseComments = (nodes) =>
					{
						if (!nodes) return;
						if (!Array.isArray(nodes)) nodes = [nodes];
						nodes.forEach(n =>
						{
							if (['method', 'function'].includes(n.kind))
							{
								// Calcoliamo la riga reale basandoci sull'offset del match
								// (È approssimativo, ma sufficiente per visualizzazione)
								const linesUntilMatch = text.substring(0, match.index).split('\n').length;
								
								functions.push(
								{
									name: n.name.name || n.name,
									lineNumber: linesUntilMatch + (n.loc.start.line - 1), // Offset relativo
									categories: [], // Difficile estrarre categorie annidate nel commento, lasciamo vuoto o implementiamo
									scope: 'Commento',
									isCommented: true
								});
							}
							if (n.body) traverseComments(n.body);
						});
					}
					// Cerchiamo dentro il body della classe Fantoccio
					if(commentAst.children && commentAst.children[0].body)traverseComments(commentAst.children[0].body);
				} 
				catch (err)
				{
					// Non era codice PHP valido, ignoriamo
				}
			}

		}
		catch (e)
		{
			console.error("Errore parsing AST:", e);
		}

		return functions;
	}

	//#region Ricorsione V3
	/**
	 * Analizza il codice usando la libreria php-parser (AST).
	 * Gestisce scope (Classi/Enum) e "Parser nel Parser" per i commenti.
	 */
	parseFunctions(document)
	{
		const text = document.getText();
		// Avvia l'analisi dal testo principale
		return this._analyzeText(text, false);
	}
	
	/**
     * Funzione ricorsiva principale.
     * Analizza una stringa di codice PHP (reale o estratta da un commento).
     * @param {string} code Il codice PHP da analizzare.
     * @param {boolean} isInsideComment Se true, stiamo analizzando codice trovato dentro un commento.
     * @param {number} lineOffset L'offset di riga da aggiungere (per le funzioni nei commenti).
     * @returns {Array} Lista di funzioni trovate.
	 * @deprecated Non sembra venire usata da nessuna parte
     */
    _analyzeCodeRecursive(code, isInsideComment, lineOffset = 0)
    {
        let foundFunctions = [];
        const parser = new PhpParser({
            parser: { extractDoc: true, suppressErrors: true },
            ast: { withPositions: true }
        });

        try
        {
            // Se siamo dentro un commento, avvolgiamo il codice in una classe Fantoccio
            // per evitare errori di sintassi (es. "public function" fuori da una classe).
            // NOTA: Aggiungiamo \n per non scombinare i numeri di riga se il wrapper è sulla stessa riga.
            const codeToParse = isInsideComment ? `<?php class FantoccioWrapper { \n${code}\n }` : code;
            
            // Parsa il codice
            const ast = parser.parseCode(codeToParse);

            // Naviga l'AST generato
            this._traverseAst(ast.children, '', (node, scope) => 
            {
                // CALCOLO RIGA CORRETTA
                // Se siamo in un commento, la riga riportata dall'AST è relativa al blocco commentato.
                // Dobbiamo aggiungere l'offset della posizione del commento nel file originale.
                // Inoltre, se abbiamo usato il FantoccioWrapper, dobbiamo sottrarre le righe del wrapper.
                let realLine = node.loc.start.line;
                if (isInsideComment) {
                    realLine = (realLine - 2) + lineOffset; // -2 per le righe del wrapper
                }

                // Aggiungi la funzione trovata
                foundFunctions.push({
                    name: node.name.name || node.name,
                    lineNumber: realLine,
                    categories: this._extractCategories(node),
                    scope: isInsideComment ? this._translations['extension.comment_scope'] : scope,
                    isCommented: isInsideComment
                });

            }, (commentNode) => 
            {
                // CALLBACK PER I COMMENTI TROVATI
                // Se siamo già dentro un commento, evitiamo ricorsioni infinite o inutili.
                if (!isInsideComment)
                {
                    const commentContent = commentNode.value;
                    const commentLineStart = commentNode.loc.start.line;
                    
                    // PULIZIA: Rimuove i delimitatori di commento (*, //, #)
                    // Questa regex rimuove i caratteri iniziali di ogni riga del commento
                    const cleanContent = commentContent.replace(/^(\s*)(\/\/|#|\*+)/gm, '$1');

                    // RICORSIONE: Chiama se stessa sul contenuto "pulito" del commento
                    const functionsInComment = this._analyzeCodeRecursive(cleanContent, true, commentLineStart);
                    
                    foundFunctions = foundFunctions.concat(functionsInComment);
                }
            });

        }
        catch (e)
        {
            // È normale fallire su frammenti di commento che non sono codice PHP valido
            // console.log("Parsing fallito per blocco:", e.message); 
        }

        return foundFunctions;
    }
	
	/**
     * Naviga l'albero AST ricorsivamente.
     * @param {Array|Object} nodes I nodi da visitare.
     * @param {string} currentScope Lo scope attuale (Namespace\Classe).
     * @param {Function} onFunctionFound Callback quando trova una funzione.
     * @param {Function} onCommentFound Callback quando trova un commento (per la ricorsione).
	 * @deprecated Sembra venire usata solo da _analyzeCodeRecursive, che non sembra in uso
     */
    _traverseAst(nodes, currentScope, onFunctionFound, onCommentFound)
    {
        if (!nodes) return;
        if (!Array.isArray(nodes)) nodes = [nodes];

        nodes.forEach(node =>
        {
            let nextScope = currentScope;

            // Aggiorna Scope
            if (['namespace', 'class', 'trait', 'interface', 'enum'].includes(node.kind))
            {
                const name = node.name.name || node.name;
                nextScope = currentScope ? `${currentScope}\\${name}` : name;
            }

            // Trovata Funzione/Metodo
            if (['method', 'function'].includes(node.kind))
            {
                onFunctionFound(node, currentScope);
            }

            // Gestione Commenti (Leading Comments attaccati al nodo)
            if (node.leadingComments)
            {
                node.leadingComments.forEach(comment => onCommentFound(comment));
            }
            
            // Nota: php-parser a volte mette i commenti "trailing" o "orphaned" in posti diversi.
            // Se volessi essere precisissimo dovresti controllare ast.comments se disponibile,
            // ma node.leadingComments copre il 99% dei casi rilevanti (funzioni commentate vicine al codice).

            // Ricorsione sui figli
            for (const key in node)
            {
                if (node[key] && typeof node[key] === 'object' && key !== 'loc' && key !== 'leadingComments')
                {
                    this._traverseAst(node[key], nextScope, onFunctionFound, onCommentFound);
                }
            }
        });
    }

    /**
     * Estrae le categorie dai commenti PHPDoc di un nodo.
     */
    _extractCategories(node)
    {
        let categories = [];
        if (node.leadingComments)
        {
            node.leadingComments.forEach(comment =>
            {
				// Regex per trovare @category o @package
                const match = comment.value.match(/@(category|package|subpackage)\s+(.*)/i); // Intercetta category, package e subpackage
                if (match)
                {
					// Curioso come dalle categorie siamo passati ai gatti...
                    const cats = match[2].split(',').map(c => c.trim()).filter(c => c); // Il [2] è perchè l' elemento 1 indica quale termine è stato intercettato, e al momento non mi interessa
                    categories.push(...cats);
                }
            });
        }
        return categories;
    }

	/**
	 * Metodo ricorsivo per attraversare i nodi dell'AST.
	 * @param {Object|Array} nodes - I nodi da analizzare.
	 * @param {string} currentScope - Lo scope attuale (namespace, classe, ecc.).
	 * @param {Array} functions - Array di accumulo per le funzioni trovate (ex variabile esterna).
	 * @param {boolean} isInsideComment - Flag se siamo dentro un commento (ex variabile esterna).
	 * @param {number} lineOffset - Offset di riga (ex variabile esterna).
	 */
	_traverse(nodes, currentScope, functions, isInsideComment, lineOffset)
	{
		if (!nodes) return;
		if (!Array.isArray(nodes)) nodes = [nodes];

		nodes.forEach(node =>
		{
			let nextScope = currentScope;

			// Aggiorna Scope: Namespace, Classi, Trait
			if (['namespace', 'class', 'trait', 'interface', 'enum'].includes(node.kind))
			{
				if (!(isInsideComment && node.name && node.name.name === 'FantoccioCommentWrapper'))
				{
					const nodeName = node.name ? (node.name.name || node.name) : '';
					nextScope = currentScope ? `${currentScope}\\${nodeName}` : nodeName;
				}
			}

			// Aggiorna Scope: Metodi (per annidamento)
			if (['method', 'function'].includes(node.kind))
			{
				const funcName = node.name.name || node.name;
				nextScope = currentScope ? `${currentScope}\\${funcName}` : funcName;
			}

			// Rileva Funzione
			if (['method', 'function'].includes(node.kind))
			{
				let realLine = node.loc.start.line;

				if (isInsideComment)
				{
					realLine = (realLine - 2) + lineOffset; // Calcolo riga: toglie le righe del wrapper e aggiunge l'offset originale
				}

				if (realLine < 1) realLine = lineOffset > 0 ? lineOffset : 1; // Protezione per indici validi

				functions.push({
					name: node.name.name || node.name,
					lineNumber: realLine,
					categories: this._extractCategories(node),
					scope: currentScope,
					isCommented: isInsideComment
				});
			}

			// Navigazione figli
			for (const key in node)
			{
				if (node[key] && typeof node[key] === 'object' && key !== 'loc' && key !== 'leadingComments')
				{
					// Chiamata ricorsiva passando tutti i parametri di contesto
					this._traverse(node[key], nextScope, functions, isInsideComment, lineOffset);
				}
			}
		});
	}

    /**
     * Funzione helper che parsa una stringa di codice.
     * Usa suppressErrors per ignorare la "sporcizia" dei commenti (es. *) e trovare comunque le funzioni.
     */
	_analyzeText(code, isInsideComment, lineOffset = 0)
	{
        let functions = [];
        
		// 'suppressErrors: true' è fondamentale qui: permette al parser di 
        // superare gli asterischi (*) decorativi dei commenti senza fermarsi.
		// Anche se non fuziona così bene
        const parser = new PhpParser({
            parser: { 
                extractDoc: true,
                suppressErrors: true 
            },
            ast: { withPositions: true }
        });

        try
		{
            let sourceToParse = code;

            if (isInsideComment)
			{
				// Rimuovi tag PHP iniziali se presenti nel commento e aggiunge un wrapper per validare i metodi (public/private)
                sourceToParse = sourceToParse.replace(/^\s*<\?php/i, '');
                sourceToParse = `<?php class FantoccioCommentWrapper { \n${sourceToParse}\n }`;
            }

            const ast = parser.parseCode(sourceToParse);

            if (ast.children) this._traverse(ast.children,'', functions,isInsideComment,lineOffset);

            if (!isInsideComment && ast.comments)
			{
                ast.comments.forEach(comment =>
				{
                    const commentStartLine = comment.loc.start.line;
                    let content = comment.value;

                    // Rimuove /*, /** all'inizio
                    if (content.startsWith('/**')) content = content.substring(3);
                    else if (content.startsWith('/*')) content = content.substring(2);
                    else if (content.startsWith('//')) content = content.substring(2);
                    else if (content.startsWith('#')) content = content.substring(1);

                    // E alla fine
					if (content.endsWith('*/')) content = content.substring(0, content.length - 2);

                    const functionsInComment = this._analyzeText(content, true, commentStartLine);
                    functions = functions.concat(functionsInComment);
                });
            }

        }
		catch (e)
		{
            console.error("Errore parsing:", e);
        }

        return functions;
    }

	
	//#endregion

	/**
	 * Il funzionamento è spiegato in Documentazione
	 * Raggruppa le funzioni per categoria.
	 * Le funzioni senza categoria vengono messe in un gruppo apposito.
	 * @param {Array} functions La lista di funzioni da processare.
	 * @returns {Map} Una mappa dove le chiavi sono le categorie e i valori sono array di funzioni.
	 */
	buildCategoryTree(functions)
	{
		const tree = new Map();
		const noCategoryLabel = this._translations['extension.uncategorized'];
		
		functions.forEach(func =>
		{
			// Se l'array di categorie è vuoto, usa un array con la categoria di default. Altrimenti, usa l'array esistente.
			const categoriesToProcess = func.categories.length > 0 ? func.categories : [noCategoryLabel];

			categoriesToProcess.forEach(category =>
			{
				if (!tree.has(category)) tree.set(category, []);
				tree.get(category).push(func);
			});
		});

		const sortedTree = new Map([...tree.entries()].sort((a, b) =>
		{
			if (a[0] === noCategoryLabel) return 1;
			if (b[0] === noCategoryLabel) return -1;
			return a[0].localeCompare(b[0]);
		}));
		return sortedTree;
	}
	/**
	 * Verifica se una funzione è commentata, includendo commenti inline e a blocco.
	 * Gestisce anche i commenti PHP (#) e la posizione non all'inizio riga.
	 * Cerca dal punto dove di trova la funzione andando all'indietro.
	 * Nel caso di // o # prima di trovare una nuova riga, nella due forme possibili, allora è un commento
	 * Nel caso di un /* prima di un * / (fine commento che non posso mettere, altrimenti viene interpretato come fine commento qui) allora è un commento
	 * 
	 * @deprecated Non è più necessaria nel nuovo modo che usa il parser
	 * @param {string} text L'intero codice sorgente.
	 * @param {number} functionLineIndex L'indice di riga dove si trova la dichiarazione della funzione.
	 * @param {string} functionName Il nome della funzione da cercare (es. 'miaFunzione').
	 * @returns {boolean} Vero se la funzione è commentata.
	 */
	isFunctionCommented(text, functionLineIndex, functionName)
	{
		const lines = text.split('\n');
		const line = lines[functionLineIndex];
		const functionStartIndex = line.indexOf(functionName);

		// -----------------------------------------------------
		// 1. Controllo Commento a Riga Singola (// o #)
		// -----------------------------------------------------
		if (functionStartIndex !== -1)
		{
			const singleLineCommentPos =
			[
				line.indexOf('//'),
				line.indexOf('#')
			]
			.filter(pos => pos !== -1)
			.sort((a, b) => a - b);

			if (singleLineCommentPos.length > 0 && singleLineCommentPos[0] < functionStartIndex)return true;
		}

		// -----------------------------------------------------
		// 2. Controllo Commento a Blocco (/* ... */)
		// -----------------------------------------------------

		// Si considera l'intero testo DALL'INIZIO DEL FILE FINO all'inizio della funzione.
		
		// 1. Ricostruisci il testo Fino all'inizio della funzione (esclusa)
		// Se functionStartIndex è -1, usiamo la lunghezza della riga come punto finale (meno preciso ma fallback)
		const functionStartOffset = lines.slice(0, functionLineIndex).join('\n').length + (functionStartIndex !== -1 ? functionStartIndex : line.length);
		const textUntilFunctionStart = text.substring(0, functionStartOffset);

		// 2. Trova l'ultima occorrenza di '/*' e '*/' in questo testo.
		const lastOpeningComment = textUntilFunctionStart.lastIndexOf('/*');
		const lastClosingComment = textUntilFunctionStart.lastIndexOf('*/');

		// Se l'ultimo '/*' si trova DOPO l'ultimo '*/', significa che un commento a blocco è aperto
		// e la funzione è posizionata all'interno di questo blocco.
		if (lastOpeningComment > lastClosingComment)return true;

		return false;
	}
}

/**
 * Leggo il file html e sostituisco le variabili, nella forma ${var}
 * @param {*} context
 * @param {*} variables
 * @deprecated
 * @returns
 */
function getWebviewContent(extensionPath, variables)
{
	const htmlPath = path.join(extensionPath, 'webview', 'index.html');
	let html = fs.readFileSync(htmlPath, 'utf8');

	// Sostituisci le variabili nel template
	for (const [key, value] of Object.entries(variables))
	{
		const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
		html = html.replace(regex, value);
	}

	return html;
}

/**
 * Documentato in "Stramberie delle estensioni"
 * @param {vscode.ExtensionContext} context
 */
function activate(context)
{
	const provider = new CategoryViewProvider(context.extensionUri);

	context.subscriptions.push(vscode.window.registerWebviewViewProvider("category-finder-view", provider));

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => provider.update()));

	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => provider.update()));

	// Aggiorna la webview quando un file viene aperto o chiuso
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(() => provider.update()));
	context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(() => provider.update()));

	// Aggiorna la webview quando le schede cambiano (apertura, chiusura, spostamento)
	context.subscriptions.push(vscode.window.tabGroups.onDidChangeTabs(() => provider.update()));
}

function deactivate() {}

module.exports =
{
	activate,
	deactivate
};
