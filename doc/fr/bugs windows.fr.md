Comme je l'ai écrit au moins deux fois sur mon blog,
> Windows ressemble à un buffet à volonté pour Timon et Pumbaa.

<img src="../it/buffet%20All%20You%20Can%20Eat%20per%20Timon%20e%20Pumbaa.jpg" width=300px>

Ceci est donc une brève sélection des bugs rencontrés uniquement pour la création de cette extension.

# Emoji
Je crois que, utilisées avec soin, elles sont très utiles. Pourtant, Windows semble détester les emojis en couleur.

Probablement depuis un navigateur, selon le navigateur, vous verrez les emojis drapeaux correctement affichés 🇮🇹 🇬🇧 🇫🇷 mais l'étiquette de l'extension affichera des lettres.

De plus, d'autres emojis, comme ⚠️ apparaissent souvent en noir et blanc. Mais d'autres fois, ils apparaissent inexplicablement en couleur.

Malheureusement, **il n'est pas possible de forcer l'affichage des drapeaux colorés dans l'étiquette (titre) de l'extension dans la barre latérale de VS Code sous Windows.**

## La raison technique

Le problème ne vient pas de votre code ou de VS Code, mais c'est une **limitation spécifique de Windows 10 et 11**.

1.  **Police système :** L'interface de VS Code ("Chrome" de l'application) utilise la police système (Segoe UI sous Windows).
2.  **Politique de Microsoft :** Microsoft a délibérément choisi de **ne pas inclure les glyphes de drapeaux colorés** dans son jeu d'emojis (Segoe UI Emoji). À la place, Windows affiche les codes régionaux à deux lettres (par exemple, "IT", "US", "FR").
3.  **Impossibilité de modification :** Étant donné que le titre du `viewsContainer` dans `package.json` est rendu par l'interface native de VS Code et n'est pas contrôlable en HTML/CSS par vous (contrairement à votre WebView), vous ne pouvez pas injecter une police personnalisée (comme "Twemoji" ou "Noto Color Emoji") pour corriger ce comportement.

> Sur macOS ou Android, la même extension afficherait correctement les drapeaux colorés.

Sous Windows, cependant, vous obtiendrez ceci<br>
![Comment les emojis sont affichés](../it/cattive%20emoji.png)

---

> Les emojis apparaissent-ils différemment selon la police utilisée ?

**Oui : les emojis peuvent apparaître différemment selon la police et la plateforme utilisées.** Chaque système d'exploitation, navigateur ou application utilise un ensemble de polices d'emojis (comme *Segoe UI Emoji* sous Windows, *Apple Color Emoji* sous macOS/iOS, *Noto Color Emoji* sous Android/Linux), ce qui détermine le style graphique avec lequel ils sont rendus.

### 🔍 Pourquoi les emojis changent d'apparence
- **Dépendance de la police** : un emoji est un caractère Unicode, mais son rendu visuel dépend de la police installée et choisie par le système. Si la police ne prend pas en charge un emoji, il peut apparaître comme un carré vide ou un symbole générique.
- **font-variant-emoji en CSS** : sur le web, il est possible de contrôler le rendu avec la propriété `font-variant-emoji`, qui décide d'afficher l'emoji comme du texte monochrome ou comme une icône colorée.
- **Différences entre les plateformes** : le même code Unicode (par exemple, 🍔) peut paraître "plat" sous Windows mais plus détaillé sous Android, car les polices d'emojis sont conçues différemment.
- **Mises à jour Unicode** : chaque nouvelle version d'Unicode ajoute des emojis, mais leur rendu dépend de la mise à jour de la police du système.


### 📊 Comparaison des principales polices d'emojis

| Plateforme / Police         | Style graphique | Caractéristiques |
|-----------------------------|---------------|-----------------|
| **Apple Color Emoji** (iOS/macOS) | Brillant, réaliste | Couleurs vives, détails soignés, très reconnaissable |
| **Segoe UI Emoji** (Windows) | Plus simple | Lignes épurées, moins de détails, parfois moins expressif |
| **Noto Color Emoji** (Android/Linux) | Neutre, universel | Design uniforme, conçu pour la compatibilité globale |
| **Twemoji** (Twitter/X) | Minimaliste | Style plat, lisible même à petite taille |

---

> Expliquez-moi font-variant-emoji et pourquoi c'est différent d'une police de caractères. Puis-je aussi l'utiliser dans les documents markdown ?

### 🎨 Qu'est-ce que `font-variant-emoji`
`font-variant-emoji` est une propriété **CSS** introduite pour contrôler le rendu des emojis dans un document web.
Elle a trois valeurs principales :

- **`text`** → affiche l'emoji comme un glyphe monochrome (similaire à un caractère typographique).
- **`emoji`** → force le rendu coloré, en utilisant la police d'emojis du système.
- **`unicode`** → laisse le navigateur/système décider s'il doit utiliser la version textuelle ou graphique.

Exemple en CSS :
```css
p {
  font-variant-emoji: emoji;
}
```

---

