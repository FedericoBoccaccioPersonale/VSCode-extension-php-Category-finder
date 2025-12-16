# Documentation: Category Finder V2 (Search by category)

This Visual Studio Code extension helps you quickly navigate through functions in a PHP file based on the PHPDoc tag `@category`, but also on @package and @subpackage, which are treated the same way.

The categories must all be on the same line, separated by commas.

> I really don't understand how this extension doesn't already exist: it should be a standard feature integrated into VSC!

It works quite well, except for commented code. If you don't need to read the code in the comments then it's fine.

> In fact, I don't understand why someone wrote that nowadays it's fashionable to use package rather than category: they are two completely different things! Is there really someone who uses package to categorize functions within the same file?

## How to use it

### Activation
- The extension adds an icon to the VS Code extension column.
- To get started, open a PHP code file containing functions and click on the icon.

The primary sidebar is probably too small to show the content of this extension.<br>
Due to an arbitrary and unjustifiable limitation of VS Code, it is not possible to directly open the extension of the secondary bar, which you can expand without overlapping other extensions. So if you wish, you will have to move it manually.<br>
![Move extension](../it/spostare%20estensione.png)
* Right-click on the extension you want to move
* "Move to"
* "Secondary Sidebar" (or wherever you prefer)

In this way it will occupy the same panel as Copilot.
To move it again, right-click on the title and then Move to.

At this point the displayed label will be "Category Finder" followed by the flag of the active language (net of the emoji display of the operating system explained in <a href="windows%20bugs.en.md" target=_blank>Windows Bugs</a>) if instead the language of VSC is not among those supported by the extension a globe will appear and it will be in English.
<!-- For incomprehensible reasons, for this link the markdown syntax does not work, so I had to use the html one. The target does not always work. -->

The "Examples" folder contains some files to test on
* Action is taken from https://github.com/zendframework/zf1/blob/master/library/Zend/Controller/Action.php
* Abstract is taken from https://github.com/zendframework/zf1/blob/master/library/Zend/Db/Adapter/Abstract.php

I had to modify both because it seems that on the internet nobody uses @Category or @package.<br>
I have no idea what those files do, they are just examples to understand how the extension works.

### Navigation Panel
📎 A double-click on a function moves the editor's cursor directly to the corresponding line.

The panel has two main tabs to explore the code.

In the Settings you can decide whether to list the commented functions, i.e. contained in a comment, in a different color, or to hide them.

#### Tab: All functions
Shows all the functions identified in the file. Sortable.

For each function, the following are shown: line number, name (in bold) and any associated categories.

- **Filter by name or category**: A search field allows you to instantly filter the list by name or category. It is also indicated how many functions are currently displayed, X of Y.
- **Sort by**: It is possible to sort the list by **line** number or alphabetically by **name** or by **full name**, that is, taking into account the path of the extension (for example in which class it is located, but it is also possible that a function is inside another function or an enum).

#### Tab: By category
The functions are grouped under each category to which they belong. The functions without a category are grouped in "Uncategorized" (name in the translation file).<br>
The categories are always listed in alphabetical order. Within them are listed the functions that have that category.<br>
If a function has multiple categories, it appears in multiple groups.

Next to each function, all its categories are shown. The category of the current group is highlighted at the end with a different color.

Next to each category title there is a counter of the number of functions X of Y, which is updated during filtering.<br>
At the top there is a counter for the number of categories shown. There is no function counter because functions with multiple categories appear in multiple lists.

- **Filter by category name** and **Filter by function name**: There are two search fields: one to filter the category groups and one to filter the functions within them. They can be used together.
- **Sort by**: Also in this view it is possible to sort the functions within each category.

The search-filter is performed on the name displayed at that moment.
* If the "Show extended names" setting is active, the search is performed on the full name (e.g. ClassName\functionName).
* If the setting is disabled, the search is performed only on the short name (e.g. functionName), ignoring the class.

### File selector (drop-down menu)
The extension includes a drop-down menu at the top of the panel, which offers control over which file to analyze.

#### For the user
-   **Current file**: This is the default option. The function list will automatically update to show the functions contained in the file you are actively working on in the editor.
-   **List of open files**: The rest of the menu lists all the files currently open in the editor's tabs, in alphabetical order. You can select one to "pin" the view to that specific file, regardless of which file is active.
-   **Highlighting**: The currently active file in the editor is highlighted with a background color in the menu, making it easy to spot.
-   **Smart navigation**:
    -   If you double-click on a function of the **active file**, the editor will jump directly to that line.
    -   If you double-click on a function of a **non-active file**, VS Code will open a preview window ("Peek View") on that function, without changing the main file you are working on.

