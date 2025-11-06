# Documentation: Category Finder

This Visual Studio Code extension helps to quickly navigate functions within a file based on the `@category` PHPDoc tag.

## Available Features

### 1. Navigation Panel
Clicking the **"Search @category"** button in the editor's title bar opens a side panel that analyzes the current file.

### 2. Tab: All functions
- **Complete List**: Displays all functions identified in the file.
- **Display**: For each function, it shows: line number, name (in bold), and any associated categories.
- **Filter**: A search field allows for instant filtering of the list by name or category.
- **Sorting**: The list can be sorted by line number or by name (alphabetically).
- **Navigation**: Double-clicking on a function moves the editor's cursor directly to the corresponding line.

### 3. Tab: All categories
- **Grouped View**: Functions are grouped under each category they belong to. Functions without a category are grouped under "Uncategorized".
- **Multiple Filters**: There are two search fields that work together: one to filter category groups and one to filter functions within them.
- **Detailed Display**: Next to each function, all of its categories are displayed. The category of the current group is highlighted in a different color.
- **Counters**: A function counter is present next to each category title. A general counter shows the filtered categories versus the total.
- **Sorting and Navigation**: In this view, it is also possible to sort the functions within each category and navigate by double-clicking.

## Implementation Details
The extension is written in **pure JavaScript** and integrates with VS Code through its native APIs.
- **Code Parsing**: The content of the active file is parsed using regular expressions to identify function declarations. For each function found, the code performs a backward scan to find the PHPDoc comment block and extract the `@category` tag.
- **User Interface**: The panel is a VS Code **Webview**, whose content is dynamically generated as a single HTML string. Interactivity (filters, sorting, tabs) is handled by JavaScript running inside the Webview itself.
- **Communication**: Double-click navigation is implemented by sending a message (`postMessage`) from the Webview to the main extension, which then uses the VS Code API to move the cursor.
- **Internationalization**: Static strings for the VS Code interface (e.g., tooltips) are managed through the `l10n` system. **Dynamic strings within the Webview are loaded from external files (`en.json`, `it.json`, `fr.json`) located in a dedicated `l10n` folder, making the code cleaner and the translations easy to modify.**

## Known Issues and Unimplemented Changes
During development, some difficulties were encountered, and the following requested features were not successfully implemented:
1.  **Double-Click Reliability**: It has been reported that the double-click navigation feature is not always reliable.
2.  **Category Counters**: The counter in the categories tab does not update correctly to show the "X of Y" format during filtering.
3.  **Translation**: Files in l10n are not read and the button does not display the translated string but the placeholder.

