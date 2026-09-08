/* ------------------------------------------------------------------
   LUC Rugby - Stock Merchandising
   Configuration. C'est le seul fichier a modifier au quotidien.

   Ce fichier doit rester enregistre en UTF-8, sinon les accents
   s'affichent de travers sur le site et les photos des vetements
   ne sont plus retrouvees.
   ------------------------------------------------------------------ */

const CONFIG = {

  /* Les onglets du Google Sheet publies en CSV.
     Pour republier un onglet : Fichier > Partager > Publier sur le web,
     choisir l'onglet (jamais "Document entier"), format CSV.

     "sheet" doit correspondre exactement au nom de l'onglet dans le
     fichier Excel d'origine, sinon les photos ne seront pas retrouvees. */
  sources: [
    {
      key: 'vetements',
      label: 'Vêtements',
      sheet: 'Vêtements',
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNqcpe7ICT7tirDXmq9W4akWLSVti34wNGYk-Inm2XLgha9nPC9Uzy3BcXET3iRTzIiSNoxubywLHS/pub?gid=834958082&single=true&output=csv'
    },
    {
      key: 'accessoires',
      label: 'Accessoires',
      sheet: 'Accessoires',
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNqcpe7ICT7tirDXmq9W4akWLSVti34wNGYk-Inm2XLgha9nPC9Uzy3BcXET3iRTzIiSNoxubywLHS/pub?gid=702013270&single=true&output=csv'
    },
    {
      key: 'maillots',
      label: 'Anciens maillots',
      sheet: 'Anciens Maillots',
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNqcpe7ICT7tirDXmq9W4akWLSVti34wNGYk-Inm2XLgha9nPC9Uzy3BcXET3iRTzIiSNoxubywLHS/pub?gid=1728690396&single=true&output=csv'
    }
  ],

  /* La boutique en ligne. Elle n'a pas de stock a suivre, elle est donc
     definie ici et non dans le Google Sheet : la colonne "SHOP EN LIGNE"
     de l'onglet Vetements est ignoree par le site.

     La tuile est affichee en dernier dans toutes les categories.
     Pour la retirer completement, effacer l'adresse "url". */
  shop: {
    name: 'SHOP EN LIGNE',
    subtitle: '... et plus encore',
    url: 'https://akka-sports.com/1140-luc-rugby',
    linkLabel: 'Voir la boutique',
    image: 'img/shop-en-ligne.webp',
    /* Mots supplementaires qui permettent de trouver la tuile
       depuis la barre de recherche. */
    keywords: 'boutique shop en ligne akka sports'
  },

  /* Titre et sous-titre affiches dans l'en-tete, a cote du logo.
     C'est ici qu'on change la saison chaque annee. */
  title: 'Stock Merchandising',
  subtitle: 'LUC Rugby · saison 2026–2027',

  currency: 'CHF',

  /* Texte affiche dans l'encadre "Comment commander".
     Volontairement sans numero de telephone : le site est public. */
  howToOrder: 'Pour acheter un article, contactez le comité. Le paiement et la ' +
              'remise de la commande se font ensuite dans les vestiaires.',

  /* Masquer les tailles epuisees des le chargement. */
  hideSoldOutByDefault: false
};