Unsaved files are excluded. However, the files are read updated (for the function listing) even if not saved. The current file is analyzed even if it is not saved.

#### Implementation details of the combo
- **Data source**: To ensure that the file list is always accurate, the extension reads the open tabs via the `vscode.window.tabGroups.all` API.
- **State management**: An internal variable (`_selectedFileUri`) tracks the user's selection. If it is `null`, the extension follows the active file; otherwise, it uses the URI of the selected file.
- **Dynamic updates**: The extension uses `vscode.window.tabGroups.onDidChangeTabs` to update the drop-down menu in real time when tabs are opened, closed or moved.
- **Asynchronous loading**: To avoid blocking the interface and manage files not yet loaded into memory, selecting a file from the menu triggers an `async` function. An image of "Analyzing file..." is shown immediately, while the document is loaded in the background with `await vscode.workspace.openTextDocument()`. Or so it should be.
- **Preview (Peek View)**: Cross-file navigation is implemented via the `editor.action.peekLocations` command, to which the file's URI and the function's position are passed.

## Implementation details of the extension
- **Language**: The extension is written in **pure JavaScript**, because TypeScript does not work.
- **User interface**: The panel is a WebView, whose content is dynamically generated as an HTML string. The interactivity (filters, sorting, tabs) is managed by JavaScript executed within the WebView itself.
- **Communication**: The navigation to move the cursor via double-click is implemented through events and messages.

### buildCategoryTree
The purpose of this function is to take a "flat" list of functions (a simple array) and transform it into an organized data structure (a "tree" or, more precisely, a grouping) based on their @category. In addition, it sorts these categories alphabetically, ensuring that uncategorized functions appear last.

**What it returns**
The function returns a JavaScript Map with the format:

* Key: A string representing the category name.
* Value: An array of objects. Each object in the array is the original function object that belongs to that category. The function object has the form: { name: string, lineNumber: number, categories: string[] }.

**Practical Example:**
If the input is a list of functions like this:

