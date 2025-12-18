// src/lib/tools/expert-recipes.ts

import type {
  BrewingMethodKey,
  RoastLevel,
  StrengthLevel,
} from "./brewing-guide";

export type ExpertKey =
  | "hoffman-v60"
  | "hoffman-french-press"
  | "tetsu-kasuya-46"
  | "scott-rao-v60"
  | "carolina-aeropress"
  | "intelligentsia-pourover"
  | "hoffman-chemex"
  | "george-aeropress-2024";

export type RecipeStep = {
  time: string; // e.g., "0:00", "0:45", "1:15"
  timeSeconds: number; // for timer integration
  instruction: string;
  waterAmount?: number; // optional amount in grams
  pourNumber?: number; // which pour this is (1, 2, 3, etc.)
};

export type ExpertRecipe = {
  id: ExpertKey;
  slug: string; // e.g. "hoffman-v60" - explicit for routing/CMS
  title: string;
  expert: {
    name: string;
    title: string;
    achievement: string;
    year?: number;
  };
  method: BrewingMethodKey;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  difficultyIndex: number; // 1 = Beginner, 2 = Intermediate, 3 = Advanced

  // Recipe basics
  coffee: number; // grams
  water: number; // grams/ml - total water including bypass
  bypassWater?: number; // optional bypass water amount
  ratio: string; // e.g., "1:15"
  grind: string;
  temperature: string;
  totalTime: string;

  // Extended details
  roastRecommendation: RoastLevel[];
  strengthLevel: StrengthLevel;
  flavorProfile: string;
  flavorNotes: string[]; // structured flavor descriptors
  recommendedUse: "everyday" | "competition" | "experiment";

  // Story and context
  story: string;
  keyTechnique: string;
  tips: string[];

  // Step-by-step process
  steps: RecipeStep[];

  // Media and resources
  youtubeUrl?: string;
  sourceUrlType?: "blog" | "video" | "championship" | "brand";
  equipmentRecommendations: string[];

  // Metadata
  tags: Set<string>; // faster lookup for filtering
};

