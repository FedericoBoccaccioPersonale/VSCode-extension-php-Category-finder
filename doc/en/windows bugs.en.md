As I wrote at least twice on my blog,
> Windows seems like an all-you-can-eat buffet for Timon and Pumbaa.

<img src="../it/buffet%20All%20You%20Can%20Eat%20per%20Timon%20e%20Pumbaa.jpg" width=300px>

So this is a brief selection of the bugs encountered just for the creation of this extension.

# Emoji
I believe that when used carefully, they are very useful. Yet Windows seems to hate color emojis.

Probably from a browser, depending on the browser, you will see the flag emojis correctly showing the actual flag 🇮🇹 🇬🇧 🇫🇷 but the extension's label will show letters.

Moreover, other emojis, like ⚠️ often appear in black and white. But other times they inexplicably appear in color.

Unfortunately, **it is not possible to force the display of colored flags in the extension's label (title) in the VS Code sidebar on Windows.**

## The technical reason

The problem is not in your code or in VS Code, but it is a **specific limitation of Windows 10 and 11**.

1.  **System font:** The VS Code interface ("Chrome" of the application) uses the system font (Segoe UI on Windows).
2.  **Microsoft policy:** Microsoft has deliberately chosen **not to include colored flag glyphs** in its emoji set (Segoe UI Emoji). Instead, Windows renders the two-letter regional codes (e.g., "IT", "US", "FR").
3.  **Impossibility of modification:** Since the title of the `viewsContainer` in `package.json` is rendered by the native VS Code interface and is not controllable HTML/CSS by you (unlike your WebView), you cannot inject a custom font (like "Twemoji" or "Noto Color Emoji") to correct this behavior.

> On macOS or Android, the same extension would correctly show the colored flags.

On Windows, however, you will get this<br>
![How emojis are displayed](../it/cattive%20emoji.png)

---

> Do emojis appear different depending on the font in use?

**Yes: emojis can appear different depending on the font and platform in use.** Each operating system, browser, or application uses a set of emoji fonts (like *Segoe UI Emoji* on Windows, *Apple Color Emoji* on macOS/iOS, *Noto Color Emoji* on Android/Linux), and this determines the graphic style with which they are rendered.

### 🔍 Why emojis change appearance
- **Font dependency**: an emoji is a Unicode character, but its visual rendering depends on the font installed and chosen by the system. If the font does not support an emoji, it may appear as an empty square or a generic symbol.
- **font-variant-emoji in CSS**: on the web, it is possible to control the rendering with the `font-variant-emoji` property, which decides whether to show the emoji as monochrome text or as a colored icon.
- **Differences between platforms**: the same Unicode code (e.g., 🍔) can look "flat" on Windows but more detailed on Android, because the emoji fonts are designed differently.
- **Unicode updates**: each new version of Unicode adds emojis, but their rendering depends on the system's font update.


### 📊 Comparison of major emoji fonts

| Platform / Font         | Graphic style | Characteristics |
|-----------------------------|---------------|-----------------|
| **Apple Color Emoji** (iOS/macOS) | Glossy, realistic | Vivid colors, curated details, very recognizable |
| **Segoe UI Emoji** (Windows) | Simpler | Clean lines, fewer details, sometimes less expressive |
| **Noto Color Emoji** (Android/Linux) | Neutral, universal | Uniform design, designed for global compatibility |
| **Twemoji** (Twitter/X) | Minimalist | Flat style, readable even at small sizes |

---

> Explain font-variant-emoji and why it is different from a font face. Can I also use it in markdown documents?

### 🎨 What is `font-variant-emoji`
`font-variant-emoji` is a **CSS** property introduced to control how emojis are rendered in a web document.
It has three main values:

- **`text`** → shows the emoji as a monochrome glyph (similar to a typographic character).
- **`emoji`** → forces the colored rendering, using the system's emoji font.
- **`unicode`** → lets the browser/system decide whether to use the textual or graphic version.

Example in CSS:
```css
p {
  font-variant-emoji: emoji;
}
```

---

### 🔤 Difference from `@font-face`
- **`@font-face`** → is used to **define and load a custom font** (e.g., a typographic font or an icon set).
- **`font-variant-emoji`** → does not load a font, but **decides the rendering mode of emojis** already supported by the system.

In other words:
- `@font-face` = “which font to use”
- `font-variant-emoji` = “how to render emojis (text vs graphics)”



### 📄 Can I use it in Markdown?
No, directly in **pure Markdown** it does not work.
Markdown is a lightweight markup language and does not support CSS properties. However:
- If the Markdown is **converted to HTML** (for example in a static site or on GitHub Pages), then you can insert CSS and use `font-variant-emoji`.
- In Markdown documents displayed in editors/texts (like VS Code, Obsidian, GitHub), the rendering of emojis depends on the **system's emoji font** or the app's rendering engine, not on `font-variant-emoji`.

