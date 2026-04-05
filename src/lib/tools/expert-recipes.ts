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
  | "george-aeropress-2024"
  | "onyx-kalita-wave"
  | "lance-hedrick-v60"
  | "tim-wendelboe-aeropress"
  | "traditional-south-indian"
  | "blue-bottle-french-press"
  | "classic-inverted-aeropress"
  | "japanese-iced-v60"
  | "standard-cold-brew"
  | "classic-moka-pot";

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

  "onyx-kalita-wave": {
    id: "onyx-kalita-wave",
    slug: "onyx-kalita-wave",
    title: "Onyx Kalita Wave Recipe",
    expert: {
      name: "Onyx Coffee Lab",
      title: "Specialty Coffee Roaster",
      achievement: "US Coffee Championships Winners",
    },
    method: "kalitawave",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 25,
    water: 400,
    ratio: "1:16",
    grind: "Medium-fine",
    temperature: "93°C",
    totalTime: "3:30",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "average",
    flavorProfile: "Balanced, bright, clear cup with smooth finish",
    flavorNotes: ["balanced", "bright", "clear", "smooth"],
    recommendedUse: "everyday",

    story:
      "Onyx Coffee Lab's Kalita Wave recipe focuses on an even extraction and a flat-bottom brewer advantages. This method highlights clarity and balance across light-roasted coffees.",
    keyTechnique:
      "Heavy spiral pulse pouring to ensure constant agitation and even extraction",
    tips: [
      "Use 600µm medium-fine grind",
      "Rinse filter well to ensure a clean taste",
      "Pour in consistent heavy spirals during pulses",
    ],

    steps: [
      {
        time: "0:00",
        timeSeconds: 0,
        instruction:
          "Bloom with 50g of water, making sure all grounds are saturated",
        waterAmount: 50,
        pourNumber: 1,
      },
      {
        time: "0:30",
        timeSeconds: 30,
        instruction: "Heavy spiral pour to 160g",
        waterAmount: 110,
        pourNumber: 2,
      },
      {
        time: "0:45",
        timeSeconds: 45,
        instruction: "Spiral pour to 220g",
        waterAmount: 60,
        pourNumber: 3,
      },
      {
        time: "1:05",
        timeSeconds: 65,
        instruction: "Spiral pour to 280g",
        waterAmount: 60,
        pourNumber: 4,
      },
      {
        time: "1:30",
        timeSeconds: 90,
        instruction: "Spiral pour to 340g",
        waterAmount: 60,
        pourNumber: 5,
      },
      {
        time: "2:00",
        timeSeconds: 120,
        instruction:
          "Final spiral pour to 400g, allow to drain until approx 3:30",
        waterAmount: 60,
        pourNumber: 6,
      },
    ],

    sourceUrlType: "blog",
    equipmentRecommendations: [
      "Kalita Wave",
      "Gooseneck kettle",
      "Digital scale",
      "Medium-fine grinder",
    ],

    tags: new Set([
      "kalita-wave",
      "onyx",
      "intermediate",
      "balanced",
      "everyday",
    ]),
  },

  "lance-hedrick-v60": {
    id: "lance-hedrick-v60",
    slug: "lance-hedrick-v60",
    title: "Lance Hedrick V60 Technique",
    expert: {
      name: "Lance Hedrick",
      title: "Coffee Expert & Educator",
      achievement: "World Latte Art Champion Finalist",
    },
    method: "v60",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 15,
    water: 250,
    ratio: "1:16.7",
    grind: "Medium-fine",
    temperature: "95°C",
    totalTime: "3:00",

    roastRecommendation: ["light"],
    strengthLevel: "average",
    flavorProfile: "High clarity, sweet, balanced extraction",
    flavorNotes: ["sweet", "clear", "balanced", "vibrant"],
    recommendedUse: "experiment",

    story:
      "Lance Hedrick advocates for an extended bloom time to properly off-gas light/gassy coffees, followed by a single slow pour to maintain bed stability. His technique often incorporates excavation using a spoon.",
    keyTechnique:
      "Extended bloom (up to 2 mins) and wet WDT spoon excavation for max saturation",
    tips: [
      "Use a spoon to scoop/excavate grounds during the bloom",
      "Let bloom rest up to 2 minutes for very fresh/light roasts",
      "Keep remaining pour steady at ~6-8g per second",
    ],

    steps: [
      {
        time: "Before",
        timeSeconds: 0,
        instruction:
          "Make a small divot in the coffee bed center after adding grounds",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 45g of water for bloom (3x coffee weight).",
        waterAmount: 45,
        pourNumber: 1,
      },
      {
        time: "0:10",
        timeSeconds: 10,
        instruction:
          "Excavate/stir the slurry heavily with a spoon to ensure full saturation.",
      },
      {
        time: "1:00",
        timeSeconds: 60,
        instruction:
          "Begin single steady pour at 6-8g/s in the center until 250g total is reached.",
        waterAmount: 205,
        pourNumber: 2,
      },
      {
        time: "3:00",
        timeSeconds: 180,
        instruction: "Draw-down should finish around 2:30-3:00.",
      },
    ],

    sourceUrlType: "video",
    equipmentRecommendations: [
      "Hario V60",
      "Gooseneck kettle",
      "Spoon for excavation",
    ],

    tags: new Set([
      "v60",
      "lance-hedrick",
      "intermediate",
      "long-bloom",
      "experiment",
    ]),
  },

  "tim-wendelboe-aeropress": {
    id: "tim-wendelboe-aeropress",
    slug: "tim-wendelboe-aeropress",
    title: "Tim Wendelboe AeroPress",
    expert: {
      name: "Tim Wendelboe",
      title: "Roaster & Cafe Owner",
      achievement: "World Barista Champion 2004",
    },
    method: "aeropress",
    difficulty: "Beginner",
    difficultyIndex: 1,

    coffee: 14,
    water: 200,
    ratio: "1:14.3",
    grind: "Fine",
    temperature: "96°C",
    totalTime: "1:30",

    roastRecommendation: ["light"],
    strengthLevel: "average",
    flavorProfile: "Clean, delicate, highlighting light roast complexity",
    flavorNotes: ["clean", "delicate", "bright", "sweet"],
    recommendedUse: "everyday",

    story:
      "Tim Wendelboe, founder of the World AeroPress Championships, uses incredibly simple and clean methods at his Oslo cafe to highlight the subtle traits of light roasted coffee without over-complicating the brew.",
    keyTechnique:
      "Simple standard orientation with precise, minimal stirring (exactly 3 stirs)",
    tips: [
      "Stir exactly 3 times back-to-front after pouring, no more",
      "Place plunger on top slightly to create vacuum and stop drip-through",
      "Press gently just using body weight",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Rinse filter with running tap water for 10 seconds. Use standard (non-inverted) method",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 200g water quickly over 14g coffee",
        waterAmount: 200,
      },
      {
        time: "0:20",
        timeSeconds: 20,
        instruction:
          "Stir exactly 3 times, back to front. Place plunger on top to stop dripping",
      },
      {
        time: "1:00",
        timeSeconds: 60,
        instruction:
          "Remove plunger, stir exactly 3 times again, then replace plunger",
      },
      {
        time: "1:05",
        timeSeconds: 65,
        instruction: "Press down gently with body weight until 1:30",
      },
    ],

    sourceUrlType: "blog",
    equipmentRecommendations: [
      "AeroPress",
      "AeroPress paper filter",
      "Comandante Grinder",
    ],

    tags: new Set([
      "aeropress",
      "tim-wendelboe",
      "beginner",
      "clean",
      "everyday",
    ]),
  },

  "traditional-south-indian": {
    id: "traditional-south-indian",
    slug: "traditional-south-indian",
    title: "Traditional South Indian Filter",
    expert: {
      name: "Traditional Origin",
      title: "Cultural Heritage Method",
      achievement: "Authentic Indian Household Preparation",
    },
    method: "southindianfilter",
    difficulty: "Beginner",
    difficultyIndex: 1,

    coffee: 30,
    water: 120,
    ratio: "1:4 decoction",
    grind: "Medium-fine",
    temperature: "100°C",
    totalTime: "30:00",

    roastRecommendation: ["dark", "medium"],
    strengthLevel: "robust",
    flavorProfile: "Strong, heavy, chicory-sweetened classic profile",
    flavorNotes: ["strong", "thick", "chicory", "aromatic"],
    recommendedUse: "everyday",

    story:
      "A staple in South India, this method produces a thick 'decoction' using a stainless-steel drip brewer. Traditionally mixed with frothy boiling milk and sugar, the coffee usually contains 20-30% chicory, adding a distinct sweet and woody flavor.",
    keyTechnique:
      "Slow dripping decoction, traditionally frothed using a 'dabarah' and tumbler",
    tips: [
      "Use an 80/20 or 70/30 coffee to chicory blend for authenticity",
      "Do not overly compress the coffee grounds; just tamp lightly",
      "Aerating by pouring from height between vessels creates signature froth",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Place coffee in upper chamber of the filter. Gently press with the plunger/umbrella",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 120ml boiling water over the umbrella plate",
        waterAmount: 120,
      },
      {
        time: "15:00-30:00",
        timeSeconds: 900,
        instruction:
          "Allow the decoction to drip undisturbed into the lower chamber",
      },
      {
        time: "Serve",
        timeSeconds: 1800,
        instruction:
          "Mix 1 part decoction with 3 parts hot milk and sugar. Pour high between cups to froth",
      },
    ],

    sourceUrlType: "blog",
    equipmentRecommendations: [
      "South Indian Filter (brass/steel)",
      "Dabarah and Tumbler",
    ],

    tags: new Set([
      "south-indian-filter",
      "traditional",
      "beginner",
      "chicory",
      "milk-based",
      "everyday",
    ]),
  },

  "blue-bottle-french-press": {
    id: "blue-bottle-french-press",
    slug: "blue-bottle-french-press",
    title: "Blue Bottle Traditional French Press",
    expert: {
      name: "Blue Bottle Coffee",
      title: "Specialty Coffee Roaster",
      achievement: "Pioneer of Modern Coffee Experiences",
    },
    method: "frenchpress",
    difficulty: "Beginner",
    difficultyIndex: 1,

    coffee: 30,
    water: 350,
    ratio: "1:11.7",
    grind: "Coarse",
    temperature: "96°C",
    totalTime: "4:00",

    roastRecommendation: ["medium", "dark"],
    strengthLevel: "robust",
    flavorProfile: "Rich, dense, and full-bodied",
    flavorNotes: ["rich", "full-bodied", "dense", "comforting"],
    recommendedUse: "everyday",

    story:
      "Blue Bottle's traditional French Press recipe provides a comforting, highly extracted full-bodied cup typical of immersion. Using a coarser grind and strong ratio, this simple approach results in exceptional mouthfeel.",
    keyTechnique:
      "Straightforward saturation and traditional plunging for max heavy body",
    tips: [
      "Grind coarse like sea salt to avoid over-extraction and sludge",
      "Ensure all grounds are wetted evenly",
      "Pour or serve immediately after plunging to stop extraction",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Warm the press with hot water, discard, and add 30g ground coffee",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction:
          "Pour just enough water to saturate grounds and wait 30 seconds for bloom",
        waterAmount: 60,
      },
      {
        time: "0:30",
        timeSeconds: 30,
        instruction: "Add the remaining water aggressively to mix grounds",
        waterAmount: 290,
      },
      {
        time: "0:45",
        timeSeconds: 45,
        instruction: "Place lid on top (plunger up) to retain heat",
      },
      {
        time: "4:00",
        timeSeconds: 240,
        instruction:
          "Press the plunger slowly (taking ~20s) to the bottom. Serve immediately",
      },
    ],

    sourceUrlType: "brand",
    equipmentRecommendations: [
      "French Press",
      "Coarse Grinder",
      "Digital Scale",
    ],

    tags: new Set([
      "french-press",
      "blue-bottle",
      "beginner",
      "full-body",
      "everyday",
    ]),
  },

  "classic-inverted-aeropress": {
    id: "classic-inverted-aeropress",
    slug: "classic-inverted-aeropress",
    title: "Classic Inverted AeroPress",
    expert: {
      name: "Popular Method",
      title: "Community Favorite",
      achievement: "Widely used globally",
    },
    method: "aeropress",
    difficulty: "Beginner",
    difficultyIndex: 1,

    coffee: 15,
    water: 250,
    ratio: "1:16.7",
    grind: "Medium-fine",
    temperature: "90°C",
    totalTime: "2:30",

    roastRecommendation: ["light", "medium", "dark"],
    strengthLevel: "average",
    flavorProfile: "Full-bodied, smooth, well-rounded",
    flavorNotes: ["smooth", "full-bodied", "consistent", "versatile"],
    recommendedUse: "everyday",

    story:
      "The inverted method was created by the coffee community to solve the 'drip-through' issue of the standard AeroPress method. By brewing upside down, it acts as a true full-immersion brewer before being flipped and pressed.",
    keyTechnique:
      "Inverted assembly allows for complete immersion and longer steep times without premature leaking",
    tips: [
      "Be extremely careful when flipping to avoid spills",
      "Stir thoroughly to ensure all grounds are saturated",
      "Push excess air out before flipping for better stability",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Push plunger just inside the chamber and stand it inverted. Add 15g coffee",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 50g water to bloom and stir gently",
        waterAmount: 50,
        pourNumber: 1,
      },
      {
        time: "0:30",
        timeSeconds: 30,
        instruction:
          "Fill the rest of the chamber to 250g water and stir again",
        waterAmount: 200,
        pourNumber: 2,
      },
      {
        time: "1:30",
        timeSeconds: 90,
        instruction: "Attach the rinsed filter and cap",
      },
      {
        time: "2:00",
        timeSeconds: 120,
        instruction:
          "Carefully flip the AeroPress onto your mug and press down slowly for 30s",
      },
    ],

    sourceUrlType: "blog",
    equipmentRecommendations: [
      "AeroPress",
      "AeroPress paper filter",
      "Sturdy mug",
    ],

    tags: new Set([
      "aeropress",
      "inverted",
      "popular",
      "beginner",
      "immersion",
      "everyday",
    ]),
  },

  "japanese-iced-v60": {
    id: "japanese-iced-v60",
    slug: "japanese-iced-v60",
    title: "Japanese Iced Coffee (Flash Brew)",
    expert: {
      name: "Popular Method",
      title: "Community Favorite",
      achievement: "Best for immediate cold coffee",
    },
    method: "v60",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 20,
    water: 300,
    ratio: "1:15",
    grind: "Fine",
    temperature: "95°C",
    totalTime: "2:30",

    roastRecommendation: ["light", "medium"],
    strengthLevel: "average",
    flavorProfile: "Crisp, bright, aromatic, and refreshing",
    flavorNotes: ["crisp", "bright", "refreshing", "aromatic"],
    recommendedUse: "everyday",

    story:
      "Also known as Flash Brew, this method replaces half of the brewing water with ice in the carafe. Brewing hot coffee directly over ice instantly chills it, locking in volatile aromatics that are often lost in cold brew.",
    keyTechnique:
      "Brewing directly onto ice with a finer grind to compensate for less hot water extraction",
    tips: [
      "Grind finer than usual, since you are extracting with half the hot water",
      "Ensure your total hot water (150g) + ice weight (150g) equals your target ratio",
      "Swirl the carafe immediately after brewing to melt any remaining ice",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Place 150g of ice directly into your carafe. Rinse V60 filter separately before placing it on top",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction: "Pour 60g hot water to bloom the 20g of coffee",
        waterAmount: 60,
        pourNumber: 1,
      },
      {
        time: "0:45",
        timeSeconds: 45,
        instruction:
          "Pour remaining 90g of hot water in steady concentric circles",
        waterAmount: 90,
        pourNumber: 2,
      },
      {
        time: "2:00",
        timeSeconds: 120,
        instruction: "Wait for the draw-down to finish over the ice",
      },
      {
        time: "2:30",
        timeSeconds: 150,
        instruction:
          "Remove V60, swirl the carafe vigorously to flash chill, and serve",
      },
    ],

    sourceUrlType: "blog",
    equipmentRecommendations: [
      "Hario V60",
      "Ice cubes",
      "Carafe",
      "Digital Scale",
    ],

    tags: new Set([
      "v60",
      "iced",
      "flash-brew",
      "popular",
      "summer",
      "everyday",
    ]),
  },

  "standard-cold-brew": {
    id: "standard-cold-brew",
    slug: "standard-cold-brew",
    title: "Classic Cold Brew Concentrate",
    expert: {
      name: "Popular Method",
      title: "Community Favorite",
      achievement: "Standard cafe preparation",
    },
    method: "coldbrew",
    difficulty: "Beginner",
    difficultyIndex: 1,

    coffee: 100,
    water: 800,
    ratio: "1:8",
    grind: "Extra-coarse",
    temperature: "Room Temp",
    totalTime: "18-24 Hours",

    roastRecommendation: ["medium", "dark"],
    strengthLevel: "robust",
    flavorProfile: "Smooth, sweet, very low acidity, chocolatey",
    flavorNotes: ["smooth", "sweet", "low-acid", "chocolatey"],
    recommendedUse: "everyday",

    story:
      "Cold brew has exploded in popularity due to its incredibly smooth and forgiving nature. By replacing heat with time, the extraction yields a less acidic and naturally sweeter concentrate.",
    keyTechnique:
      "Long ambient-temperature steeping followed by fine filtration",
    tips: [
      "Use an extra-coarse grind to make filtration easier",
      "Dilute the resulting concentrate 1:1 with water or milk",
      "It tastes better steeped at room temperature than in the fridge",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Add 100g extra-coarse coffee to a large jar or cold brew maker",
      },
      {
        time: "0:00",
        timeSeconds: 0,
        instruction:
          "Pour 800g of room temperature/cold filtered water over the grounds",
        waterAmount: 800,
      },
      {
        time: "0:05",
        timeSeconds: 5,
        instruction: "Stir thoroughly to ensure all dry pockets are wetted",
      },
      {
        time: "18 Hours",
        timeSeconds: 64800,
        instruction: "Cover and let steep at room temperature for 18-24 hours",
      },
      {
        time: "Filter",
        timeSeconds: 86400,
        instruction: "Filter the mixture through a paper filter or fine sieve",
      },
    ],

    sourceUrlType: "blog",
    equipmentRecommendations: [
      "Large Jar or Cold Brew Maker",
      "Paper/Cloth filter",
      "Extra-coarse grinder",
    ],

    tags: new Set([
      "cold-brew",
      "popular",
      "beginner",
      "smooth",
      "summer",
      "everyday",
    ]),
  },

  "classic-moka-pot": {
    id: "classic-moka-pot",
    slug: "classic-moka-pot",
    title: "Traditional Moka Pot",
    expert: {
      name: "Popular Method",
      title: "Community Favorite",
      achievement: "Italian Household Staple",
    },
    method: "mokapot",
    difficulty: "Intermediate",
    difficultyIndex: 2,

    coffee: 15,
    water: 150,
    ratio: "Fill to valve",
    grind: "Fine (Espresso-ish)",
    temperature: "Medium-Low Heat",
    totalTime: "5:00",

    roastRecommendation: ["medium", "dark"],
    strengthLevel: "robust",
    flavorProfile: "Intense, rich, syrupy, pseudo-espresso",
    flavorNotes: ["intense", "rich", "syrupy", "bold"],
    recommendedUse: "everyday",

    story:
      "Invented by Alfonso Bialetti in 1933, the Moka Pot quickly became a staple in Italian homes. It produces a strong, dense coffee similar to espresso by passing boiling water pressurized by steam through the grounds.",
    keyTechnique:
      "Using pre-heated water in the boiler to prevent baking the coffee",
    tips: [
      "Start with hot/boiling water in the base to reduce time on the stove",
      "Do not tamp the coffee, just level visually",
      "Remove from heat immediately when you hear the gurgling sound",
    ],

    steps: [
      {
        time: "Setup",
        timeSeconds: 0,
        instruction:
          "Boil water separately. Fill the Moka pot bottom chamber up to the safety valve",
      },
      {
        time: "Basket",
        timeSeconds: 0,
        instruction:
          "Fill the filter basket with coffee and level it off without tamping. Place it into the base",
      },
      {
        time: "Assembly",
        timeSeconds: 0,
        instruction:
          "Carefully screw the top half on (base will be hot, use a towel)",
      },
      {
        time: "Heat",
        timeSeconds: 0,
        instruction:
          "Place on stove over medium-low heat. Leave the lid open to watch",
      },
      {
        time: "Finish",
        timeSeconds: 300,
        instruction:
          "Once liquid reaches the spout and starts to sputter/gurgle, remove from heat and close the lid",
      },
      {
        time: "Cool",
        timeSeconds: 310,
        instruction:
          "Run the base under cold water to instantly stop the brewing",
      },
    ],

    sourceUrlType: "blog",
    equipmentRecommendations: ["Bialetti Moka Pot", "Towel", "Stove"],

    tags: new Set([
      "moka-pot",
      "traditional",
      "popular",
      "intense",
      "italian",
      "everyday",
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
  roast?: RoastLevel;
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

  if (filters.roast) {
    recipes = recipes.filter((recipe) =>
      recipe.roastRecommendation.includes(filters.roast!)
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
  {
    name: "Tim Wendelboe",
    recipes: ["tim-wendelboe-aeropress"],
    bio: "World Barista Champion 2004, renowned roaster from Oslo, Norway",
  },
  {
    name: "Lance Hedrick",
    recipes: ["lance-hedrick-v60"],
    bio: "Coffee Expert & Educator, World Latte Art Champion Finalist",
  },
  {
    name: "Onyx Coffee Lab",
    recipes: ["onyx-kalita-wave"],
    bio: "Acclaimed US specialty coffee roaster and competition champions",
  },
  {
    name: "Blue Bottle Coffee",
    recipes: ["blue-bottle-french-press"],
    bio: "Pioneers of modern specialty coffee experience and cafe culture",
  },
  {
    name: "Traditional Origin",
    recipes: ["traditional-south-indian"],
    bio: "Cultural heritage methods passed down through generations",
  },
  {
    name: "Popular Method",
    recipes: [
      "classic-inverted-aeropress",
      "japanese-iced-v60",
      "standard-cold-brew",
      "classic-moka-pot",
    ],
    bio: "Tried and true brewing techniques favored by the global coffee community.",
  },
];

// Recipe categories for organization
export const RECIPE_CATEGORIES = {
  "Pour Over Masters": [
    "hoffman-v60",
    "scott-rao-v60",
    "tetsu-kasuya-46",
    "lance-hedrick-v60",
    "hoffman-chemex",
    "intelligentsia-pourover",
  ],
  "Flat Bottom Brewers": ["onyx-kalita-wave"],
  "AeroPress Champions": [
    "carolina-aeropress",
    "george-aeropress-2024",
    "tim-wendelboe-aeropress",
  ],
  "Full Immersion": ["hoffman-french-press", "blue-bottle-french-press"],
  "Cold & Iced Coffee": ["japanese-iced-v60", "standard-cold-brew"],
  "Traditional Methods": ["traditional-south-indian", "classic-moka-pot"],
  "Community Favorites": ["classic-inverted-aeropress"],
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