### 🔤 Différence par rapport à `@font-face`
- **`@font-face`** → sert à **définir et charger une police personnalisée** (par exemple, une police typographique ou un ensemble d'icônes).
- **`font-variant-emoji`** → ne charge pas de police, mais **décide du mode de rendu des emojis** déjà pris en charge par le système.

En d'autres termes :
- `@font-face` = “quelle police utiliser”
- `font-variant-emoji` = “comment rendre les emojis (texte vs graphique)”



### 📄 Puis-je l'utiliser en Markdown ?
Non, directement en **Markdown pur**, cela ne fonctionne pas.
Markdown est un langage de balisage léger et ne prend pas en charge les propriétés CSS. Cependant :
- Si le Markdown est **converti en HTML** (par exemple dans un site statique ou sur GitHub Pages), alors vous pouvez insérer du CSS et utiliser `font-variant-emoji`.
- Dans les documents Markdown affichés dans des éditeurs/textes (comme VS Code, Obsidian, GitHub), le rendu des emojis dépend de la **police d'emojis du système** ou du moteur de rendu de l'application, et non de `font-variant-emoji`.

### ✨ En résumé
- `font-variant-emoji` est une propriété CSS qui contrôle si les emojis apparaissent comme du texte ou comme des icônes colorées.
- Elle est différente de `@font-face` car elle ne concerne pas le choix de la police, mais le mode d'affichage des emojis.
- En Markdown, vous не pouvez pas l'utiliser directement, mais cela fonctionne si le Markdown est transformé en HTML avec du CSS appliqué.

---

> N'avez-vous pas dit que l'affichage des emojis dépend de la police ?

Vous avez raison : l'affichage des emojis **dépend de la police utilisée**.
Mettons de l'ordre dans les deux concepts que nous avons abordés :

### 🔤 Emojis et polices
- Chaque emoji est défini par un **code Unicode** (par exemple, 🍕 = U+1F355).
- Son apparence dépend de la **police d'emojis** disponible sur le système (Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, etc.).
- Si la police n'a pas de dessin pour cet emoji, il peut apparaître comme un carré vide ou un symbole générique.
➡️ Donc oui, la police détermine le **style graphique** de l'emoji.


### 🎨 Rôle de `font-variant-emoji`
- Cette propriété CSS ne change pas la police, mais indique au navigateur **comment interpréter les emojis** : comme du texte monochrome ou comme une icône colorée.
- En pratique : la police fournit le dessin, tandis que `font-variant-emoji` décide d'utiliser la version "textuelle" ou "graphique".



👉 En résumé : **la police établit l'apparence des emojis**, tandis que `font-variant-emoji` est un "interrupteur" qui indique au navigateur s'il doit les afficher comme du texte ou comme des emojis graphiques.

---

> Préparez-moi un exemple HTML où les emojis 🇮🇹 🇬🇧 🇫🇷 (et d'autres qui changent de manière significative) sont affichés avec différentes polices, telles que Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, et d'autres polices avec des variations significatives ; et avec font-variant-emoji emoji ou text.<br>
Vous devrez ensuite générer un tableau avec deux lignes pour chaque police, en-tête avec le nom de la police et de la variante, et autant de colonnes que d'emojis. Le tableau doit toujours être affiché dans le navigateur de la même manière, quel que soit le système utilisé.

Je comprends bien votre demande : vous voulez un **exemple HTML** qui montre un tableau avec différents emojis (drapeaux 🇮🇹 🇬🇧 🇫🇷 et d'autres qui changent beaucoup entre les polices), rendus avec diverses polices et avec les deux modes de `font-variant-emoji` (`emoji` et `text`).

⚠️ **Remarque importante** : il n'est pas possible de garantir que le rendu soit "toujours le même quel que soit le système utilisé", car les polices comme *Apple Color Emoji* ou *Segoe UI Emoji* sont propriétaires et uniquement disponibles sur des plateformes spécifiques. Si la police n'est pas installée sur le système, le navigateur utilisera une solution de repli.
Pour obtenir une uniformité, vous devriez intégrer une police d'emojis open-source (par exemple *Noto Color Emoji*) via `@font-face`. Les polices propriétaires (Apple, Microsoft) ne peuvent pas être distribuées librement.

Cela dit, voici un **exemple HTML** qui montre la structure que vous demandez, avec un tableau et des lignes pour chaque police/variante. Vous pouvez l'adapter en chargeant les polices disponibles sur votre système ou en incluant des polices open-source via webfont :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Comparaison des polices Emoji</title>
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
  <h1>Comparaison des Emoji avec différentes polices et variantes</h1>
  <table>
    <thead>
      <tr>
        <th>Police / Variante</th>
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



### 🔑 Que fait cet exemple
- Chaque police a **deux lignes** : une avec `font-variant-emoji: emoji` et une avec `font-variant-emoji: text`.
- Les colonnes montrent des emojis qui changent beaucoup entre les polices (drapeaux, smiley, cœur, pizza).
- Si la police n'est pas disponible sur le système, le navigateur utilisera une solution de repli.

---

Cela démontre donc scientifiquement que le droit d'auteur viole le droit à la libre information, car il n'est pas possible de montrer à quoi ressemblent les emojis

Vous pouvez essayer le code sur https://www.w3schools.com/html/tryit.asp?filename=tryhtml_basic