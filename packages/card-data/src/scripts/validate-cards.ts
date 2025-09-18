import { loadAllFactionCards } from "../utils/dataConverters.js";
import { validateCard } from "../validation/index.js";

async function validateAllCards() {
  console.log("🔍 Validating all card data...\n");

  try {
    const allCards = await loadAllFactionCards();
    let totalCards = 0;
    let totalErrors = 0;

    for (const [faction, cards] of Object.entries(allCards)) {
      console.log(`📝 Validating ${faction} faction...`);
      let factionErrors = 0;

      for (const card of cards) {
        const validation = validateCard(card);
        if (!validation.isValid) {
          console.error(`❌ ${card.id}: ${validation.errors.join(", ")}`);
          factionErrors++;
          totalErrors++;
        }
        totalCards++;
      }

      if (factionErrors === 0) {
        console.log(`✅ ${faction}: ${cards.length} cards valid`);
      } else {
        console.log(`⚠️  ${faction}: ${factionErrors} errors found`);
      }
      console.log("");
    }

    console.log(`🎯 Summary: ${totalCards} total cards, ${totalErrors} errors`);

    if (totalErrors === 0) {
      console.log("🎉 All cards are valid!");
      process.exit(0);
    } else {
      console.log("💥 Validation failed. Please fix the errors above.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Failed to validate cards:", error);
    process.exit(1);
  }
}

validateAllCards();