### ✨ In summary
- `font-variant-emoji` is a CSS property that controls whether emojis appear as text or as colored icons.
- It is different from `@font-face` because it does not concern the choice of font, but the display mode of emojis.
- In Markdown you cannot use it directly, but it works if the Markdown is transformed into HTML with CSS applied.

---

> Didn't you say that the emoji display depends on the font?

You are right: the display of emojis **depends on the font in use**.
Let's sort out the two concepts we have touched on:

### 🔤 Emojis and fonts
- Each emoji is defined by a **Unicode code** (e.g., 🍕 = U+1F355).
- The way it appears depends on the **emoji font** available on the system (Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, etc.).
- If the font does not have a design for that emoji, it may appear as an empty square or a generic symbol.
➡️ So yes, the font determines the **graphic style** of the emoji.


### 🎨 Role of `font-variant-emoji`
- This CSS property does not change the font, but tells the browser **how to interpret emojis**: as monochrome text or as a colored icon.
- In practice: the font provides the design, while `font-variant-emoji` decides whether to use the "textual" or "graphic" version.



👉 In summary: **the font establishes the appearance of emojis**, while `font-variant-emoji` is a "switch" that tells the browser whether to show them as text or as graphic emojis.

---

> Prepare an HTML example where the emojis 🇮🇹 🇬🇧 🇫🇷 (and others that change significantly) are displayed with different fonts, such as Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, and other fonts with significant variations; and with font-variant-emoji emoji or text.<br>
You will then have to generate a table with two rows for each font, headed with the font name and the variant, and as many columns as there are emojis. The table should always be displayed in the browser the same regardless of the system in use.

I understand your request well: you want an **HTML example** that shows a table with different emojis (flags 🇮🇹 🇬🇧 🇫🇷 and others that change a lot between fonts), rendered with various fonts and with both `font-variant-emoji` modes (`emoji` and `text`).

⚠️ **Important note**: it is not possible to guarantee that the rendering is "always the same regardless of the system in use", because fonts like *Apple Color Emoji* or *Segoe UI Emoji* are proprietary and only available on specific platforms. If the font is not installed on the system, the browser will use a fallback.
To achieve uniformity, you should embed an open-source emoji font (for example *Noto Color Emoji*) via `@font-face`. Proprietary fonts (Apple, Microsoft) cannot be freely distributed.

That said, here is an **HTML example** that shows the structure you are asking for, with a table and rows for each font/variant. You can adapt it by loading the fonts available on your system or by including open-source ones via webfont:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Emoji Font Comparison</title>
  <style>
    table {
      border-collapse: collapse;
      width: 100%;
      text-align: center;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }
    .segoe-emoji {
      font-family: "Segoe UI Emoji", sans-serif;
    }
    .apple-emoji {
      font-family: "Apple Color Emoji", sans-serif;
    }
    .noto-emoji {
      font-family: "Noto Color Emoji", sans-serif;
    }
    .twemoji {
      font-family: "Twemoji Mozilla", sans-serif;
    }
    .variant-emoji {
      font-variant-emoji: emoji;
    }
    .variant-text {
      font-variant-emoji: text;
    }
  </style>
</head>
<body>
  <h1>Emoji Comparison with different fonts and variants</h1>
  <table>
    <thead>
      <tr>
        <th>Font / Variant</th>
        <th>🇮🇹</th>
        <th>🇬🇧</th>
        <th>🇫🇷</th>
        <th>😀</th>
        <th>❤️</th>
        <th>🍕</th>
      </tr>
    </thead>
    <tbody>
      <!-- Segoe UI Emoji -->
      <tr class="segoe-emoji variant-emoji">
        <td>Segoe UI Emoji (emoji)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>
      <tr class="segoe-emoji variant-text">
        <td>Segoe UI Emoji (text)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>

      <!-- Apple Color Emoji -->
      <tr class="apple-emoji variant-emoji">
        <td>Apple Color Emoji (emoji)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>
      <tr class="apple-emoji variant-text">
        <td>Apple Color Emoji (text)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>

      <!-- Noto Color Emoji -->
      <tr class="noto-emoji variant-emoji">
        <td>Noto Color Emoji (emoji)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>
      <tr class="noto-emoji variant-text">
        <td>Noto Color Emoji (text)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>

      <!-- Twemoji (Mozilla) -->
      <tr class="twemoji variant-emoji">
        <td>Twemoji Mozilla (emoji)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>
      <tr class="twemoji variant-text">
        <td>Twemoji Mozilla (text)</td>
        <td>🇮🇹</td><td>🇬🇧</td><td>🇫🇷</td><td>😀</td><td>❤️</td><td>🍕</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
```



### 🔑 What this example does
- Each font has **two rows**: one with `font-variant-emoji: emoji` and one with `font-variant-emoji: text`.
- The columns show emojis that change a lot between fonts (flags, smiley face, heart, pizza).
- If the font is not available on the system, the browser will use a fallback.

---

This therefore scientifically demonstrates that copyright violates the right to free information, because it is not possible to show what emojis look like

You can try the code at https://www.w3schools.com/html/tryit.asp?filename=tryhtml_basic