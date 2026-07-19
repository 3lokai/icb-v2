import assert from "node:assert/strict";
import { test } from "node:test";

import { cleanCoffeeName, getCoffeeDisplayName } from "./coffee-name";

test("decodes HTML entities", () => {
  assert.equal(
    cleanCoffeeName("Maillard&#8217;s Dream &#8211; Kerehaklu"),
    "Maillard’s Dream – Kerehaklu"
  );
  assert.equal(
    cleanCoffeeName("Plantation A &#038; Peaberry Blend"),
    "Plantation A & Peaberry Blend"
  );
  assert.equal(
    cleanCoffeeName("Mercara Gold Estate Plantation Arabica &#8220;A&#8221;"),
    "Mercara Gold Estate Plantation Arabica “A”"
  );
});

test("strips pipe suffixes, with or without surrounding spaces", () => {
  assert.equal(
    cleanCoffeeName(
      "RATNAGIRI Crimson Cranberry Burst - Value | Auto Discounted | No Codes"
    ),
    "Ratnagiri Crimson Cranberry Burst - Value"
  );
  assert.equal(
    cleanCoffeeName("Buy Caramel Latte online in India |Tariero Coffees"),
    "Buy Caramel Latte Online in India"
  );
});

test("strips trailing weight suffixes", () => {
  assert.equal(
    cleanCoffeeName("The Daily Driver 100% ARABICA – 500g"),
    "The Daily Driver 100% Arabica"
  );
  assert.equal(
    cleanCoffeeName("Ground Coffee - Araku Valley - Pack of 250g"),
    "Ground Coffee - Araku Valley"
  );
  assert.equal(
    cleanCoffeeName("Northeast Adventures - 250g"),
    "Northeast Adventures"
  );
  assert.equal(cleanCoffeeName("Wholesale Coffee - 1kg"), "Wholesale Coffee");
  assert.equal(
    cleanCoffeeName("Single Origin Robusta - Assam 250g"),
    "Single Origin Robusta - Assam"
  );
});

test("strips parenthesised weights", () => {
  assert.equal(cleanCoffeeName("A1 Naturals (250g)"), "A1 Naturals");
  assert.equal(cleanCoffeeName("Jangala Ra Dhana(250g)"), "Jangala Ra Dhana");
});

test("handles em-dash vs hyphen separators and trailing junk", () => {
  assert.equal(
    cleanCoffeeName(
      "VINUM OBSCURA - Intenso Yeast Ferment - | Auto Discounted"
    ),
    "Vinum Obscura - Intenso Yeast Ferment"
  );
  assert.equal(
    cleanCoffeeName("Malakodu &#8211;  Robusta Royale"),
    "Malakodu – Robusta Royale"
  );
  assert.equal(
    cleanCoffeeName("Everyday Gold – Affordable Value | Auto Discounted"),
    "Everyday Gold – Affordable Value"
  );
});

test("title-cases, including branded all-caps names", () => {
  assert.equal(cleanCoffeeName("BRUTE FORCE"), "Brute Force");
  assert.equal(cleanCoffeeName("DARK MATTER"), "Dark Matter");
  assert.equal(
    cleanCoffeeName("RATNAGIRI ESTATE- YEAST CARBONIC NATURALS"),
    "Ratnagiri Estate- Yeast Carbonic Naturals"
  );
  assert.equal(cleanCoffeeName("KARMA [NUGGETS]"), "Karma [Nuggets]");
});

test("title-casing preserves grade codes and possessives", () => {
  assert.equal(cleanCoffeeName("Plantation AAA"), "Plantation AAA");
  assert.equal(
    cleanCoffeeName("MYSORE NUGGETS EXTRA BOLD 'AAA'"),
    "Mysore Nuggets Extra Bold 'AAA'"
  );
  assert.equal(cleanCoffeeName("Maillard’s Dream"), "Maillard’s Dream");
  assert.equal(cleanCoffeeName("CO-FERMENT"), "Co-Ferment");
});

test("lower-cases minor words except at the edges", () => {
  assert.equal(cleanCoffeeName("NOTES OF THE FOREST"), "Notes of the Forest");
  assert.equal(cleanCoffeeName("THE ARTIST'S BLEND"), "The Artist's Blend");
});

test("leaves already-clean names alone", () => {
  assert.equal(cleanCoffeeName("Attikan Estate"), "Attikan Estate");
  assert.equal(
    cleanCoffeeName("Baarbara Frozen Cherry"),
    "Baarbara Frozen Cherry"
  );
});

test("handles null / empty input", () => {
  assert.equal(cleanCoffeeName(null), "");
  assert.equal(cleanCoffeeName(undefined), "");
  assert.equal(cleanCoffeeName(""), "");
});