export const EXPERT_RECIPES: Record<ExpertKey, ExpertRecipe> = {
  "hoffman-v60": {
    id: "hoffman-v60",
    slug: "hoffman-v60",
    title: "Hoffman V60 Technique",
    expert: {
      name: "James Hoffmann",
      title: "Coffee Expert & YouTuber",
      achievement: "World Barista Champion 2007",
    },
    method: "v60",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 30,
    water: 500,
    ratio: "1:16.7",
    grind: "Medium-fine",
    temperature: "95°C",
    totalTime: "3:30",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "average",
    flavorProfile: "Clean, balanced, highlighting origin characteristics",
    flavorNotes: ["clean", "balanced", "bright", "origin-forward"],
    recommendedUse: "everyday",

    story:
      "James Hoffmann's technique focuses on achieving maximum clarity and even extraction through controlled pouring and strategic stirring. This method became widely popular through his YouTube channel and represents modern specialty coffee brewing.",
    keyTechnique:
      "Strategic stirring and swirling to ensure even extraction and prevent channeling",
    tips: [
      "Use scales for precise measurements",
      "Pour in concentric circles from center outward",
      "Stir clockwise then counterclockwise after final pour",
      "Focus on even saturation during bloom",
    ],

    steps: [
      {
        time: "Before",
        timeSeconds: 0,
        instruction: "Rinse paper filter with hot water",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Bloom with 60ml, wait 45s",
        waterAmount: 60,
        pourNumber: 1,
      },
      {
        time: "0:45",
        timeSeconds: 45,
        instruction: "Pour 240ml in 30s. Total: 300g",
        waterAmount: 240,
        pourNumber: 2,
      },
      {
        time: "1:15",
        timeSeconds: 75,
        instruction: "Pour 200ml in 30s. Total: 500g",
        waterAmount: 200,
        pourNumber: 3,
      },
      {
        time: "1:45",
        timeSeconds: 105,
        instruction:
          "Stir 1x clockwise and 1x counterclockwise, swirl, and let it draw down",
      },
      {
        time: "3:30",
        timeSeconds: 210,
        instruction: "Brewing complete - remove dripper",
      },
    ],

    youtubeUrl: "https://www.youtube.com/watch?v=AI4ynXzkSQo",
    sourceUrlType: "video",
    equipmentRecommendations: [
      "Hario V60 (plastic recommended)",
      "Gooseneck kettle",
      "Digital scale",
      "Timer",
      "Quality grinder",
    ],

    tags: new Set([
      "v60",
      "pour-over",
      "james-hoffmann",
      "intermediate",
      "clarity",
      "everyday",
    ]),
  },

  "hoffman-french-press": {
    id: "hoffman-french-press",
    slug: "hoffman-french-press",
    title: "Ultimate French Press",
    expert: {
      name: "James Hoffmann",
      title: "Coffee Expert & YouTuber",
      achievement: "World Barista Champion 2007",
    },
    method: "frenchpress",
    difficulty: "Beginner",
    difficultyIndex: 1,

    coffee: 30,
    water: 500,
    ratio: "1:16.7",
    grind: "Coarse",
    temperature: "95°C",
    totalTime: "12:00+",

    roastRecommendation: ["medium", "dark"],
    strengthLevel: "average",
    flavorProfile: "Full-bodied, clean, minimal sediment",
    flavorNotes: ["full-bodied", "clean", "rich", "smooth"],
    recommendedUse: "everyday",

    story:
      "Hoffmann's French Press technique revolutionizes the traditional method by introducing a longer steeping time and surface skimming. This approach produces a much cleaner cup with less sediment than conventional French Press methods.",
    keyTechnique:
      "Surface skimming and extended steeping for cleaner extraction",
    tips: [
      "Use coarse, even grind to prevent over-extraction",
      "Skim surface foam completely for cleaner taste",
      "Wait 5+ minutes after skimming before pressing",
      "Press gently to avoid disturbing sediment",
    ],

    steps: [
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Combine coffee and water, let it sit for 4 minutes",
        waterAmount: 500,
      },
      {
        time: "4:00",
        timeSeconds: 240,
        instruction:
          "Grab two spoons, stir the crust on the top, scoop away everything floating",
      },
      {
        time: "4:00+",
        timeSeconds: 240,
        instruction:
          "Do nothing for 5+ minutes (read newspaper, make breakfast, start a rebellion)",
      },
      {
        time: "12:00+",
        timeSeconds: 720,
        instruction:
          "Put plunger right up to surface of coffee, pour and enjoy",
      },
    ],

    youtubeUrl: "https://www.youtube.com/watch?v=st571DYYTR8",
    sourceUrlType: "video",
    equipmentRecommendations: [
      "French Press (any size)",
      "Two spoons for skimming",
      "Coarse grinder",
      "Digital scale",
      "Timer",
    ],

    tags: new Set([
      "french-press",
      "james-hoffmann",
      "beginner",
      "full-body",
      "long-steep",
      "everyday",
    ]),
  },

  "tetsu-kasuya-46": {
    id: "tetsu-kasuya-46",
    slug: "tetsu-kasuya-46",
    title: "Tetsu Kasuya 4:6 Method",
    expert: {
      name: "Tetsu Kasuya",
      title: "Coffee Professional",
      achievement: "World Brewers Cup Champion 2016",
      year: 2016,
    },
    method: "v60",
    difficulty: "Advanced",
    difficultyIndex: 3,

    coffee: 20,
    water: 300,
    ratio: "1:15",
    grind: "Coarse",
    temperature: "92°C",
    totalTime: "3:30",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "average",
    flavorProfile: "Balanced, sweet, adjustable acidity and strength",
    flavorNotes: ["balanced", "sweet", "systematic", "adjustable"],
    recommendedUse: "competition",

    story:
      "The 4:6 method divides brewing into precise phases: the first 40% controls sweetness and acidity balance, while the remaining 60% controls strength. This championship-winning technique allows for systematic flavor adjustment without changing grind size.",
    keyTechnique:
      "Systematic water division - 40% for flavor balance, 60% for strength control",
    tips: [
      "First 40% adjusts sweetness/acidity: smaller first pour = sweeter",
      "Last 60% adjusts strength: more pours = stronger",
      "Use coarse grind like French Press",
      "Pour every 45 seconds for consistency",
      "Multiply coffee weight by 3 for each pour amount",
    ],

    steps: [
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 50ml (42% of first 40%)",
        waterAmount: 50,
        pourNumber: 1,
      },
      {
        time: "0:45",
        timeSeconds: 45,
        instruction: "Pour 70ml (58% of first 40%). Total: 120ml",
        waterAmount: 70,
        pourNumber: 2,
      },
      {
        time: "1:30",
        timeSeconds: 90,
        instruction: "Pour 60ml (remaining 60% - pour 1/3). Total: 180ml",
        waterAmount: 60,
        pourNumber: 3,
      },
      {
        time: "2:15",
        timeSeconds: 135,
        instruction: "Pour 60ml (remaining 60% - pour 2/3). Total: 240ml",
        waterAmount: 60,
        pourNumber: 4,
      },
      {
        time: "3:00",
        timeSeconds: 180,
        instruction: "Pour 60ml (remaining 60% - final pour). Total: 300ml",
        waterAmount: 60,
        pourNumber: 5,
      },
      {
        time: "3:30",
        timeSeconds: 210,
        instruction: "Brewing complete - remove dripper",
      },
    ],

    sourceUrlType: "championship",
    equipmentRecommendations: [
      "Hario V60 (preferably Kasuya model)",
      "Coarse grinder",
      "Digital scale",
      "Gooseneck kettle",
      "Timer",
    ],

    tags: new Set([
      "v60",
      "tetsu-kasuya",
      "advanced",
      "4-6-method",
      "championship",
      "systematic",
      "competition",
    ]),
  },

  "scott-rao-v60": {
    id: "scott-rao-v60",
    slug: "scott-rao-v60",
    title: "Scott Rao V60 Method",
    expert: {
      name: "Scott Rao",
      title: "Coffee Consultant & Author",
      achievement: "Industry Expert & Educator",
    },
    method: "v60",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 22,
    water: 360,
    ratio: "1:16.4",
    grind: "Medium-fine",
    temperature: "93°C",
    totalTime: "2:15",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "average",
    flavorProfile: "Clean, uniform extraction, minimal channeling",
    flavorNotes: ["clean", "uniform", "consistent", "precise"],
    recommendedUse: "everyday",

    story:
      "Scott Rao's method prioritizes uniform extraction through aggressive agitation and careful technique. His approach reduces channeling and improves repeatability, making it ideal for commercial settings while producing exceptional clarity.",
    keyTechnique:
      "Aggressive bloom stirring and strategic agitation for uniform extraction",
    tips: [
      "Use plastic V60 for better heat retention",
      "Stir aggressively during bloom phase",
      "Make a small well in coffee bed before brewing",
      "Focus on preventing channeling through technique",
      "Rao spin helps level the coffee bed",
    ],

    steps: [
      {
        time: "Before",
        timeSeconds: 0,
        instruction:
          'Grind coffee and make a small "bird\'s nest" well in the grounds',
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 60ml, then immediately spin the bloom aggressively",
        waterAmount: 60,
      },
      {
        time: "0:40",
        timeSeconds: 40,
        instruction: "Wait for 40 seconds, then pour until total of 200ml",
        waterAmount: 140,
      },
      {
        time: "1:00",
        timeSeconds: 60,
        instruction: "Do a very gentle spin (less than one second)",
      },
      {
        time: "1:20",
        timeSeconds: 80,
        instruction: "Wait until slurry is 70% drained, then pour to 330ml",
        waterAmount: 130,
      },
      {
        time: "1:40",
        timeSeconds: 100,
        instruction: "Do another very gentle spin",
      },
      {
        time: "2:15",
        timeSeconds: 135,
        instruction: "Brewing complete",
      },
    ],

    youtubeUrl: "https://www.scottrao.com/blog/2017/9/14/v60-video",
    sourceUrlType: "blog",
    equipmentRecommendations: [
      "Plastic Hario V60 (strongly recommended)",
      "High-quality grinder",
      "Digital scale",
      "Gooseneck kettle",
      "Wooden stirring paddle",
    ],

    tags: new Set([
      "v60",
      "scott-rao",
      "intermediate",
      "uniform-extraction",
      "commercial",
      "everyday",
    ]),
  },

  "carolina-aeropress": {
    id: "carolina-aeropress",
    slug: "carolina-aeropress",
    title: "Carolina's Championship AeroPress",
    expert: {
      name: "Carolina Ibarra Garay",
      title: "Barista",
      achievement: "World AeroPress Champion 2018",
      year: 2018,
    },
    method: "aeropress",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 34.9,
    water: 300, // 200 brew + 100 bypass
    bypassWater: 100,
    ratio: "1:8.6",
    grind: "Medium-fine",
    temperature: "85°C",
    totalTime: "1:30",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "robust",
    flavorProfile: "Sweet, syrupy texture, complex acidity, citrus notes",
    flavorNotes: ["sweet", "syrupy", "complex", "citrus", "acidic"],
    recommendedUse: "competition",

    story:
      "Carolina's 2018 championship-winning recipe impressed judges with its exceptional sweetness and syrupy texture. Using a lower temperature and vigorous stirring technique, this method captures complex acidity and citrus flavors beautifully.",
    keyTechnique:
      "Vigorous stirring with chopsticks and temperature control for sweetness",
    tips: [
      "Use wooden chopsticks for stirring (better than spoon)",
      "Don't preheat the serving vessel",
      "Grind coffee to setting 8/10 on EK43S equivalent",
      "Maintain 85°C throughout the process",
      "Press slowly and steadily for 30 seconds",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Set up AeroPress in inverted position, rinse filter with hot water",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 100g water for 30 seconds",
        waterAmount: 100,
      },
      {
        time: "0:30",
        timeSeconds: 30,
        instruction:
          "Stir vigorously but carefully with wooden chopsticks for 30 seconds",
      },
      {
        time: "1:00",
        timeSeconds: 60,
        instruction:
          "Put filter cap on, flip AeroPress and press into glass server for 30 seconds",
      },
      {
        time: "1:30",
        timeSeconds: 90,
        instruction:
          "Top up brew with 60g of 85°C water and 40g room temperature water",
        waterAmount: 100,
      },
    ],

    sourceUrlType: "championship",
    equipmentRecommendations: [
      "AeroPress",
      "Paper filters",
      "Wooden chopsticks",
      "Digital scale",
      "Temperature-controlled kettle",
      "Glass server",
    ],

    tags: new Set([
      "aeropress",
      "championship",
      "carolina-garay",
      "intermediate",
      "sweet",
      "inverted",
      "competition",
    ]),
  },

  "intelligentsia-pourover": {
    id: "intelligentsia-pourover",
    slug: "intelligentsia-pourover",
    title: "Intelligentsia Pour Over",
    expert: {
      name: "Intelligentsia Coffee",
      title: "Third Wave Coffee Pioneer",
      achievement: "Industry Leader & Innovator",
    },
    method: "pourover",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 26,
    water: 468,
    ratio: "1:18",
    grind: "Fine",
    temperature: "95°C",
    totalTime: "4:00",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "mild",
    flavorProfile: "Bright, clean, excellent extraction, origin-focused",
    flavorNotes: ["bright", "clean", "origin-forward", "systematic"],
    recommendedUse: "everyday",

    story:
      "Intelligentsia's systematic approach to pour-over brewing emphasizes precise ratios and methodical technique. As third-wave coffee pioneers, their method focuses on highlighting origin characteristics through optimal extraction.",
    keyTechnique:
      "Systematic three-pour technique with emphasis on even saturation",
    tips: [
      "Use 1:18 ratio for optimal extraction level",
      "Pour in slow, concentric circles from center outward",
      "Ensure even saturation during bloom phase",
      "Focus on highlighting origin characteristics",
      "Use fine grind for maximum extraction",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Rinse filter thoroughly with hot water, discard rinse water",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction:
          "Pour 3x coffee weight in water (78g) slowly in clockwise pattern for bloom",
        waterAmount: 78,
      },
      {
        time: "0:30",
        timeSeconds: 30,
        instruction:
          "Begin main pour - add water in systematic concentric circles",
      },
      {
        time: "2:00",
        timeSeconds: 120,
        instruction: "Continue pouring to reach total 468g water",
      },
      {
        time: "4:00",
        timeSeconds: 240,
        instruction: "Brewing complete - remove dripper",
      },
    ],

    sourceUrlType: "brand",
    equipmentRecommendations: [
      "Chemex, V60, or Kalita Wave",
      "Fine grinder setting (5-6)",
      "Gooseneck kettle",
      "Digital scale",
      "Quality filters",
    ],

    tags: new Set([
      "pour-over",
      "intelligentsia",
      "intermediate",
      "systematic",
      "third-wave",
      "everyday",
    ]),
  },

  "hoffman-chemex": {
    id: "hoffman-chemex",
    slug: "hoffman-chemex",
    title: "Hoffman Ultimate Chemex",
    expert: {
      name: "James Hoffmann",
      title: "Coffee Expert & YouTuber",
      achievement: "World Barista Champion 2007",
    },
    method: "chemex",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 30,
    water: 500,
    ratio: "1:16.7",
    grind: "Medium-coarse",
    temperature: "95°C",
    totalTime: "4:30",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "average",
    flavorProfile: "Ultra-clean, bright, tea-like clarity, no sediment",
    flavorNotes: [
      "ultra-clean",
      "bright",
      "tea-like",
      "clarity",
      "sediment-free",
    ],
    recommendedUse: "experiment",

    story:
      "Hoffmann's Chemex technique leverages the thick filters for maximum clarity while ensuring even extraction. This method produces an exceptionally clean cup that highlights the brightest aspects of specialty coffee.",
    keyTechnique:
      "Slow, controlled pouring with Chemex's thick filters for ultra-clean extraction",
    tips: [
      "Use Chemex-branded filters for proper thickness",
      "Rinse filter thoroughly to remove papery taste",
      "Grind slightly coarser than V60 due to thick filter",
      "Pour slower than other methods to prevent overflow",
      "Focus on even saturation with controlled flow rate",
    ],

    steps: [
      {
        time: "Before",
        timeSeconds: 0,
        instruction:
          "Rinse Chemex filter thoroughly with hot water, discard rinse water",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Bloom with 60ml, wait 45s",
        waterAmount: 60,
        pourNumber: 1,
      },
      {
        time: "0:45",
        timeSeconds: 45,
        instruction: "Pour 240ml in 30s. Total: 300g",
        waterAmount: 240,
        pourNumber: 2,
      },
      {
        time: "1:15",
        timeSeconds: 75,
        instruction: "Pour 200ml in 30s. Total: 500g",
        waterAmount: 200,
        pourNumber: 3,
      },
      {
        time: "1:45",
        timeSeconds: 105,
        instruction:
          "Stir 1x clockwise and 1x counterclockwise, swirl, and let it draw down",
      },
      {
        time: "4:30",
        timeSeconds: 270,
        instruction: "Brewing complete - remove dripper",
      },
    ],

    youtubeUrl: "https://www.youtube.com/watch?v=ikt-X5x7yoc",
    sourceUrlType: "video",
    equipmentRecommendations: [
      "Chemex brewer",
      "Chemex-branded filters",
      "Gooseneck kettle",
      "Digital scale",
      "Timer",
      "Medium-coarse grinder",
    ],

    tags: new Set([
      "chemex",
      "james-hoffmann",
      "intermediate",
      "clean",
      "bright",
      "clarity",
      "experiment",
    ]),
  },

  "george-aeropress-2024": {
    id: "george-aeropress-2024",
    slug: "george-aeropress-2024",
    title: "George's 2024 AeroPress Champion",
    expert: {
      name: "George Stanica",
      title: "Software Engineer & Home Brewer",
      achievement: "World AeroPress Champion 2024",
      year: 2024,
    },
    method: "aeropress",
    difficulty: "Advanced",
    difficultyIndex: 3,

    coffee: 18,
    water: 155, // ~75g concentrate + 50-55g hot bypass + 20-30g room temp bypass
    bypassWater: 80, // Combined bypass
    ratio: "1:8.6",
    grind: "Medium",
    temperature: "96°C + bypass",
    totalTime: "1:35",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "average",
    flavorProfile: "Pleasant mouthfeel, highlighting sweetness and acidity",
    flavorNotes: ["sweet", "acidic", "pleasant-mouthfeel", "complex", "modern"],
    recommendedUse: "competition",

    story:
      "George Stanica's 2024 championship recipe represents the modern evolution of AeroPress brewing. As a software engineer with no professional coffee background, his precise, methodical approach and innovative water composition earned him the world title in Lisbon.",
    keyTechnique:
      "Specialized water composition and bypass technique for optimal flavor balance",
    tips: [
      "Use special water mix (Aquacode diluted to 85-90ppm)",
      "NSEW stirring pattern is crucial for even extraction",
      "Remove air gently without flipping too early",
      "Bypass with both hot and room temperature water",
      "Recipe designed for specific Ethiopian heirloom varieties",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction: "Place AeroPress inverted at 4th mark, rinse Aesir filter",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Add 18g coffee, pour 50g water (96°C)",
        waterAmount: 50,
      },
      {
        time: "0:30",
        timeSeconds: 30,
        instruction:
          "Give mixture light stir in North-South-East-West motion for 10 seconds",
      },
      {
        time: "1:20",
        timeSeconds: 80,
        instruction:
          "Place cap with filter, start gently removing air (10 seconds)",
      },
      {
        time: "1:35",
        timeSeconds: 95,
        instruction:
          "Gently swirl, flip and press for 30-40 seconds (76-79g output)",
      },
      {
        time: "Bypass",
        timeSeconds: 135,
        instruction:
          "Add warm water to 130-135g total, then add 20-30g room temperature water",
      },
    ],

    sourceUrlType: "championship",
    equipmentRecommendations: [
      "AeroPress with Flow Control Cap",
      "Aesir filters",
      "Comandante C40 Mk4 grinder",
      "Specialized water (85-90ppm)",
      "Digital scale",
      "Temperature-controlled kettle",
    ],

    tags: new Set([
      "aeropress",
      "championship",
      "george-stanica",
      "advanced",
      "2024",
      "inverted",
      "bypass",
      "competition",
    ]),
  },
};

