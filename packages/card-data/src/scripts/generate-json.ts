import {
  northernRealmsCards,
  monstersCards,
  scoiaTaelCards,
} from "../cards/index.js";
import {
  saveCardsToJSON,
  convertTSCardsToJSON,
} from "../utils/dataConverters.js";
import * as path from "path";

async function generateJSONFromTS() {
  console.log("🔄 Generating JSON files from TypeScript card data...\n");

  const dataDir = path.join(process.cwd(), "src", "data");

  const factions = [
    { name: "northern-realms", cards: northernRealmsCards },
    { name: "monsters", cards: monstersCards },
    { name: "scoia-tael", cards: scoiaTaelCards },
  ];

  for (const faction of factions) {
    try {
      const validatedCards = convertTSCardsToJSON(faction.cards);
      const filePath = path.join(dataDir, `${faction.name}.json`);
      await saveCardsToJSON(validatedCards, filePath);
    } catch (error) {
      console.error(`Failed to generate JSON for ${faction.name}:`, error);
    }
  }

  console.log("✅ JSON generation complete!");
}

generateJSONFromTS();