test("getCoffeeDisplayName prefers display_name, falls back to cleaned name", () => {
  assert.equal(
    getCoffeeDisplayName({
      display_name: "Kerehaklu Nocturne",
      name: "RAW &#8211; junk",
    }),
    "Kerehaklu Nocturne"
  );
  assert.equal(
    getCoffeeDisplayName({
      display_name: null,
      name: "BRUTE FORCE | No Codes",
    }),
    "Brute Force"
  );
  assert.equal(
    getCoffeeDisplayName({ display_name: "   ", name: "FALLBACK NAME" }),
    "Fallback Name"
  );
  assert.equal(getCoffeeDisplayName(null), "");
});

test("strips mid-string parenthesised weights without stranding the bracket", () => {
  assert.equal(
    cleanCoffeeName(
      "Premium Filter Coffee - Vienna Roast (250 gm) - By Fraction 9 Coffee Roasters"
    ),
    "Premium Filter Coffee - Vienna Roast - by Fraction 9 Coffee Roasters"
  );
});

test("drops a bracket group left unclosed by an earlier strip", () => {
  assert.equal(
    cleanCoffeeName(
      "Northeast Cold Brew – Premium Cold Brew Coffee Bags (5 Sachets | 250g )"
    ),
    "Northeast Cold Brew – Premium Cold Brew Coffee Bags"
  );
  assert.equal(
    cleanCoffeeName(
      "Monsoon Mist – Dark Roast (250g, Single Origin, 100% Arabica Coffee)"
    ),
    "Monsoon Mist – Dark Roast"
  );
});

test("preserves industry acronyms in the preserve set", () => {
  assert.equal(
    cleanCoffeeName("Ratnagiri Estate (SCA 86+)"),
    "Ratnagiri Estate (SCA 86+)"
  );
});

test("capitalises after ampersand and preserves quoted grade letters", () => {
  assert.equal(
    cleanCoffeeName("Lavazza R&G Rossa Ground Coffee"),
    "Lavazza R&G Rossa Ground Coffee"
  );
  assert.equal(
    cleanCoffeeName("Premium Grade 'A' Coffee Beans"),
    "Premium Grade 'A' Coffee Beans"
  );
  assert.equal(
    cleanCoffeeName("Plantation A & Peaberry Blend"),
    "Plantation A & Peaberry Blend"
  );
});

test("strips a trailing roaster name when provided", () => {
  assert.equal(
    cleanCoffeeName("Mysore Nuggets - Red Sirocco", "Red Sirocco"),
    "Mysore Nuggets"
  );
  assert.equal(
    cleanCoffeeName("Arakku Valley - Red Sirocco", "Red Sirocco"),
    "Arakku Valley"
  );
  assert.equal(
    cleanCoffeeName(
      "Premium Filter Coffee - Vienna Roast (250 gm) - By Fraction 9 Coffee Roasters",
      "Fraction 9 Coffee"
    ),
    "Premium Filter Coffee - Vienna Roast"
  );
});

test("leaves leading roaster names intact", () => {
  assert.equal(
    cleanCoffeeName(
      "Mercara Gold Estate Peaberry Plantation Robusta",
      "Mercara Gold Estate"
    ),
    "Mercara Gold Estate Peaberry Plantation Robusta"
  );
  assert.equal(
    cleanCoffeeName("Coffee Plus Classics Subscription", "Coffee Plus"),
    "Coffee Plus Classics Subscription"
  );
});

test("roaster strip never empties a name", () => {
  assert.equal(
    cleanCoffeeName("Shodh Coffee™ | India", "Shodh Coffee"),
    "Shodh Coffee™"
  );
  assert.equal(cleanCoffeeName("Red Sirocco", "Red Sirocco"), "Red Sirocco");
});

test("roaster strip is a no-op when no roaster is passed", () => {
  assert.equal(
    cleanCoffeeName("Mysore Nuggets - Red Sirocco"),
    "Mysore Nuggets - Red Sirocco"
  );
});

test("strips the 'Price in India' SEO tail", () => {
  assert.equal(
    cleanCoffeeName(
      "GRAM COFFEE ROASTERS Peahen Arabica Espresso Blend Coffee Price in India - Buy GRAM COFFEE ROASTERS Peahen Arabica Espresso Blend Coffee online at https://gramcoffeeroasters.co.in"
    ),
    "Gram Coffee Roasters Peahen Arabica Espresso Blend Coffee"
  );
});