// Utility functions for recipe filtering and display
export function getRecipesByMethod(method: BrewingMethodKey): ExpertRecipe[] {
  return Object.values(EXPERT_RECIPES).filter(
    (recipe) => recipe.method === method
  );
}

export function getRecipesByDifficulty(
  difficulty: ExpertRecipe["difficulty"]
): ExpertRecipe[] {
  return Object.values(EXPERT_RECIPES).filter(
    (recipe) => recipe.difficulty === difficulty
  );
}

export function getRecipesByExpert(expertName: string): ExpertRecipe[] {
  return Object.values(EXPERT_RECIPES).filter((recipe) =>
    recipe.expert.name.toLowerCase().includes(expertName.toLowerCase())
  );
}

export function getAllRecipes(): ExpertRecipe[] {
  return Object.values(EXPERT_RECIPES);
}

// Recipe search and filtering
export type RecipeFilters = {
  method?: BrewingMethodKey;
  difficulty?: ExpertRecipe["difficulty"];
  expert?: string;
  recommendedUse?: ExpertRecipe["recommendedUse"];
  tags?: string[];
  flavorNotes?: string[];
};

export function filterRecipes(filters: RecipeFilters): ExpertRecipe[] {
  let recipes = getAllRecipes();

  if (filters.method) {
    recipes = recipes.filter((recipe) => recipe.method === filters.method);
  }

  if (filters.difficulty) {
    recipes = recipes.filter(
      (recipe) => recipe.difficulty === filters.difficulty
    );
  }

  if (filters.expert) {
    recipes = recipes.filter((recipe) =>
      recipe.expert.name.toLowerCase().includes(filters.expert!.toLowerCase())
    );
  }

  if (filters.recommendedUse) {
    recipes = recipes.filter(
      (recipe) => recipe.recommendedUse === filters.recommendedUse
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    recipes = recipes.filter((recipe) =>
      filters.tags!.some((tag) => recipe.tags.has(tag))
    );
  }

  if (filters.flavorNotes && filters.flavorNotes.length > 0) {
    recipes = recipes.filter((recipe) =>
      filters.flavorNotes!.some((note) => recipe.flavorNotes.includes(note))
    );
  }

  return recipes;
}

// Sort recipes by difficulty index
export type DifficultyLevel = ExpertRecipe["difficulty"];
export type RecommendedUse = ExpertRecipe["recommendedUse"];
export type MethodKey = BrewingMethodKey;
export function sortRecipesByDifficulty(
  recipes: ExpertRecipe[]
): ExpertRecipe[] {
  return [...recipes].sort((a, b) => a.difficultyIndex - b.difficultyIndex);
}

// Get unique flavor notes across all recipes
export function getAllFlavorNotes(): string[] {
  const allNotes = new Set<string>();
  Object.values(EXPERT_RECIPES).forEach((recipe) => {
    recipe.flavorNotes.forEach((note) => allNotes.add(note));
  });
  return Array.from(allNotes).sort();
}

// Get recipes by recommended use
export function getRecipesByUse(
  use: ExpertRecipe["recommendedUse"]
): ExpertRecipe[] {
  return Object.values(EXPERT_RECIPES).filter(
    (recipe) => recipe.recommendedUse === use
  );
}

// Auto-generate tags from recipe properties (utility for data consistency)
export function generateAutoTags(
  recipe: Omit<ExpertRecipe, "tags">
): Set<string> {
  const autoTags = new Set<string>();

  // Add method
  autoTags.add(recipe.method);

  // Add difficulty (lowercase)
  autoTags.add(recipe.difficulty.toLowerCase());

  // Add expert name (slug format)
  autoTags.add(recipe.expert.name.toLowerCase().replace(/\s+/g, "-"));

  // Add recommended use
  autoTags.add(recipe.recommendedUse);

  // Add some flavor notes as tags
  recipe.flavorNotes.slice(0, 3).forEach((note) => autoTags.add(note));

  return autoTags;
}

// Export individual recipes for direct access
export const RECIPES_ARRAY = Object.values(EXPERT_RECIPES);

// Expert info for display
export const EXPERTS = [
  {
    name: "James Hoffmann",
    recipes: ["hoffman-v60", "hoffman-french-press", "hoffman-chemex"],
    bio: "World Barista Champion 2007, coffee educator, and YouTube creator",
  },
  {
    name: "Tetsu Kasuya",
    recipes: ["tetsu-kasuya-46"],
    bio: "World Brewers Cup Champion 2016, creator of the famous 4:6 method",
  },
  {
    name: "Scott Rao",
    recipes: ["scott-rao-v60"],
    bio: "Coffee consultant, author, and roasting expert focused on uniform extraction",
  },
  {
    name: "Carolina Ibarra Garay",
    recipes: ["carolina-aeropress"],
    bio: "World AeroPress Champion 2018, known for innovative temperature control",
  },
  {
    name: "George Stanica",
    recipes: ["george-aeropress-2024"],
    bio: "World AeroPress Champion 2024, software engineer and passionate home brewer",
  },
  {
    name: "Intelligentsia Coffee",
    recipes: ["intelligentsia-pourover"],
    bio: "Third-wave coffee pioneer and industry leader in specialty coffee",
  },
];

// Recipe categories for organization
export const RECIPE_CATEGORIES = {
  "Pour Over Masters": [
    "hoffman-v60",
    "scott-rao-v60",
    "tetsu-kasuya-46",
    "hoffman-chemex",
    "intelligentsia-pourover",
  ],
  "AeroPress Champions": ["carolina-aeropress", "george-aeropress-2024"],
  "Full Immersion": ["hoffman-french-press"],
} as const;

// Difficulty explanations
export const DIFFICULTY_GUIDE = {
  Beginner: "Simple technique, forgiving timing, minimal equipment needed",
  Intermediate: "Requires attention to detail, some technique practice needed",
  Advanced:
    "Precise timing and technique required, specialized equipment recommended",
} as const;

// Recommended use explanations
export const USE_GUIDE = {
  everyday: "Perfect for daily brewing - reliable, approachable, and delicious",
  competition: "Competition-level techniques requiring precision and practice",
  experiment: "For coffee exploration and trying new flavor profiles",
} as const;

// Source type explanations
export const SOURCE_TYPE_GUIDE = {
  video: "Watch the expert demonstrate the technique",
  blog: "Detailed written guide from the expert",
  championship: "Official competition-winning recipe",
  brand: "Method developed by coffee company",
} as const;
