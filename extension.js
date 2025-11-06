const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// Questa variabile globale conterrà le traduzioni caricate dai file .json
let loadedTranslations = {};

/**
 * Funzione principale di attivazione dell'estensione.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // All'avvio, carichiamo tutte le traduzioni in memoria
    loadTranslations(context.extensionUri);
    
    let disposable = vscode.commands.registerCommand('category-finder.showPanel', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage("Per favore, apri un file per usare questa estensione.");
            return;
        }
        
        const lang = vscode.env.language;
        const document = editor.document;
        const functions = parseFunctions(document);
        const categoryTree = buildCategoryTree(functions, localize('no_category', lang));

        const panel = vscode.window.createWebviewPanel(
            'categoryFinder',
            localize('panel.title', lang),
            vscode.ViewColumn.Beside,
            { enableScripts: true, localResourceRoots: [] }
        );

        panel.webview.html = getWebviewContent(functions, categoryTree, lang);

        panel.webview.onDidReceiveMessage(
            message => {
                if (message.command === 'goToLine') {
                    goToLine(message.line);
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

/**
 * Legge i file .json dalla cartella l10n e li carica nella variabile `loadedTranslations`.
 * @param {vscode.Uri} extensionUri L'URI della cartella dell'estensione.
 */
function loadTranslations(extensionUri) {
    const l10nPath = path.join(extensionUri.fsPath, 'l10n');
    const languages = ['en', 'it', 'fr'];
    
    languages.forEach(lang => {
        try {
            const filePath = path.join(l10nPath, `${lang}.json`);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            loadedTranslations[lang] = JSON.parse(fileContent);
        } catch (e) {
            console.error(`Impossibile caricare il file di traduzione per '${lang}':`, e);
            // In caso di errore, si assicura che l'oggetto esista per evitare crash
            if (!loadedTranslations[lang]) {
                loadedTranslations[lang] = {};
            }
        }
    });
}

/**
 * Restituisce la stringa tradotta basandosi sulla lingua dell'interfaccia.
 * Ora legge dall'oggetto `loadedTranslations` caricato dai file.
 * @param {string} key La chiave della traduzione (es. "panel.title").
 * @param {string} lang Il codice della lingua (es. "it", "en-US").
 */
function localize(key, lang) {
    const language = lang.startsWith('it') ? 'it' : (lang.startsWith('fr') ? 'fr' : 'en');
    // Cerca la chiave nella lingua corretta, altrimenti usa l'inglese come default
    return loadedTranslations[language]?.[key] || loadedTranslations['en']?.[key] || key;
}


function parseFunctions(document) {
    const functions = [];
    const text = document.getText();
    const lines = text.split('\n');
    const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/;

    lines.forEach((lineText, index) => {
        const match = lineText.match(functionRegex);
        if (match) {
            const functionName = match[1];
            const lineNumber = index + 1;
            let categories = [];
            for (let i = index - 1; i >= 0; i--) {
                const prevLine = lines[i].trim();
                if (prevLine.startsWith('*/')) continue;
                if (prevLine.startsWith('/**')) break;
                if (prevLine.toLowerCase().startsWith('* @category')) {
                    const catLine = prevLine.substring(prevLine.toLowerCase().indexOf('@category') + 9).trim();
                    categories = catLine.split(',').map(cat => cat.trim()).filter(cat => cat);
                    break;
                }
            }
            functions.push({ name: functionName, lineNumber, categories });
        }
    });
    return functions;
}

function buildCategoryTree(functions, noCategoryLabel) {
    const tree = new Map();
    functions.forEach(func => {
        if (func.categories.length > 0) {
            func.categories.forEach(category => {
                if (!tree.has(category)) tree.set(category, []);
                tree.get(category).push(func);
            });
        } else {
            if (!tree.has(noCategoryLabel)) tree.set(noCategoryLabel, []);
            tree.get(noCategoryLabel).push(func);
        }
    });
    const sortedTree = new Map([...tree.entries()].sort((a, b) => {
        if (a[0] === noCategoryLabel) return 1;
        if (b[0] === noCategoryLabel) return -1;
        return a[0].localeCompare(b[0]);
    }));
    return sortedTree;
}

function goToLine(line) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const lineNumber = line - 1;
        const position = new vscode.Position(lineNumber, 0);
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
    }
}

