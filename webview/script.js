const vscode = acquireVsCodeApi();

function openTab(evt, tabName)
{
	// Disattiva tutte le tab e poi mostra quella giusta
	document.querySelectorAll('.tab-content').forEach(tab =>tab.classList.remove('active'));
	document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

	document.getElementById(tabName).classList.add('active');
	evt.currentTarget.classList.add('active');
}

/**
 * Evento del doppio click: invia il comando di spostare il cursore
 */
document.body.addEventListener('dblclick', (event) =>
{
	const listItem = event.target.closest('.list-item');
	if (listItem)
	{
		const line = parseInt(listItem.dataset.line, 10);
		const uri = listItem.dataset.uri;
		if (!isNaN(line) && uri)vscode.postMessage({ command: 'goToLine', uri: uri, line: line });
	}
});

function sort(sortBy)
{
	const activeTab = document.querySelector('.tab-content.active').id;
	vscode.postMessage({ command: 'sort', sortBy: sortBy, activeTab: activeTab });
}

const searchFunctionsInput = document.getElementById('searchFunctions');
const visibleFunctionsCounter = document.getElementById('visibleFunctions');

function filterFunctions()
{
	const searchTerm = searchFunctionsInput.value.toLowerCase();
	const allFunctionItems = document.querySelectorAll('#functionsList li');
	let visibleCount = 0;

	allFunctionItems.forEach(item =>
	{
		if (item.textContent.toLowerCase().includes(searchTerm))
		{
			item.style.display = 'flex';
			visibleCount++;
		}
		else
		{
			item.style.display = 'none';
		}
	});
	if(visibleFunctionsCounter) visibleFunctionsCounter.textContent = visibleCount;
}

searchFunctionsInput.addEventListener('keyup', filterFunctions);

const searchByCategoryInput = document.getElementById('searchByCategory');
const searchByCategoryFunctionInput = document.getElementById('searchByCategoryFunction');
const visibleCategoriesCounter = document.getElementById('visibleCategories');

function filterCategories()
{
	const categoryTerm = searchByCategoryInput.value.toLowerCase();
	const functionTerm = searchByCategoryFunctionInput.value.toLowerCase();
	const allCategoryGroups = document.querySelectorAll('#categoriesList .category-group');
	let visibleCategoriesCount = 0;

	allCategoryGroups.forEach(group =>
	{
		const titleElement = group.querySelector('h3.category-title');
		const categoryTitle = titleElement.dataset.originalTitle.toLowerCase();
		const functionsInGroup = group.querySelectorAll('li.list-item');
		let categoryMatches = categoryTitle.includes(categoryTerm);
		let visibleFunctionsInGroup = 0;

		functionsInGroup.forEach(li =>
		{
			const functionName = li.dataset.name;
			if (functionName.includes(functionTerm))
			{
				li.style.display = 'flex';
				visibleFunctionsInGroup++;
			}
			else
			{
				li.style.display = 'none';
			}
		});

		if (categoryMatches && visibleFunctionsInGroup > 0)
		{
			group.style.display = 'block';
			visibleCategoriesCount++;
		}
		else
		{
			group.style.display = 'none';
		}
		// Anche innerHTML dovrebbe andar bene, ma creare un nodo è più sicuro
		titleElement.textContent = titleElement.dataset.originalTitle + ' ';
		const small = document.createElement('small');
		small.textContent = l10n['categories.function_counter_in_group']
			.replace('{0}', visibleFunctionsInGroup)
			.replace('{1}', functionsInGroup.length);
		titleElement.appendChild(small);
	});
	if(visibleCategoriesCounter) visibleCategoriesCounter.textContent = visibleCategoriesCount;
}

searchByCategoryInput.addEventListener('keyup', filterCategories);
searchByCategoryFunctionInput.addEventListener('keyup', filterCategories);

// Esegui i filtri al caricamento per inizializzare i contatori
filterFunctions();
filterCategories();

// Gestione selezione file
document.querySelectorAll('.fileSelector').forEach(selector =>
{
    selector.addEventListener('change', (event) => {        vscode.postMessage({ command: 'fileSelected', uri: event.target.value });    });
});

window.addEventListener('message', event =>
{
    const message = event.data;
    switch (message.command)
	{
        case 'setLoadingState':
            document.querySelectorAll('.loading-indicator').forEach(el => {                el.style.display = message.isLoading ? 'block' : 'none';            });
            // Nasconde le liste mentre carica
            document.getElementById('functionsList').style.display = message.isLoading ? 'none' : 'block';
            document.getElementById('categoriesList').style.display = message.isLoading ? 'none' : 'block';
            break;
    }
});

window.filterFunctions = filterFunctions;
window.filterCategories = filterCategories;