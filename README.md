# My Region — Custom Pokédex

Een moderne, data-driven Pokédex voor je eigen regio en Fakemon. Gebouwd met HTML, CSS en vanilla JavaScript, geschikt voor GitHub Pages.

## Inbegrepen functies

- Zoeken op naam, soort of Pokédexnummer
- Filteren op Pokémon-type en generatie
- Favorieten opslaan in `localStorage` van je browser
- Shiny-weergave (als `shinyImage` is ingevuld)
- Detailvenster met base stats en automatisch berekende BST
- Abilities, hidden ability, hoogte, gewicht en Pokédex-entry
- Level-up moves met type, categorie, power, accuracy en PP in de data
- Evolutielijn met klikbare vorige/volgende Pokémon
- Responsive ontwerp voor mobiel en desktop

## Bestanden

- `index.html` — pagina-opbouw
- `style.css` — vormgeving
- `script.js` — filters, favorieten, details en evoluties
- `data/pokemon.json` — jouw Pokémon-data
- `assets/pokemon/` — map om je artwork in te bewaren

## Je eigen Pokémon toevoegen

Open `data/pokemon.json`. Elk Pokémon-object gebruikt deze structuur:

```json
{
  "id": 7,
  "name": "JouwPokemon",
  "species": "Voorbeeld Pokémon",
  "types": ["Water", "Fairy"],
  "generation": 2,
  "height": 1.2,
  "weight": 18.5,
  "abilities": ["Torrent"],
  "hiddenAbility": "Water Veil",
  "stats": {
    "hp": 70,
    "attack": 65,
    "defense": 70,
    "spAttack": 95,
    "spDefense": 85,
    "speed": 80
  },
  "evolution": {
    "stage": 1,
    "previous": [],
    "next": [8],
    "method": "Evolueert op level 20"
  },
  "moves": [
    {
      "level": 1,
      "name": "Water Pulse",
      "type": "Water",
      "category": "Special",
      "power": 60,
      "accuracy": 100,
      "pp": 20
    }
  ],
  "description": "Schrijf hier je eigen Pokédex-entry.",
  "image": "assets/pokemon/007.png",
  "shinyImage": "assets/pokemon/007-shiny.png"
}
```

### Belangrijke regels

1. Geef iedere Pokémon een uniek `id`.
2. Gebruik bij `types` officiële typebenamingen zoals `Grass`, `Fire`, `Water`, `Dark`, `Fairy`, enzovoort.
3. De BST wordt automatisch berekend door de zes stats op te tellen.
4. Gebruik in `evolution.previous` en `evolution.next` de ID's van de andere Pokémon in de evolutielijn.
5. Gebruik paden relatief aan de hoofdmap voor artwork. Laat `image` of `shinyImage` leeg als je nog geen afbeelding hebt.
6. Voeg nieuwe Pokémon toe als objecten in de JSON-array. Let op komma's tussen objecten en geldige JSON-syntaxis.

**Let op:** de meegeleverde Pokémon zijn fictieve voorbeelddata om de functies te demonstreren. Vervang ze door jouw eigen Fakemon. De favorieten worden per browser/apparaat bewaard en zijn niet automatisch gedeeld met bezoekers.

## Lokaal testen

Omdat de Pokédex `fetch()` gebruikt om JSON te laden, moet je hem via een webserver openen. Bijvoorbeeld met de VS Code-extensie **Live Server**. Open daarna de lokale Live Server-link.

## Publiceren via GitHub Pages

1. Maak een GitHub-repository, bijvoorbeeld `my-region-pokedex`.
2. Upload alle bestanden en mappen uit deze projectmap naar de hoofdmap van de repository.
3. Ga naar **Settings → Pages**.
4. Kies bij **Build and deployment**: `Deploy from a branch`.
5. Kies branch `main` en map `/ (root)`, en klik op **Save**.
6. Wacht tot GitHub Pages de site heeft gepubliceerd. De website-URL verschijnt op de Pages-pagina.

## Artwork

Plaats je eigen PNG-, JPG- of WebP-bestanden in `assets/pokemon/`. Verwijs ernaar in `image` en `shinyImage` in `pokemon.json`.

## Licentie / fanproject

Dit is een onofficieel fanproject. Pokémon en gerelateerde merknamen behoren toe aan hun respectieve rechthebbenden. Gebruik je eigen originele Fakemon-artwork en content.