test("capitalises through word-initial quotes and non-ASCII letters", () => {
  assert.equal(cleanCoffeeName("'Man On Mars' Blend"), "'Man on Mars' Blend");
  assert.equal(cleanCoffeeName("Ārabhi"), "Ārabhi");
  assert.equal(cleanCoffeeName("CAFÉ NOIR"), "Café Noir");
  // possessives must still not capitalise mid-word
  assert.equal(cleanCoffeeName("TARIERO’S RAIN SONG"), "Tariero’s Rain Song");
});

test("preserves acronyms and codes that were upper-case in the source", () => {
  assert.equal(cleanCoffeeName("SKIA Red Honey"), "SKIA Red Honey");
  assert.equal(
    cleanCoffeeName("ABK FARM ARABICA WASHED DARK ROAST"),
    "ABK Farm Arabica Washed Dark Roast"
  );
  assert.equal(cleanCoffeeName("MNEB"), "MNEB");
  assert.equal(cleanCoffeeName("Ratnagiri SL 28"), "Ratnagiri SL 28");
  assert.equal(
    cleanCoffeeName("Garigekhan Estate - CAT - 129"),
    "Garigekhan Estate - CAT - 129"
  );
  assert.equal(cleanCoffeeName("M.S. Estate"), "M.S. Estate");
  assert.equal(
    cleanCoffeeName("BEWILD Anoxic Naturals"),
    "BEWILD Anoxic Naturals"
  );
});

test("does NOT uppercase lower-case words that collide with a code", () => {
  assert.equal(cleanCoffeeName("wild cat blend"), "Wild Cat Blend");
  assert.equal(cleanCoffeeName("Ms Nirmala's Lot"), "Ms Nirmala's Lot");
});

test("still title-cases plain words that were merely shouted", () => {
  assert.equal(
    cleanCoffeeName("BERRY NOIR - Zoya Estate"),
    "Berry Noir - Zoya Estate"
  );
  assert.equal(cleanCoffeeName("VELVET HARMONY"), "Velvet Harmony");
  assert.equal(cleanCoffeeName("ROBUSTA KAAPI ROYALE"), "Robusta Kaapi Royale");
});

test("strips emoji but keeps trademark/legal marks", () => {
  assert.equal(cleanCoffeeName("MOST WANTED DOPE 🚨🚨🚨"), "Most Wanted Dope");
  assert.equal(cleanCoffeeName("Shodh Coffee™ | India"), "Shodh Coffee™");
  assert.equal(cleanCoffeeName("Cold Brew ☕ Blend"), "Cold Brew Blend");
  assert.equal(cleanCoffeeName("Fire Roast 🔥️ Special"), "Fire Roast Special");
  assert.equal(cleanCoffeeName("Estate Reserve®"), "Estate Reserve®");
});

test("leaves Indic scripts and their combining marks intact", () => {
  assert.equal(cleanCoffeeName("Jiva / जीव"), "Jiva / जीव");
  assert.equal(
    cleanCoffeeName("Blend Akasha/ ಬ್ಲೆಂಡ್ ಆಕಾಶ"),
    "Blend Akasha/ ಬ್ಲೆಂಡ್ ಆಕಾಶ"
  );
});

test("getCoffeeDisplayName accepts embedded roaster as object or array", () => {
  assert.equal(
    getCoffeeDisplayName({
      display_name: null,
      name: "Mysore Nuggets - Red Sirocco",
      roasters: { name: "Red Sirocco" },
    }),
    "Mysore Nuggets"
  );
  assert.equal(
    getCoffeeDisplayName({
      display_name: null,
      name: "Mysore Nuggets - Red Sirocco",
      roasters: [{ name: "Red Sirocco" }],
    }),
    "Mysore Nuggets"
  );
  assert.equal(
    getCoffeeDisplayName({
      display_name: null,
      name: "Mysore Nuggets - Red Sirocco",
      roaster_name: "Red Sirocco",
    }),
    "Mysore Nuggets"
  );
  assert.equal(
    getCoffeeDisplayName({
      display_name: null,
      name: "Plain Name",
      roasters: [],
    }),
    "Plain Name"
  );
});

test("keeps unit/lot codes attached to numbers upper-case", () => {
  assert.equal(
    cleanCoffeeName("Kerehaklu 62H Mosto Culture Naturals"),
    "Kerehaklu 62H Mosto Culture Naturals"
  );
  assert.equal(
    cleanCoffeeName("MOOLEH MANAY 120H CARBONIC NATURALS"),
    "Mooleh Manay 120H Carbonic Naturals"
  );
  assert.equal(
    cleanCoffeeName("BEWILD Permaculture 180H Anoxic Naturals"),
    "BEWILD Permaculture 180H Anoxic Naturals"
  );
});
