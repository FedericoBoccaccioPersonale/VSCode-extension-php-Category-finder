Purpose: List functions based on @Category<br>
Then I discovered that the PHP folks have deceptively decided to deprecate @Category in favor of @package and @subpackage.

* A button must appear in the extensions bar, which the user can move to a more suitable place. The button must always be visible.
* It must contain the tabs:
    * All functions: lists all functions, i.e., the lines containing the word function, the list must contain only the function names; if a comment is present before the function, it must search for the line containing @Category and write what follows @Category after the function name. The function name must be in bold.<br>
    There must be a search field for category names.
    * All categories: lists all categories, as if they were elements of a tree, as a child of each category there must be the names of the functions that have that category, so each function can belong to multiple categories. The "uncategorized" functions must be at the bottom, with a dedicated entry. Next to each category, there must be a counter showing how many functions it contains.<br>
    There must be a search field for both function name and category.
    * The found functions must be sortable by name (case insensitive) or by line number.
    * A panel must appear that is not a file but a separate thing that does not cause the file to lose focus - this is to work better than a previous version.

* Categories are separated by commas, so when searching for categories, you must use the comma as a separator and then remove the outer spaces with trim.
* In both tabs, there must be a search field (light blue background, customizable) that filters the functions or the categories and functions depending on the tab. Next to the total elements counter, there must be a counter for the displayed elements. In other words, X of Y.
* Next to each function name, there must also be the line number where it is located, followed by `:` and the function name. The beginning of the function name must always be aligned, the line number must be right-aligned.
* Double-clicking on a function name should move the editor to it.

* The search fields must always be visible, even when scrolling the panel.
* The element count should be indicated as *Displayed elements* of *Total elements*
* The extension must match the interface language.

* Commented functions must be highlighted differently.
* In the case of classes, the functions should be displayed as className.functionName and should be sortable considering the class name or only the function name.

* There must be a drop-down menu with:
    * as the first item "Current file", this ensures that the function list is updated every time a file is selected in the editor;
    * the following items must be the list of all open files.
    * the current file must be highlighted, to be found more easily

    The list must be updated when a file is opened or closed.

* When changing files, if necessary, do not leave the old function list but indicate "processing in progress" with a text-free image, thus saving on translation. This image should also be displayed during the extension's initialization phase.

# Abandoned Ideas
Using a button in the status bar or next to the buttons at the bottom of the open files bar.<br>
Moreover, it is not possible to change the color of the button in the status bar.<br>
That button would also have included a count of the total number of functions.

Highlighting if a function appears multiple times in a file, which is quite useless.

In the menu that indicates which file's functions to list, I have left out the list of the entire project folder, sorted as tree/f would do, because there could be too many files, and it would cause confusion with the open files, even by highlighting them, because nothing prevents opening a folder and some extra files.

As the second item in the drop-down menu, insert the name of the current file, so that it can be easily identified. Replaced by highlighting.