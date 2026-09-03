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
   `README.md`, et les dossiers `img/` et `data/`.
   Ne pas glisser le dossier parent lui-même, et ne pas envoyer le fichier
   Excel.
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
telle quelle. Chaque produit occupe un bloc de deux colonnes :

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
  quantité et liste les numéros disponibles.

Ce qui fonctionne sans rien casser :

- changer une quantité, ajouter ou supprimer une ligne ;
- renommer un produit ou un onglet ;
- ajouter un nouveau produit, en respectant le schéma ci-dessus et en laissant
  une colonne vide entre deux blocs ;
- écrire une note d'état entre parenthèses, par exemple `2XL (terre)`. Le site
  retire la parenthèse et regroupe la taille avec les autres `2XL`.

Ce qui casse l'affichage d'un produit :

- insérer une colonne **au milieu** d'un bloc de deux colonnes ;
- déplacer les en-têtes `Quantité` / `Taille` sur une autre ligne ;
- **supprimer puis recréer un onglet** : son identifiant `gid` change et
  l'adresse CSV correspondante ne fonctionne plus. Il faut alors republier
  l'onglet et coller la nouvelle adresse dans `config.js`.

---

## Ajouter la photo d'un nouveau produit

1. Préparer une image carrée, idéalement 700 × 700 px, en `.webp` ou `.jpg`.
2. La déposer dans le dossier `img/` du dépôt
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
| `config.js` | **adresses CSV et textes** — le seul fichier à modifier |
| `manifest.json` | permet l'ajout à l'écran d'accueil du téléphone |
| `data/image-manifest.json` | correspondance produit → photo |
| `data/snapshot.json` | copie de secours du stock |
| `img/` | les photos des produits |
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

**Une modification du Sheet n'apparaît pas.** Google garde le CSV en cache
quelques minutes. Attendre, puis recharger la page.