function getWebviewContent(functions, categoryTree, lang) {
    let allFunctionsHtml = '';
    functions.forEach(func => {
        const categoryLabel = func.categories.length > 0 ? ` - <span class="category">${func.categories.join(', ')}</span>` : '';
        allFunctionsHtml += `<li class="list-item" data-line="${func.lineNumber}" data-name="${func.name.toLowerCase()}"><span class="line-number">${func.lineNumber}:</span> <b>${func.name}</b>${categoryLabel}</li>`;
    });
    let allCategoriesHtml = '';
    categoryTree.forEach((funcs, parentCategory) => {
        let functionLinks = '';
        funcs.forEach(func => {
            const allCatsHtml = func.categories.map(cat => {
                if (cat === parentCategory) {
                    return `<span class="category parent-category">${cat}</span>`;
                }
                return `<span class="category other-category">${cat}</span>`;
            }).join(' ');
            functionLinks += `<li class="list-item" data-line="${func.lineNumber}" data-name="${func.name.toLowerCase()}"><span class="line-number">${func.lineNumber}:</span> <b>${func.name}</b> ${allCatsHtml}</li>`;
        });
        allCategoriesHtml += `
            <div class="category-group">
                <h3 class="category-title">${parentCategory} (${funcs.length})</h3>
                <ul class="function-sublist">${functionLinks}</ul>
            </div>`;
    });
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${localize('panel.title', lang)}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 0; color: var(--vscode-editor-foreground); background-color: var(--vscode-editor-background);}
        .tabs { display: flex; border-bottom: 1px solid var(--vscode-divider-background); }
        .tab-button { padding: 10px 15px; cursor: pointer; background: none; border: none; color: var(--vscode-editor-foreground); font-size: 1em; border-bottom: 2px solid transparent; }
        .tab-button.active { border-bottom-color: var(--vscode-tab-activeBorder); }
        .tab-content { display: none; padding: 0 1em;}
        .tab-content.active { display: block; }
        .sticky-header { position: sticky; top: 0; background-color: var(--vscode-editor-background); padding-top: 1em; padding-bottom: 10px; z-index: 10; }
        input[type="text"] { width: 100%; padding: 8px; box-sizing: border-box; background-color: #e6f7ff; color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); margin-bottom: 8px;}
        ul { list-style: none; padding: 0; }
        .list-item { padding: 5px; border-radius: 3px; cursor: pointer; display: flex; align-items: center; }
        .list-item:hover { background-color: var(--vscode-list-hoverBackground); }
        b { color: var(--vscode-editor-selectionBackground); padding: 2px 0; }
        .line-number { color: var(--vscode-descriptionForeground); min-width: 40px; }
        .category { font-style: italic; font-size: 0.9em; padding: 2px 5px; margin-left: 5px; border-radius: 3px; white-space: nowrap; }
        .parent-category { background-color: var(--vscode-list-focusBackground); color: var(--vscode-list-focusForeground); }
        .other-category { background-color: var(--vscode-editor-inactiveSelectionBackground); color: var(--vscode-editor-foreground); opacity: 0.7; }
        .counters { font-size: 0.9em; color: var(--vscode-descriptionForeground); margin-top: 10px; }
        .sort-controls { margin: 10px 0; }
        .sort-controls button { margin-right: 10px; background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); border: 1px solid var(--vscode-button-border); padding: 5px 10px; cursor: pointer; }
        .sort-controls button:hover { background: var(--vscode-button-secondaryHoverBackground); }
    </style>
