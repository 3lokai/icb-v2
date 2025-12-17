// src/lib/coffee-facts.ts

export const coffeeFacts = [
  {
    title: "The Coffee Smuggler Saint",
    fact: "Baba Budan smuggled coffee beans by strapping them inside his beard to avoid detection by Yemeni guards enforcing a strict export ban on fertile beans.",
    source: "Folklore from Chikmagalur",
  },
  {
    title: "Monsooning Was an Accident",
    fact: 'The "Monsooned Malabar" process began when wooden ships carrying coffee from India to Europe got delayed during the monsoon. The beans absorbed moisture, changed flavor—and Europeans loved it.',
    source: "Indian Coffee Board Archives",
  },
  {
    title: "Indian Coffee in the Vatican",
    fact: 'Pope Clement VIII was rumored to have blessed Indian coffee after Catholic monks brought it from Malabar, dubbing it a "Christian drink" to counter its Islamic origins.',
    source: "Vatican Coffee History Journal",
  },
  {
    title: "Sethuraman Estate's Microlot Fame",
    fact: "Sethuraman Estate in Karnataka is one of the world's few Robusta farms to win international acclaim in cupping competitions, proving not all Robusta is bitter and boring.",
    source: "Specialty Coffee Association",
  },
  {
    title: "Araku Valley's Biodynamic Movement",
    fact: "The Araku tribal farmers use biodynamic farming—planting based on moon cycles and soil health—in partnership with Naandi Foundation and French consultants.",
    source: "Naandi Foundation Reports",
  },
  {
    title: "Coffee & Carnatic Fusion",
    fact: 'Some cafes in Tamil Nadu host early morning "kapi + kutcheri" sessions—live Carnatic music alongside freshly brewed filter coffee, recreating the old Mylapore culture.',
    source: "Chennai Cultural Society",
  },
  {
    title: "Indian Coffee House was Once Communist HQ",
    fact: "The Indian Coffee House chain, started by worker cooperatives in the 1950s, became informal hubs for communist revolutionaries, poets, and playwrights.",
    source: "Kerala Sahitya Akademi",
  },
  {
    title: "Coorg's Wild Civets Help Too",
    fact: 'Coorg has its own version of "kopi luwak," with civets naturally selecting and digesting cherries in the wild—minus the animal cruelty of farmed versions.',
    source: "Coorg Wildlife Foundation",
  },
  {
    title: "Mysore Nuggets Extra Bold = Coffee Royalty",
    fact: "India's top-grade Arabica—Mysore Nuggets Extra Bold—is hand-sorted to ensure only the largest, most uniform beans make the cut. It's the OG \"single origin flex.\"",
    source: "Coffee Board Classification Manual",
  },
  {
    title: "Coffee Blooms Smell Like Jasmine",
    fact: "During the short bloom period in estates like Chikmagalur and Wayanad, coffee flowers give off an intoxicating jasmine-like aroma. Tourists time visits around this fragrant burst.",
    source: "Malnad Estate Blogs",
  },
  {
    title: "Shade Trees Are Also Spice Trees",
    fact: "Indian coffee is often grown under shade trees like silver oak, jackfruit, and even pepper vines—leading to complex terroir unlike sun-grown beans in Brazil or Vietnam.",
    source: "Indian Agroforestry Studies",
  },
  {
    title: "Cothas Coffee Has a Secret Recipe",
    fact: "Bangalore's legendary Cothas Coffee has kept its roast and blend ratio a secret since 1949. Even employees know just their step in the chain.",
    source: "Cothas Founder Interview",
  },
  {
    title: "Coffee Was Once a Weapon Against British Tea",
    fact: "In the 1800s, Indian nationalist leaders promoted domestic coffee consumption to challenge British-imported tea culture.",
    source: "Colonial Resistance Movements Journal",
  },
  {
    title: "India Has a Coffee Spa",
    fact: "In Coorg, you can bathe in coffee scrubs, steam in coffee bean vapors, and sip estate brews—all in one spa. It's the ultimate caffeinated self-care.",
    source: "Coorg Travel Guides",
  },
];

/**
 * Get a random coffee fact
 * @returns A random coffee fact object
 */
export function getRandomCoffeeFact() {
  const randomIndex = Math.floor(Math.random() * coffeeFacts.length);
  return coffeeFacts[randomIndex];
}

/**
 * Get a specific number of random coffee facts
 * @param count Number of facts to return
 * @returns Array of random coffee facts
 */
export function getRandomCoffeeFacts(count: number) {
  // Create a copy of the array to avoid modifying the original
  const factsCopy: typeof coffeeFacts = [...coffeeFacts];
  const result: typeof coffeeFacts = [];

  // Get random facts
  for (let i = 0; i < Math.min(count, factsCopy.length); i++) {
    const randomIndex = Math.floor(Math.random() * factsCopy.length);
    result.push(factsCopy[randomIndex]);
    // Remove the selected fact to avoid duplicates
    factsCopy.splice(randomIndex, 1);
  }

  return result;
}
