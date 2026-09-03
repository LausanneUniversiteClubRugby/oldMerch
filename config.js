/* ------------------------------------------------------------------
   LUC Rugby - Stock Merchandising
   Configuration. C'est le seul fichier a modifier au quotidien.
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

  currency: 'CHF',

  /* Texte affiche dans l'encadre "Comment commander".
     Volontairement sans numero de telephone : le site est public. */
  howToOrder: 'Pour acheter un article, contactez le comité. Le paiement et la ' +
              'remise de la commande se font ensuite dans les vestiaires.',

  /* Masquer les tailles epuisees des le chargement. */
  hideSoldOutByDefault: false
};