```json
[
	{ name: "getUser", lineNumber: 10, categories: ["Database", "API"] },
	{ name: "renderButton", lineNumber: 50, categories: ["UI"] },
	{ name: "helperFunc", lineNumber: 80, categories: [] },
	{ name: "fetchData", lineNumber: 120, categories: ["API"] }
]
```
The output returned by buildCategoryTree will be a Map similar to this:

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
	"Uncategorized" =>
	[
		{ name: "helperFunc", lineNumber: 80, categories: [] }
	]
}
```

**How it works**
1. It creates an empty Map called tree. JS Maps, which contrary to the philosophy of JS are classes and even pre-built, are a list of key-value objects that however maintain the order, unlike the Map objects of every other language I have seen. Although in reality other languages also have iterators, so I don't perceive the difference.
2. *Grouping* The function iterates (forEach) over each single func object present in the functions array it received as input.
For each function, it checks if it has categories.
3. *Assignment* First it assigns a fictitious category to the functions without a category, then it cycles through them all in order to assign that function to the labels corresponding to the categories it belongs to.
4. *Sorting* Unfortunately, the sorting of maps is of little use, so it must be transformed into an array, sorted taking into account the special case *noCategoryLabel* which goes to the end, then reconverted into a map.

### Finding functions
The previous version used regular expressions to find the lines where a function is located.<br>
This is fine as long as it involves analyzing function libraries without classes or enums.

To find what each function is inside (nesting), in order to, for example, highlight the toString of enums and know that they are inside an enum, which in turn can be inside a class, you need to use the same algorithm that creates the VSCode breadcrumb: **AST (Abstract Syntax Tree)**, and a search technique called **Hit Testing**.

The process of **building an AST** is divided into two distinct phases: Lexing (Tokenization) and Parsing.

#### Phase A: The Lexer (the scanner)
The Lexer reads the file character by character and groups the characters into known "words" called Tokens. It does not understand the meaning, it only knows how to "label" the pieces.

* Input: `function pippo() { }`
* Lexer output:
	1. T_FUNCTION (start: 0, end: 8, line: 1)
	0. T_WHITESPACE (" ")
	0. T_STRING ("pippo", start: 9, end: 14)
	0. T_OPEN_PAREN ("(")
	0. T_CLOSE_PAREN (")")
	0. ...

It simply counts the characters from the beginning of the file (offset).

#### Phase B: The Parser (the grammar)
Here the magic happens. The Parser takes the list of tokens and applies grammatical rules.

The algorithm to understand where a node (e.g. a function) begins and ends
1. **Lookahead**: The parser encounters the T_FUNCTION token. It knows that a function declaration is starting. It records its starting position.
0. **Consumption**: It expects (according to the PHP grammar) a name, then parentheses, then a code block { ... }
0. **Nesting**: When it encounters the open brace `{`, it enters "block" mode. It continues to *eat* tokens. If it finds another brace `{` (e.g. an if inside the function), it goes down one level. If it finds `}`, it goes up.
0. **Closing**: When it finds the closing brace `}` that corresponds to the open one of the function, it declares the node "complete", noting its position.

The result is an object (Node) that says: "I am a FunctionDeclaration, I contain these children, I start at line X and end at line Y".

#### (bad) Solution
Use the "de facto" standard library php-parser (created by glayzzle). It is the one used by tools like Prettier to format PHP.

To install it, run `npm install php-parser` from a cmd terminal in the project folder. It does not work from VSC.

> This, however, **massacred** my poor package.json file. Although it should have only added
> ```
> "dependencies":
> {
>	"php-parser": "^3.2.5"
> }
> ```

Although I later discovered that the library has dependencies and, apparently, I have to store the complete list of dependencies in my package rather than cascadingly inheriting all the dependencies fixed by their package.

You also need to modify the gitignore by adding `node_modules/`, I wonder why it didn't add it automatically.<br>
It also added package-lock.json, which ensures that everything works.

**Important:** When you download this project you will have to run `npm install`.<br>
To update the version, which is instead locked, you need `npm update`, it should be possible to specify which specific library to install, in case there is more than one.

---

This solution, however, has a problem: comments are classified as comments and therefore ignored.<br>
Therefore I will recurse into the comments, attaching that node as a child of the comment, adding a new field to the returned object that indicates that it is a comment.

The returned object will be a tree of:
```
name: functionName,
lineNumber: lineNumber,	// VS Code API uses 1-based for display
line: lineNumber,
endLine: lineNumber,
categories: categories,
type: type,				// 'function' or 'method'
isInComment: isCommented
```
> I would like to understand how the tabulation in VSC is different from how it appears in the web preview

This is all very wonderful in theory, but it is not what is implemented in the parseFunctions function, which I have given up trying to understand.

Unfortunately the parser is **bugged** and does not correctly interpret the comments.

### See also
[Extension quirks](extension%20quirks.en.md).

## NPM
An introductory guide, in Italian is on https://kinsta.com/it/blog/cos-e-npm/, preserved (badly) at https://web.archive.org/web/20251121094837/https://kinsta.com/it/blog/cos-e-npm/

This project uses **NPM** (Node Package Manager) to manage the external libraries necessary for the extension to work (like `php-parser` for code analysis) and development tools (like `vsce` to create the final package).

### Why do we use NPM instead of downloading libraries manually?
NPM offers critical advantages for modern development:

1.  **Dependency Tree Management (The main advantage):**
    Modern libraries often depend on *other* libraries to function.
      * *Manual Method:* You would have to download library A, find out that it needs library B, download B, find out that it needs C... a manual management nightmare.
      * *With NPM:* NPM automatically calculates the entire tree. If you install `php-parser`, it automatically downloads all the necessary sub-libraries without you having to do anything.
2.  **Lightweight and Clean Repository:**
    The code of external libraries is heavy (hundreds of files).
      * *Manual Method:* You would be forced to upload all these useless files to your versioning system (Git), weighing down the project.
      * *With NPM:* The code of the external libraries is **not committed**. In the project we only save a "shopping list" (`package.json`). Anyone who downloads the project will run a command and NPM will download the fresh files at that moment.
	  * Problem: This makes you dependent on the fact that third-party libraries will continue to exist.
3.  **Secure Versioning (`package-lock.json`):**
    NPM generates a file called `package-lock.json`. This file "freezes" the versions of every single installed library. This ensures that if the project works on your computer today, it will work identically on another developer's computer in a year, avoiding the "but it worked on my machine" problem.
4.  **Simplified Updates:**
    To update a library to the new version, just type `npm update`. Doing it manually would require re-downloading, unpacking and overwriting the files manually, with a high risk of errors.

### How to Install NPM

NPM is automatically included in **Node.js**. You don't have to install it separately.

1.  Go to the official website: [nodejs.org](https://nodejs.org/)
2.  Download the version indicated as **LTS** (Long Term Support).
3.  Perform the standard installation (Next, Next, Finish).

To verify that it is installed correctly, open a terminal (Command Prompt or PowerShell) and type:

```bash
node -v
npm -v
```

If you see version numbers (e.g. `v20.x.x`), you are ready.

### How to Initialize the Project

Once you have downloaded this project to your computer, the libraries folder (`node_modules`) will not be present (because, as explained above, it is not saved on Git).

To download all the necessary dependencies in one go:

1.  Open the terminal in the project folder.
2.  Run the command:
    ```bash
    npm install
    ```

NPM will read the `package.json` file, download `php-parser` and all the other necessary tools, and will automatically create the `node_modules` folder. Now you are ready to press `F5` and start the extension.

With this you should be able to run the project.

## How to Contribute
This project is open to contributions. If you wish to suggest new features or participate in the development, you are welcome. Open an issue or a pull request on the project repository on GitHub, if possible. Remember to update the documentation when you make changes, possibly at least in your language and in English, leaving a placeholder in the other languages indicating the absence.

Apparently my syntax style is close to *Allman*, although it differs for single-line blocks, so I invite you to follow it. A more appropriate name doesn't seem to exist yet, so I can define it as "Allman with omission of braces for single instructions, which if they are short enough do not wrap, however if the single instructions contain other instructions they can be in a block, but taking into account the symmetry in if/else". Feel free to write comments and function names in English, if you prefer.

I just ask you to specify if, in case of using AI, you have carefully checked that the generated code makes sense, in addition of course to checking that it works correctly. And that no features have been removed, for this refer also to [Planned features](<planned%20features.en.md>).

### parseFunctions
At this point, **I give up**, I declare my surrender!<br>
To begin with, here I reiterate that it is **wrong** that I should be the one to write this function. My field is writing programs, not support extensions for writing programs that should be part of IDEs as standard!!!!

The current parseFunctions in region 3 I have no idea how it works, and I am also sure that it is wrong because:
* it uses regex rather than recursing by passing the comment to the parser itself, which at this point I know is bugged because it is not able to ignore the typical errors of commented code
* it uses convoluted syntax like anonymous functions in constants or passed as arguments

As I said above, it should recurse and not use regex!!!!

The first thing to change then is to solve that for the comments it does not insert the real path (which does not always exist). And in general the correct management of comments, which is completely missing.

### It takes forever to start
My idea was to make the (correct) magnifying glass contained in the webview folder appear immediately when VSC loads and when the file changes, basically during the analysis of the file. But it doesn't seem to be possible: all attempts have turned out to be epic failures in which first the panel appears gray for a fraction of a second, then the processing starts with a blue bar at the top, then (uselessly) the gif appears and then the function list.<br>
Obviously, it makes no sense.<br>
The problem should be due to the fact that reading the current file, and the list of files, is very long, and the html is generated only at the end of that.<br>
I'm not so sure about that, because changing files takes much less than a second, even when the file is long. And listing the files can't take a lifetime if there are less than 10.

> And here are two more bugs:<br>
> * VSC Bug: Relying on JS which is a **terrible** language.
> * JS Bug: There is no instruction to force rendering immediately.
> * See also https://federicoboccaccio.wordpress.com/2025/08/05/bug-di-vs-code/ and https://federicoboccaccio.wordpress.com/2025/07/11/quello-che-odio-di-js/ (in Italian)

### (Other) Possible (but unlikely) improvements
* A context menu in the File Explorer to set that file to be displayed in the extension.
* Customization of all colors.
* Option to decide what to do when double-clicking on a function, in case the function is in a separate file or in the current file. Between: "jump to the function in that file", "show at the current point as if it were a click on 'reference'", "ask each time between these options", "customize action based on pressing Alt or Ctrl", "context menu on the functions to choose".
* Context menu on the function name, to have a second way to access the function, since the click works one time out of two, but also an item to copy the text: function name, fully qualified name (including class), the line number, the complete `li`.
* Tooltip with the full name and path of a function, useful for when only the name is shown without the path. Also show a tooltip with the complete `/**` comment.
* Option (chk) to indicate what to work on between category, package and subpackage.
* Improve the filter-search by letting you choose whether to search as it is now, whether to always search only by function name or always in the full name. Also evaluate regular expressions.

In the next version, eliminate unused functions.