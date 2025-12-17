// src/lib/glossary/parser.ts

export type GlossaryTerm = {
  term: string;
  definition: string;
  category?: string;
  aliases?: string[];
};

type ParseState = {
  category: string;
  term: string;
  definition: string;
  inDefinition: boolean;
};

function createTerm(
  term: string,
  definition: string,
  category: string
): GlossaryTerm {
  return {
    term,
    definition: definition.trim(),
    category,
    aliases: generateAliases(term),
  };
}

function saveCurrentTerm(terms: GlossaryTerm[], state: ParseState): void {
  if (state.term && state.definition.trim()) {
    terms.push(createTerm(state.term, state.definition, state.category));
  }
}

function handleCategoryHeader(
  line: string,
  terms: GlossaryTerm[],
  state: ParseState
): ParseState {
  saveCurrentTerm(terms, state);
  return {
    category: line.replace("## ", "").trim(),
    term: "",
    definition: "",
    inDefinition: false,
  };
}

function handleTermHeader(
  line: string,
  terms: GlossaryTerm[],
  state: ParseState
): ParseState {
  saveCurrentTerm(terms, state);
  return {
    ...state,
    term: line.replace("### **", "").replace("**", "").trim(),
    definition: "",
    inDefinition: true,
  };
}

function handleDefinitionLine(line: string, state: ParseState): ParseState {
  if (line === "" && state.definition === "") {
    return state;
  }

  if (line.startsWith("#")) {
    return { ...state, inDefinition: false };
  }

  if (line !== "") {
    const updatedDefinition =
      state.definition !== "" ? `${state.definition} ${line}` : line;
    return { ...state, definition: updatedDefinition };
  }

  return state;
}

export function parseGlossaryMarkdown(content: string): GlossaryTerm[] {
  const terms: GlossaryTerm[] = [];
  // Normalize line endings to handle Windows \r\n
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  let state: ParseState = {
    category: "",
    term: "",
    definition: "",
    inDefinition: false,
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Category headers (## A, ## B, etc.)
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      state = handleCategoryHeader(line, terms, state);
      continue;
    }

    // Term headers (### **Term**)
    if (line.startsWith("### **") && line.endsWith("**")) {
      state = handleTermHeader(line, terms, state);
      continue;
    }

    // Definition content
    if (state.inDefinition) {
      state = handleDefinitionLine(line, state);
    }
  }

  // Don't forget the last term!
  saveCurrentTerm(terms, state);

  return terms;
}

function generateAliases(term: string): string[] {
  const aliases: string[] = [];

  // Add lowercase version
  aliases.push(term.toLowerCase());

  // Handle plurals (simple heuristic)
  if (!term.endsWith("s")) {
    aliases.push(`${term}s`, `${term.toLowerCase()}s`);
  }

  // Handle common coffee variations
  const variations: Record<string, string[]> = {
    Arabica: ["arabica bean", "arabica beans", "arabica coffee"],
    Robusta: ["robusta bean", "robusta beans", "robusta coffee"],
    Espresso: ["espresso shot", "espresso coffee"],
    "Cold Brew": ["cold-brew", "cold brewed", "cold brewing"],
    Pourover: ["pourover", "pour over"],
  };

  if (variations[term]) {
    aliases.push(...variations[term]);
  }

  return [...new Set(aliases)];
}
