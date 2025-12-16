## activate
### Class Registration
The line: `context.subscriptions.push(vscode.window.registerWebviewViewProvider("category-finder-view", provider));`

**Registers the "brain" of the view:**

* `vscode.window.registerWebviewViewProvider(...)` is the function that tells Visual Studio Code: "When the user wants to display the panel with the ID 'category-finder-view', use the logic contained in the provider object to create and manage it."
* "category-finder-view" is the identifier (ID) of the view, which must exactly match the one you defined in the package.json file.
* provider is the instance of the `CategoryViewProvider` class, which contains the code to generate the HTML and handle messages coming from the webview.

**Manages the extension's lifecycle:**

* `context.subscriptions.push(...)` is a cleanup mechanism. A list of "things to turn off" when the extension is no longer needed.
* When you register the view, VS Code returns a "disposable" object. By adding it to this list, you ensure that when the user deactivates the extension or closes VS Code, the registration of your view is correctly canceled. This prevents memory leaks and ensures that your extension behaves well within the editor.

### Other Registrations
There are 3 `context.subscriptions.push` and they could be registered in the same instruction, but keeping them separate should make the code easier to read.

**vscode.window.onDidChangeActiveTextEditor** This should be the function that is activated when the active tab in the editor is changed, and consequently calls the function to be executed when the tab is changed.

**vscode.workspace.onDidSaveTextDocument** This is called when a document is saved.

This extension is designed to update the list on these two events.

## resolveWebviewView
This function is called automatically and is responsible for configuring the WebView shown in the sidebar.

* It saves a reference to the view (this._view = webviewView).
* It sets the necessary options.
* It registers the handler for messages coming from the webview (`onDidReceiveMessage`).
* It calls this.update() for the first time to load the initial content.

## Options
The extension's settings must be defined in package.json, as children of *contributes*.

To read them, you need:
```
const config = vscode.workspace.getConfiguration('categoryFinder');
const bgColor = config.get('backgroundColor');
```

### How configuration keys work in VS Code
- In the extension's `package.json`, the **configuration keys** are defined inside `"contributes.configuration.properties"`.
- Each key has a **namespace** (prefix) and a name.
Example: `"categoryFinder.backgroundColor"`
- `categoryFinder` → is the **namespace** (or configuration section), so it should not coincide with the package name (but it is not forbidden).
- `backgroundColor` → is the property within that namespace.

### Why it is written with a dot
The dot (`.`) is not an arbitrary operator: it is the VS Code convention for separating **namespace** and **key**.
- `"categoryFinder.backgroundColor"` is a single configuration key.
- When you do `vscode.workspace.getConfiguration('categoryFinder')`, you are saying: "give me all the settings under the `categoryFinder` namespace".
- Then with `.get('backgroundColor')` you access the specific property.

If you were to write directly:

```js
const bgColor = vscode.workspace.getConfiguration().get('categoryFinder.backgroundColor');
```

it would work the same, because you are reading the full key.<br>
But the form with `getConfiguration('categoryFinder')` is neater and more modular:
- It allows you to read multiple values of the same group without repeating the prefix.
- It keeps it clear that all options belong to a "block" (`categoryFinder`).

### In summary
- **Separate them**: because VS Code manages configurations as nested objects (`namespace → property`).
- **The dot**: is the syntax for defining keys with namespaces.
- **Alternatives**: you can read `"categoryFinder.backgroundColor"` directly in a single statement, but using `getConfiguration('categoryFinder')` is cleaner and more scalable.

### There is no list
After an hour of research and bothering both copilot and gemini, I can state without fear of contradiction that there is no list of all available types and formats. For types, there is intellisense, but not for format, unless the format is an invention of the AI, which if it were a little smarter would be able to answer "roger-roger".<br>
Enums are not included. Yet other settings show combos.

I also find it really inconvenient to have to quote everything. Besides being inconvenient, it prevents intelligent renaming and intellisense with get.

## Translations
In the end, I gave up trying to understand how translations work, especially the reason for some bizarre choices.

The very fact that *i18n* (internationalization) and *L10N* (localization) exist as standards for folder names creates confusion. Although it can be argued that they are two different things, from a programming point of view it is always a matter of translating the program, and therefore of having a set of strings in multiple languages.

### Why are there various groups of translation files
There is a precise technical reason for this separation. The two groups of files serve two different purposes and are read by two different "entities":

1.  **The "Bundle" files (`l10n\bundle.l10n.it.json`, etc.)**
    * **What they are for:** They translate the "static" interface of VS Code, i.e., everything defined in the `package.json` file (the extension title, description, command titles, menu items, settings).
    * **What reads them:** They are read directly by **Visual Studio Code** when the extension starts.
    * **Why this name:** VS Code specifically requires this naming convention (`bundle.l10n.<language>.json`) when using the `"l10n": "./l10n"` property in `package.json`. If you don't name them this way, VS Code will not translate the commands and menus.
    * **However**, the files in the root `package.nls.*.json` also do this. And the one without a language is loaded when the VSC language is not available. In fact, I left l10n in this version, but in practice they should not be necessary.
2.  **The simple files (`l10n\it.json`, `l10n\en.json`, etc.)**
    * **What they are for:** They translate the "dynamic" interface inside your panel (the tabs, HTML buttons, labels inside the WebView).
    * **What reads them:** They are read by the **JavaScript code** (`extension.js`).
    * **Why they are separate:** In the code (`extension.js`), the `loadTranslations` function is programmed to look for files named exactly `it.json`, `en.json`, etc. Although you could technically write more complex code to make it read the "bundles", having them separate is often cleaner: one set is for "outside" (VS Code), the other is for "inside" (the extension).
3.  The files inside i18n should also be the ones read by the translation function.

