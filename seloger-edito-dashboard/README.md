# Taxonomie SeLoger Edito

Dashboard autonome (un seul fichier HTML) pour auditer les tags et catégories de https://edito.seloger.com/.

Trois onglets :

- **Mapping des tags** : libellé, slug, URL, nombre d'articles, catégories liées, nombre de libellés similaires. Recherche, filtre alphabétique, tri par colonne, copie CSV.
- **Mapping des catégories** : arborescence rubrique → sous-catégories (ou vue tableau) avec volumes d'articles.
- **Tags et catégories similaires** : groupes de libellés qui se recoupent, entre tags, entre catégories, et entre tag et catégorie (même sujet sur deux URLs).
  - *Doublon* : même libellé après normalisation (accents, casse, pluriel, mots vides « de, la, les… »).
  - *Variante* : mêmes mots dans un autre ordre, ou un libellé inclus dans l'autre à un mot près.
  - *Proche* : similarité des trigrammes (Dice) au-dessus du seuil réglable.

## Générer le dashboard avec le flux

```bash
python3 build.py                                    # flux https://editobasecamp.vercel.app/flux-taxonomies
python3 build.py data/flux.json                     # ou un fichier local
python3 build.py --seed                             # données d'exemple (collecte partielle)
```

Ouvrez ensuite `index.html` dans un navigateur. Le flux peut aussi être collé ou déposé directement dans la zone « Importer le flux JSON » du dashboard.

## Formats JSON acceptés

- `{"tags": [...], "categories": [...]}`
- un tableau d'objets `{name|label|title, url|link, count, parent, type}`
- un dictionnaire `{"libellé": "url"}`, ou une liste d'URLs
- une liste d'articles `{url, title, category, tags: [...]}` (les volumes sont alors calculés)

Le type est déduit de l'URL quand il n'est pas fourni : `/tags/…` → tag, `/rubrique/…` ou chemin de rubrique → catégorie.
