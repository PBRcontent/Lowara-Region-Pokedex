# My Region Pokédex

Een moderne Pokédex voor je eigen regio. Zoek een Pokémon, bekijk eerst de afbeelding en klik op de kaart om de volledige data te openen.

## Functies
- Zoeken op naam of Pokédexnummer
- Resultaten als afbeelding-kaarten; details verschijnen pas na aanklikken
- Filters op type en generatie
- Shiny-afbeeldingen als je `shinyImage` invult
- Base stats en automatische BST
- Abilities, hoogte, gewicht en Pokédex-entry
- Moveset met level, type, category, power, accuracy en PP
- Klikbare evolutielijn
- Favorietenfilter

## Pokémon toevoegen
Bewerk `data/pokemon.json`. Kopieer een bestaand object, geef een uniek `id` en vul de velden in. Zet artwork bijvoorbeeld in `assets/pokemon/007.png` en gebruik `"image": "assets/pokemon/007.png"`; voor shiny `"shinyImage": "assets/pokemon/007-shiny.png"`.

De stats zijn `hp`, `attack`, `defense`, `spAttack`, `spDefense`, `speed`. De BST wordt automatisch opgeteld. In `evolution.previous` en `evolution.next` zet je de ID's van de vorige en volgende vormen.

## GitHub Pages
Upload de inhoud van deze map naar de hoofdmap van je GitHub-repository. Ga naar Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.

De Pokémon in de meegeleverde JSON zijn fictieve voorbeelddata. Vervang ze door je eigen Fakemon. Favorieten worden in de browser van de bezoeker opgeslagen.
