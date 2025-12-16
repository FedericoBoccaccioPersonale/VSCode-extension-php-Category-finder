# WebView
🪲 Even when copying the code placed in a WebView into a file, it does not interpret the CSS when opened in a browser. I've tried everything, even manually inserting the file path reference, and even copying the CSS into a Style block. It does NOT interpret it in the external browser!!!!
Probably because it uses VSCode-specific CSS variables, but I don't think that's the only reason.

🪲 Moreover, it's not even possible to redefine those variables:
```
:root
{
	--vscode-editor-background: green;
}
```
doesn't work!

🪲 I really don't understand how those variables work!<br>
Apparently, there is no variable that indicates the color of the theme associated with comments. So it's not possible to associate the color of comments with commented functions.

By the way, I found https://gist.github.com/estruyf/ba49203e1a7d6868e9320a4ea480c27a
But the colors are wrong, in fact I don't think it's official.
For example, `--vscode-descriptionForeground` which exists, and which I used in line-number, is described as rgba(243, 239, 245, 0.7) which is whitish, while in VSC it appears blue, at least with my theme.

I also found https://code.visualstudio.com/api/references/theme-color but:
* It doesn't indicate the variable names, but object names, so, assuming they are indeed the variable names, they need to be converted.
* It doesn't indicate the color based on the chosen theme, which would be useful at least for the default themes.

I found https://marketplace.visualstudio.com/items?itemName=xiaohuohumax.vscode-theme-css-variables but it still doesn't show the colors.

# Settings
🪲 If I can define a color in the settings, it's not possible to use a color picker, as already requested in [Add color picker UI for settings with "format": "color" #245848](https://github.com/microsoft/vscode/issues/245848) and [setting UI: support color settings #106041](https://github.com/microsoft/vscode/issues/106041)

🪲 Translation bug.<br>
The issue concerns a standard behavior of the VS Code Settings interface: the editor tries to be "smart" and automatically transforms the technical key (gestioneFunzioni.mostraNomiEstesi) into a readable title ("Gestione Funzioni: Mostra Nomi Estesi") by separating words based on uppercase letters (CamelCase) and periods.

However, it is not possible to translate the key itself (the setting's ID), because that must remain identical for the code to work.

This leads to at least these problems:

§ The English habit of capitalizing everything in titles

§ The display of untranslated names in translated versions<br>
![untranslated settings](<../it/impostazioni non tradotte.png>)<br>
As you can see, that is the English version but some names are in Italian, because I program in Italian... although I use some terms that vaguely make more sense in English.

Both of these problems could have been solved if VSC supported a translation string for those labels as well: numerous items are supported, including type, format, default, description, and probably others I don't know yet, they could add "displayHead" in which to indicate the part before and after the colon. Thus leaving the ID untranslated, of course, but replacing it with the specified string in the display.

Moreover, it is not even possible to put a tooltip on the extension's label: there is *title* (in package.json) that tries to substitute, but this is only the tooltip of the icon, when it is displayed in the main bar, when I move it to the secondary bar the title is displayed directly, on which it is not possible to show a tooltip.

# Editor
🪲 Extensions bar<br>
Only supports monochrome svgs

🪲 The developer tool, in addition to being floating without always staying in the foreground, when I start clicking to disable CSS rules after a while it jumps up, and I have to constantly scroll down.

# Git
🪲 In addition to numerous other problems, the "Source Code Control" extension indicates the current branch label at the top, but does not indicate when that branch was detached from its parent.

When I change branches, in addition to listing them in an absurd order and not listing them all and sometimes not even finding them, when for example I switch to main, it lists both the local main and the remote main, and this is confusing because they should be synchronized, but since it is not explicitly stated if they are the same, the doubt arises.