</head>
<body>
    <div class="tabs">
        <button class="tab-button active" onclick="openTab('functions')">${localize('tab.all_functions', lang)}</button>
        <button class="tab-button" onclick="openTab('categories')">${localize('tab.all_categories', lang)}</button>
    </div>
    <div id="functions" class="tab-content active">
        <div class="sticky-header">
            <input type="text" id="searchFunctions" placeholder="${localize('filter.by_name_or_cat', lang)}">
            <div class="sort-controls">
                <span>${localize('sort.by', lang)}</span>
                <button onclick="sortList('functionsList', 'line')">${localize('sort.line', lang)}</button>
                <button onclick="sortList('functionsList', 'name')">${localize('sort.name', lang)}</button>
            </div>
            <div class="counters">${localize('counter.displayed', lang)} <span id="visibleFunctions">${functions.length}</span> ${localize('counter.of', lang)} <span id="totalFunctions">${functions.length}</span> ${localize('counter.elements', lang)}</div>
        </div>
        <ul id="functionsList">${allFunctionsHtml}</ul>
    </div>
    <div id="categories" class="tab-content">
         <div class="sticky-header">
            <input type="text" id="searchByCategory" placeholder="${localize('filter.by_cat_name', lang)}">
            <input type="text" id="searchByCategoryFunction" placeholder="${localize('filter.by_func_name', lang)}">
            <div class="sort-controls">
                <span>${localize('sort.by', lang)}</span>
                <button onclick="sortAllSublists('categoriesList', 'line')">${localize('sort.line', lang)}</button>
                <button onclick="sortAllSublists('categoriesList', 'name')">${localize('sort.name', lang)}</button>
            </div>
            <div class="counters">${localize('counter.displayed', lang)} <span id="visibleCategories">${categoryTree.size}</span> ${localize('counter.of', lang)} <span id="totalCategories">${categoryTree.size}</span> ${localize('counter.categories', lang)}</div>
        </div>
        <div id="categoriesList">${allCategoriesHtml}</div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        function openTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            event.currentTarget.classList.add('active');
        }
        document.body.addEventListener('dblclick', (event) => {
            const listItem = event.target.closest('.list-item');
            if (listItem) {
                const line = parseInt(listItem.dataset.line, 10);
                if (!isNaN(line)) {
                    vscode.postMessage({ command: 'goToLine', line: line });
                }
            }
        });
        function sortList(listId, sortBy) {
            const list = document.getElementById(listId);
            const items = Array.from(list.querySelectorAll('li.list-item'));
            items.sort((a, b) => {
                if (sortBy === 'line') return parseInt(a.dataset.line) - parseInt(b.dataset.line);
                if (sortBy === 'name') return a.dataset.name.localeCompare(b.dataset.name);
                return 0;
            });
            items.forEach(item => list.appendChild(item));
        }
        function sortAllSublists(containerId, sortBy) {
            const container = document.getElementById(containerId);
            container.querySelectorAll('ul.function-sublist').forEach(list => {
                const items = Array.from(list.querySelectorAll('li.list-item'));
                 items.sort((a, b) => {
                    if (sortBy === 'line') return parseInt(a.dataset.line) - parseInt(b.dataset.line);
                    if (sortBy === 'name') return a.dataset.name.localeCompare(b.dataset.name);
                     return 0;
                });
                items.forEach(item => list.appendChild(item));
            });
        }
        const searchFunctionsInput = document.getElementById('searchFunctions');
        const functionsList = document.getElementById('functionsList');
        const allFunctionItems = functionsList.querySelectorAll('li');
        const visibleFunctionsCounter = document.getElementById('visibleFunctions');
        searchFunctionsInput.addEventListener('keyup', () => {
            const searchTerm = searchFunctionsInput.value.toLowerCase();
            let visibleCount = 0;
            allFunctionItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(searchTerm)) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            visibleFunctionsCounter.textContent = visibleCount;
         });
        const searchByCategoryInput = document.getElementById('searchByCategory');
        const searchByCategoryFunctionInput = document.getElementById('searchByCategoryFunction');
        const categoriesList = document.getElementById('categoriesList');
        const allCategoryGroups = categoriesList.querySelectorAll('.category-group');
        const visibleCategoriesCounter = document.getElementById('visibleCategories');
        function filterCategories() {
            const categoryTerm = searchByCategoryInput.value.toLowerCase();
            const functionTerm = searchByCategoryFunctionInput.value.toLowerCase();
            let visibleCategoriesCount = 0;
            allCategoryGroups.forEach(group => {
                const categoryTitle = group.querySelector('h3').textContent.toLowerCase();
                const functionsInGroup = group.querySelectorAll('li');
                let categoryMatches = categoryTitle.includes(categoryTerm);
                let visibleFunctionsInGroup = 0;
                functionsInGroup.forEach(li => {
                    const functionName = li.querySelector('b').textContent.toLowerCase();
                    if (functionName.includes(functionTerm)) {
                        li.style.display = 'flex';
                        visibleFunctionsInGroup++;
                    } else {
                        li.style.display = 'none';
                    }
                });
                if (categoryMatches && visibleFunctionsInGroup > 0) {
                    group.style.display = '';
                    visibleCategoriesCount++;
                } else {
                    group.style.display = 'none';
                }
            });
            visibleCategoriesCounter.textContent = visibleCategoriesCount;
        }
        searchByCategoryInput.addEventListener('keyup', filterCategories);
        searchByCategoryFunctionInput.addEventListener('keyup', filterCategories);
    </script>
</body>
</html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };