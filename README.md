# Stock Merchandising — LUC Rugby

Petit site statique qui affiche le stock de merchandising du club : vêtements,
accessoires et anciens maillots, avec les tailles et les numéros encore
disponibles.

Le site est **uniquement en consultation**. La gestion du stock continue de se
faire dans le Google Sheet, exactement comme avant.

---

## Comment ça marche

```
Google Sheet (gestion)  ──publié en CSV──▶  site GitHub Pages (consultation)
```

Le site lit les trois onglets du Google Sheet publiés en CSV et affiche ce
qu'il y trouve. Il n'y a **rien à faire après une vente** : on modifie la
quantité dans le Sheet, et le site suit tout seul quelques minutes plus tard.

Les photos, elles, sont stockées dans le dépôt (dossier `img/`), parce qu'un
CSV ne peut pas contenir d'images.

---

## Mettre le site en ligne (une seule fois)

1. Sur [github.com](https://github.com), cliquer **New repository**.
2. Nom : `luc-rugby-stock`. Visibilité : **Public**.
   GitHub Pages n'est pas disponible sur un dépôt privé avec un compte gratuit.
3. Cliquer **Create repository**.
4. Sur la page suivante, cliquer **uploading an existing file**.
5. Glisser-déposer **le contenu** de ce dossier, c'est-à-dire :
   `index.html`, `styles.css`, `app.js`, `config.js`, `manifest.json`,
   `README.md`, `.gitignore`, et les dossiers `img/`, `data/` et `outils/`.
   Ne pas glisser le dossier parent lui-même.

   > **Ne jamais envoyer** `Gestion Merch 2025 - 2026.xlsx` ni `oldMerch.zip`.
   > Le fichier Excel contient l'onglet `Comment Acheter`, donc un numéro de
   > téléphone personnel, et le dépôt est public. Le fichier `.gitignore` est
   > là pour l'empêcher, mais un glisser-déposer manuel dans l'interface de
   > GitHub passe outre : il faut donc les sélectionner soi-même.
6. Cliquer **Commit changes**.
7. Aller dans **Settings ▸ Pages**.
8. Sous *Source*, choisir **Deploy from a branch**, branche `main`,
   dossier `/ (root)`, puis **Save**.
9. Attendre une ou deux minutes. L'adresse s'affiche en haut de la page :
   `https://<votre-compte>.github.io/luc-rugby-stock/`

C'est cette adresse à partager avec les membres du club.

---

## À savoir sur la confidentialité

Le dépôt est public, donc :

- **le site est visible par toute personne ayant l'adresse.** Il n'y a pas de
  mot de passe possible avec GitHub Pages gratuit ;
- **les trois adresses CSV sont lisibles** dans `config.js`. Elles donnent
  accès en lecture seule aux trois onglets publiés, sans compte Google ;
- pour cette raison, **aucun numéro de téléphone ne figure sur le site**. Le
  texte de commande renvoie simplement vers le comité. Si vous ajoutez un
  contact, souvenez-vous que la page est publique et indexable ;
- l'onglet `Comment Acheter`, qui contient un numéro personnel, **n'est pas
  publié** et ne doit pas l'être.

---

## Conçu pour le téléphone

Le site est pensé d'abord pour un écran de téléphone, puisque c'est là que les
membres le consulteront :

- sur téléphone, **une ligne par produit** avec une vignette à gauche, pour que
  les tailles disposent de toute la largeur ;
- au-delà de 620 px de large, l'affichage passe automatiquement en **grille de
  cartes** avec de grandes photos ;
- la **barre de recherche et les catégories restent collées en haut** pendant le
  défilement, donc toujours accessibles au pouce ;
- toutes les zones à toucher font au moins 38 px de haut, et le champ de
  recherche est en 16 px pour éviter le zoom automatique d'iOS ;
- les encoches et coins arrondis des téléphones récents sont pris en compte.

### Ajouter le site à l'écran d'accueil

À conseiller aux membres : le site s'installe comme une application, sans
passer par un magasin d'applications.

- **iPhone** (Safari) : bouton *Partager* ▸ **Sur l'écran d'accueil**.
- **Android** (Chrome) : menu ▸ **Ajouter à l'écran d'accueil**.

L'icône est le logo du club sur fond bleu, et le site s'ouvre alors en plein
écran sous le nom « Stock LUC ».

### Remplacer le logo

Déposer le nouveau fichier dans `img/` sous le nom `logo.svg`. Pour que les
icônes d'écran d'accueil suivent, il faut aussi régénérer `img/icon-192.png`,
`img/icon-512.png` et `img/apple-touch-icon.png` : ce sont de simples carrés
bleu marine (`#063465`) avec le logo centré, occupant environ 76 % de la
surface.

---

## Modifier le stock au quotidien

Rien de spécial : on modifie le Google Sheet.

Il faut simplement **conserver la mise en page existante**, car le site la lit
telle quelle. La colonne A sert d'espace ; chaque produit occupe ensuite un
bloc de **deux colonnes accolées** (B/C, puis D/E, puis F/G, etc.) :

| ligne | contenu | exemple |
|-------|---------|---------|
| 1 | marque | `LUC RUGBY` |
| 2 | nom du produit | `Polo Homme` |
| 3 | photo | *(ignorée par le site)* |
| 4 | prix | `30` |
| 5 | en-têtes | `Quantité` puis `Taille` |
| 6 et suivantes | le stock | `8` / `S` |

Deux types de blocs sont reconnus :

- **`Quantité` + `Taille`** — une ligne par taille, avec le nombre de pièces.
  Utilisé pour les vêtements et les accessoires.
- **`Numéro` + `Taille`** — une ligne par pièce physique, avec son numéro.
  Utilisé pour les anciens maillots. Le site compte les lignes pour obtenir la
  quantité et liste les numéros disponibles. `Sans Numéro` s'affiche `sans n°`.

### Ajouter un produit

1. Se placer dans les **deux premières colonnes libres** à droite du dernier
   produit de l'onglet.
2. Dans la colonne de **gauche** : ligne 1 la marque, ligne 2 le nom, ligne 4
   le prix. Laisser la colonne de droite vide sur les lignes 1 à 4.
3. Ligne 5 : `Quantité` à gauche et `Taille` à droite (ou `Numéro` et `Taille`
   pour un ancien maillot).
4. Ligne 6 et suivantes : une ligne par taille (ou par maillot).

Le site l'affiche quelques minutes plus tard, avec la mention
« Photo à venir » jusqu'à ce qu'une photo soit ajoutée (voir la section
suivante). Coller une photo dans la ligne 3 du Sheet ne suffit pas : le site
ne lit pas les images du fichier de gestion.

### Supprimer un produit

- **Tout un produit** : supprimer ses deux colonnes (clic droit ▸ *Supprimer
  les colonnes*). Les produits suivants se décalent, ce n'est pas un problème.
  Retirer ensuite son entrée dans `data/image-manifest.json`.
- **Une taille épuisée** : mettre la quantité à `0` pour l'afficher barrée
  avec la mention « épuisé », ou supprimer la ligne pour la faire disparaître.
- **Un maillot vendu** : supprimer sa ligne. La quantité et la liste des
  numéros se recalculent seules.

### Ce qui fonctionne sans rien casser

- changer une quantité, ajouter ou supprimer une ligne ;
- renommer un produit ou un onglet — en pensant à renommer aussi la clé
  correspondante dans `data/image-manifest.json` ;
- laisser des lignes vides au milieu d'un bloc ;
- écrire une note d'état entre parenthèses, par exemple `2XL (terre)`. Le site
  retire la parenthèse et regroupe la taille avec les autres `2XL`.

### Ce qui casse l'affichage d'un produit

- insérer une colonne **au milieu** d'un bloc de deux colonnes ;
- écrire le nom du produit dans la colonne de **droite** de la ligne 2 : cela
  peut créer un produit fantôme en double ;
- déplacer les en-têtes `Quantité` / `Taille` sur une autre ligne pour un seul
  produit : le site cherche **une** ligne d'en-têtes valable pour tout l'onglet ;
- écrire le mot `Quantité`, `Stock` ou `Numéro` quelque part dans les lignes 1
  à 4 : il serait pris pour la ligne d'en-têtes ;
- écrire une note dans la colonne de **gauche** d'une ligne de stock : elle
  serait comptée comme une quantité ou comme un maillot de plus. Les notes vont
  dans la colonne de droite ;
- **supprimer puis recréer un onglet** : son identifiant `gid` change et
  l'adresse CSV correspondante ne fonctionne plus. Il faut alors republier
  l'onglet et coller la nouvelle adresse dans `config.js`.

Les tailles sont triées dans cet ordre : `XS S M L XL 2XL … 6XL TU`, puis les
tailles numériques (40, 42, 55, 58), puis tout libellé non reconnu. Écrire
`2XL` plutôt que `XXL`, sinon la taille se retrouve en fin de liste.

---

## La boutique en ligne

La tuile « SHOP EN LIGNE » n'a pas de stock à suivre : elle **n'est plus lue
dans le Google Sheet** mais définie dans `config.js`, et elle apparaît **en
dernier dans toutes les catégories** (Tout, Vêtements, Accessoires, Anciens
maillots).

```js
shop: {
  name: 'SHOP EN LIGNE',
  subtitle: '... et plus encore',
  url: 'https://akka-sports.com/1140-luc-rugby',
  linkLabel: 'Voir la boutique',
  image: 'img/shop-en-ligne.webp',
  keywords: 'boutique shop en ligne akka sports'
}
```

- `keywords` sert uniquement à retrouver la tuile depuis la barre de recherche.
- Pour retirer la tuile du site, effacer le contenu de `url`.
- La colonne « SHOP EN LIGNE » de l'onglet *Vêtements* peut rester dans le
  Google Sheet : le site l'ignore. La modifier n'a plus aucun effet sur le
  site, c'est bien dans `config.js` qu'il faut agir.

---

## Ajouter la photo d'un nouveau produit

Toutes les photos du site suivent la même recette : **carrées**, **fond
transparent**, le produit centré et le plus grand possible, en `.webp`. C'est
ce qui donne au catalogue son aspect homogène : le fond bleu clair de la carte
apparaît à travers la photo, donc on ne voit plus les rectangles noirs des
photos d'origine.

1. Photographier le produit **sur un fond noir uni** (ou blanc uni), bien à
   plat, sans ombre portée trop marquée.
2. Passer la photo dans l'outil de retouche (voir *Retoucher les photos*
   ci-dessous), qui détache le fond, recadre et harmonise la lumière.
3. La déposer dans le dossier `img/` du dépôt
   (**Add file ▸ Upload files** sur GitHub).
3. Ouvrir `data/image-manifest.json`, cliquer sur le crayon, et ajouter une
   entrée sous le bon onglet. Le nom doit être **identique** à celui du
   Google Sheet :

```json
"Vêtements": {
  "Polo Homme": ["img/polo-homme.webp"],
  "Nouveau produit": ["img/nouveau-produit.webp"]
}
```

Sans entrée dans ce fichier, le produit s'affiche quand même, avec la mention
« Photo à venir ».

La photo de la boutique en ligne ne se trouve pas dans ce fichier : elle est
indiquée par `shop.image` dans `config.js`.

### Retoucher les photos

Le script `outils/retouche-photos.py` fait le travail en une commande. Il ne
fait pas partie du site : il n'est utile que sur un ordinateur, au moment de
préparer de nouvelles photos.

Il faut Python avec les bibliothèques `pillow`, `numpy` et `scipy` :

```
py -m pip install pillow numpy scipy
py outils/retouche-photos.py <dossier_des_photos_brutes> <dossier_de_sortie>
```

Le script, pour chaque photo :

- rend le fond uni transparent, en partant du bord de l'image, ce qui évite de
  trouer les vêtements bleu marine, presque aussi sombres que le fond noir ;
- recadre sur le vêtement, le centre sur un carré et le laisse occuper toute la
  place disponible, avec 4 % de marge ;
- harmonise l'exposition d'une photo à l'autre en se calant sur les zones
  neutres du vêtement (l'écusson blanc, un liseré blanc), jamais sur les
  couleurs du produit.

**Toujours garder les photos d'origine ailleurs** avant de remplacer celles de
`img/` : la retouche n'est pas réversible.

---

## Republier un onglet en CSV

À faire seulement si une adresse CSV ne fonctionne plus.

1. Dans le Google Sheet : **Fichier ▸ Partager ▸ Publier sur le web**.
2. À gauche, choisir **l'onglet concerné**. Jamais *Document entier* : cela
   publierait aussi l'onglet contenant le numéro de téléphone.
3. À droite, choisir **Valeurs séparées par des virgules (.csv)**.
4. Vérifier que *Republier automatiquement lorsque des modifications sont
   apportées* est coché, puis **Publier**.
5. Copier l'adresse obtenue et la coller dans `config.js`, à la place de
   l'ancienne, en gardant les guillemets.

---

## Fichiers du dépôt

| Fichier | Rôle |
|---------|------|
| `index.html` | structure de la page |
| `styles.css` | mise en forme |
| `app.js` | lecture du CSV et affichage |
| `config.js` | **adresses CSV, boutique en ligne et textes** — le seul fichier à modifier |
| `.gitignore` | empêche l'envoi du fichier Excel et des archives sur GitHub |
| `manifest.json` | permet l'ajout à l'écran d'accueil du téléphone |
| `data/image-manifest.json` | correspondance produit → photo |
| `data/snapshot.json` | copie de secours du stock |
| `img/` | les photos des produits (carrées, fond transparent) |
| `outils/retouche-photos.py` | outil de préparation des photos, pas utilisé par le site |
| `img/logo.svg` | logo officiel du club, affiché dans l'en-tête |
| `img/icon-192.png`, `img/icon-512.png`, `img/apple-touch-icon.png` | icônes d'écran d'accueil, générées depuis le logo |

### À propos de `data/snapshot.json`

C'est un filet de sécurité. Si Google est injoignable, le site affiche ces
chiffres plutôt qu'une page vide, avec un bandeau
« Affichage de la dernière sauvegarde ». Tant que la lecture en direct
fonctionne, ce fichier n'est jamais utilisé.

Il n'a pas besoin d'être tenu à jour. Si le bandeau apparaît et que les
chiffres sont visiblement anciens, c'est le signe que la lecture en direct est
cassée : vérifier les adresses dans `config.js`.

---

## En cas de problème

**Une catégorie est vide.** L'adresse CSV de cet onglet ne répond plus.
Coller l'adresse dans un navigateur en navigation privée : si ce n'est pas du
texte brut avec des virgules, republier l'onglet.

**Le bandeau « Affichage de la dernière sauvegarde » reste affiché.**
Même cause. Voir ci-dessus.

**Un produit n'apparaît pas.** Son bloc ne respecte pas le schéma :
vérifier que la ligne 5 contient bien `Quantité` (ou `Numéro`) puis `Taille`,
et que le nom est bien en ligne 2.

**Les accents s'affichent mal en ouvrant le CSV dans Excel.** C'est normal et
sans conséquence : Excel lit le fichier dans un ancien encodage. Le site, lui,
force l'UTF-8 et affiche correctement les accents.

**Le site affiche « VÃªtements » et les photos des vêtements ont disparu.**
`config.js` a été enregistré dans un autre encodage que l'UTF-8. Le nom de
l'onglet ne correspond plus à celui de `data/image-manifest.json`, donc les
photos ne sont plus retrouvées. Ré-enregistrer `config.js` en **UTF-8**
(dans le Bloc-notes : *Enregistrer sous* ▸ *Codage : UTF-8*).

**Une modification du Sheet n'apparaît pas.** Google garde le CSV en cache
quelques minutes. Attendre, puis recharger la page.