In other words, it is a questionable choice.

And if for some reason you have to mention a term from the interface in the program, you have to replicate the string.

What I don't understand:
* If the interface files, the *bundles* and the *nls* are read automatically, why are the others not read and replaced automatically, considering that they follow what should be a standard?
* "Can't I tell loadTranslations to read the nls files?" Answer: Technically yes, but it's bad practice. The nls files are reserved for the automatic VS Code system for package.json. Mixing the webview strings would create confusion and go against conventions. It is cleaner and safer to keep the two systems separate.
* "The problem is the webviews, not the JS." because gemini rambles on that a loadTranslation function is necessary because the WebView cannot read those files, but the strings are read and then injected by extension.js, which is a standard. Answer: You're right. The problem is the isolated context of the webview. Our extension.js must act as a bridge, manually loading the translations and "injecting" them into the HTML, because the automatic VS Code system cannot reach inside the webview.<br>
For me, this is not an answer. I know that extension.js reads the file and then injects it, what I want to know is why an explicit function is needed for this. See the first point.
* "l10n or i18n?" Answer: My mistake. The l10n folder was wrong. The standard convention is i18n (Internationalization), and that is what I will use now.
* "Do translation keys have to have a dot?" Answer: No, it is not a technical requirement. However, using dots (e.g., functions.search_placeholder) is a very common convention that helps to organize strings into logical groups, making the code more readable.
* Why does "l10n" have to be added to package.json, while the others do not?
* The other translation files are in a folder, the nls files are not, they must be in the project root! Creating confusion.

So, if you want to add a new language to the extension, you will have to create numerous files.<br>
If you want to improve a translation, you will have to search for the string in multiple files.<br>
As if the numerous documentation files were not enough, at least they are all in the same folder.

### Testing
If you want to test how the extension looks in another language:<br>
Ctrl + Shift + P to open the *Command Palette* > `configure display language`<br>
Here, the commands are available in both original and translated versions. The options are not.

Activating the Developer Tools can also be useful.

## package.json
`publisher` is a required field that should contain my ID on the extension marketplace, but until I create one, and that is not planned, it can contain any string, at least in theory, in practice it gets offended if it doesn't look like an ID.<br>
It makes up the unique name of the extension.

`categories` indicates where to classify the extension. Although it is not clear which ones they are.

`keywords` is used to enter the keywords for which I want the extension to appear.

`"commands"."command": "category-finder-view.focus"` should be handled automatically by VSC, and in fact I think I left the block only in case I want to add commands in the future.<br>
It should have to do with the context menu on the extension's label and on the Shift+Ctrl+P commands.

# Compilation
Run
`vsce package`
from a normal terminal opened in the project folder. It doesn't seem to work from the VSC terminal.<br>
It might suggest updating vscode/vsce with `npm install -g @vscode/vsce`. This is strange because VSC did not report the presence of updates.

## File Management
The compilation suggests creating a bundle, because there are many files, but gemini suggests ignoring the advice for the moment, because I am not creating a bundle. I am confused.

However, the compilation does not seem to read gitignore and also includes some useless files in the extension. It is therefore necessary to create a vscodeignore, which indicates which files to exclude from the compilation.<br>
I was convinced that it would understand on its own what to include and what to exclude from the compilation. Or that there was a flag to indicate automatic exclusion.

## Online compilation from github
It should be possible to automatically perform an online compilation with each new commit, but I find it excessive.<br>
You need to create a .github/workflows/build.yml file and insert, compared to what it is now:
```
on:
push:				<-- This activated the automatic build
	branches:
	- main
workflow_dispatch:	<-- This activated the manual build
```

Which I can assume means to compile main when a push occurs on main.

To compile manually, at the current state:

0. Go to your repository page on GitHub (GitLab does not seem to be supported).
0. Click on the Actions tab at the top.
0. In the left column, click on the name of your workflow ("Build Extension", or whatever appears after "name:"). If it does not appear, it is because the file path is incorrect.
0. On the right, you will see a blue (or gray) banner with a "Run workflow" button.
0. Click Run workflow (and then the green confirmation button). It should also be possible to choose the branch.

GitHub will start the virtual machine, compile the extension and, after about a minute, you will find the .vsix file downloadable at the bottom in the Artifacts section of the just completed execution. To get this you have to open the process.

An email with the compilation result will also arrive.

### YAML Bug
Here is another good reason to **hate** yaml!

**YAML strictly prohibits the use of tabs for indentation**.

You must use **only spaces**.

If you use a tab to indent, the YAML parser will return a syntax error. This is one of the strictest rules of the YAML standard to ensure that the file is read in the same way on any system and editor (as their developers believe that the visual width of a tab can vary, while a space is always a space, which is patently false: it is true that each editor can assign a different width in px to the tab, but it always assigns the same to all, using a tab instead helps to avoid errors like putting 3 spaces instead of 2).

In addition, it seems to be allowed to use any number of spaces to define the indentation.<br>
Also consider that each editor can have a different font size, so it will look different. And there is the possibility that some developer uses Arial which is not fixed-width.

### Extension
VSC suggests installing the *GitHub Actions* extension.

It should:
* Add a button for online compilation, but this requires an additional login, even though I should already be connected to the repository
* This extension offers IntelliSense (autocompletion) specific to GitHub Actions files.
    * It suggests the right keys (runs-on, steps, uses).
    * It marks in red if you make an indentation error before you commit.

### Utter abomination
Although everything works perfectly in test mode (F5), when I tried to compile it threw up a gazillion errors. And they were all related to missing translation strings. But it didn't give me the complete list straight away: no, first it pretends to attempt a compilation and only at the end does it tell me, one by one, which strings are missing. All because the translation system is simply *amazing*.