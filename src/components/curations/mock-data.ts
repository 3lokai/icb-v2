import { CuratorPageData } from "./types";

export const mockCurators: Record<string, CuratorPageData> = {
  "coffee-lab-hyderabad": {
    curator: {
      id: "1",
      slug: "coffee-lab-hyderabad",
      name: "Coffee Lab Hyderabad",
      logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=200&h=200&auto=format&fit=crop",
      location: "Hyderabad, India",
      tags: ["Cafe", "Roastery", "Curator"],
      curatorType: "Cafe",
      philosophy:
        "Scientific precision meets artistic expression in every cup.",
      story:
        "Coffee Lab Hyderabad is more than just a café; it's a sanctuary for coffee enthusiasts. Our philosophy is rooted in scientific precision and artistic expression. Every bean is selected through rigorous blind cuppings, ensuring only the most exceptional profiles reach our bar. We believe that coffee is a bridge between the producer's hard work and the consumer's moment of joy.",
      quote:
        "Quality is never an accident; it is always the result of intelligent effort.",
      recentPicks: ["Attikan Estate", "Riverdale Ruby", "Savor Da' Fruit"],
      links: [
        { platform: "instagram", url: "https://instagram.com/coffeelabbyd" },
        { platform: "website", url: "https://coffeelabbyd.com" },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200",
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200",
        "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=1200",
        "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=1200",
      ],
    },
    curations: [
      {
        id: "house-picks",
        slug: "house-picks",
        title: "House Picks",
        description:
          "Our signature selection — coffees we brew daily, serve proudly, and recommend without hesitation.",
        isDefault: true,
        selections: [
          {
            id: "c1",
            name: "Savor Da' Fruit",
            roaster: "Naivo Roasters",
            note: "A vibrant, fruity profile that perfectly captures the essence of summer.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
          {
            id: "c2",
            name: "Attikan Estate",
            roaster: "Blue Tokai",
            note: "Classic, reliable, and smooth. A staple in our morning rotation.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
          {
            id: "c3",
            name: "Riverdale Estate Ruby",
            roaster: "Subko Coffee",
            note: "Complex acidity and deep sweetness. Truly a specialty gem.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
          {
            id: "c4",
            name: "Kerehaklu Estate",
            roaster: "Curious Life",
            note: "Nutty notes with a caramel finish.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
        ],
      },
      {
        id: "light-roast-beauties",
        slug: "light-roast-beauties",
        title: "Light Roast Beauties",
        description:
          "For those who chase brightness and complexity. Floral, fruity, and unapologetically light.",
        selections: [
          {
            id: "l1",
            name: "Sethuraman Estate Natural",
            roaster: "Bloom Coffee",
            note: "Explosive berry notes with a wine-like finish. Best as a pour-over.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
          {
            id: "l2",
            name: "Badra Estates Anaerobic",
            roaster: "Corridor Seven",
            note: "Tropical fruit bomb with jasmine undertones. Truly experimental.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
          {
            id: "l3",
            name: "Karadykan Washed",
            roaster: "Third Wave",
            note: "Clean citrus acidity with a tea-like body. Perfect morning cup.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
        ],
      },
      {
        id: "dark-comfort-cups",
        slug: "dark-comfort-cups",
        title: "Dark & Comfort Cups",
        description:
          "When you want warmth and familiarity. Rich, chocolatey, and deeply satisfying.",
        selections: [
          {
            id: "d1",
            name: "Monsoon Malabar AA",
            roaster: "Devans",
            note: "The classic monsoon profile — earthy, low acidity, and full-bodied.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
          {
            id: "d2",
            name: "Chikmagalur Dark",
            roaster: "KC Roasters",
            note: "Dark chocolate and roasted nuts. An espresso workhorse.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
          {
            id: "d3",
            name: "Coorg Robusta Blend",
            roaster: "Seven Beans",
            note: "Bold and punchy. Perfect with milk for a strong latte.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
        ],
      },
    ],
  },
  "rohit-sharma": {
    curator: {
      id: "2",
      slug: "rohit-sharma",
      name: "Rohit Sharma",
      logo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop",
      location: "Bangalore, India",
      tags: ["Barista", "Brewer"],
      curatorType: "Barista",
      philosophy: "Chasing clarity and sweetness in every pour-over.",
      recentPicks: ["Kalladevarapura Estate", "Gowri Estate", "MS Estate"],
      story:
        "A dedicated barista and competitive brewer focusing on artisanal extraction techniques.",
      links: [
        { platform: "instagram", url: "https://instagram.com/rohitbrews" },
      ],
      gallery: [],
    },
    curations: [
      {
        id: "daily-drivers",
        slug: "daily-drivers",
        title: "Daily Drivers",
        description: "Reliable coffees that shine with a simple V60 recipe.",
        isDefault: true,
        selections: [
          {
            id: "r1",
            name: "Kalladevarapura Estate",
            roaster: "Blue Tokai",
            note: "Clean, floral and consistently delicious.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
        ],
      },
    ],
  },
  "r-indiacoffee": {
    curator: {
      id: "3",
      slug: "r-indiacoffee",
      name: "r/IndiaCoffee",
      logo: "https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png",
      location: "The Internet",
      tags: ["Community", "Reddit"],
      curatorType: "Community",
      philosophy: "The voice of India's home brewing community.",
      recentPicks: ["Dhuna Organic", "Ratnagiri Estate", "Hoysala Estate"],
      story:
        "Compiled from recurring discussions and shared experiences on the r/IndiaCoffee subreddit.",
      links: [{ platform: "website", url: "https://reddit.com/r/indiacoffee" }],
      gallery: [],
    },
    curations: [
      {
        id: "monthly-picks-feb-26",
        slug: "monthly-picks-feb-26",
        title: "Monthly Picks - Feb '26",
        description:
          "The community's most-reviewed and highest-rated coffees this month.",
        isDefault: true,
        selections: [
          {
            id: "red1",
            name: "Dhuna Organic",
            roaster: "Black Baza Coffee",
            note: "A community favorite for its sustainable practices and bold profile.",
            image:
              "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800",
          },
        ],
      },
    ],
  },
};
