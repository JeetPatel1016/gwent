// packages/game-engine/src/index.ts

// Main Game Manager - Primary API
export { GameManager, gameManager } from './game/GameManager.js';
export type { ActionResult } from './actions/ActionProcessor.js';

// Game State Management
export {
  createInitialGameState,
  getCurrentPlayer,
  getOpponentPlayer,
  isRoundComplete,
  isMatchComplete,
  getCurrentRoundNumber,
  getRoundWinCounts,
  validateGameState,
  cloneGameState
} from './game/GameState.js';

// Player Management
export { createPlayer, validateDeck } from './game/PlayerManager.js';

// Action Processing
export {
  playCard,
  passRound,
  advanceTurn,
  canPlayerAct,
  findPlayerById,
  validateCardPlay,
  applyCardAbilities
} from './actions/ActionProcessor.js';

// Round Management
export {
  checkAndEndRound,
  endCurrentRound,
  startNewRound,
  createNewRound,
  clearBoardsToGraveyard,
  drawCardsForRound,
  processRoundTransition,
  getNextRoundNumber,
  resetPlayersForNewRound
} from './game/RoundManager.js';

// Score Calculation
export {
  determineRoundWinner,
  isMatchOver,
  updatePlayerLives,
  calculateCurrentScores,
  shouldEndRound
} from './utils/ScoreCalculator.js';

// Game Utilities
export {
  calculateCardPower,
  calculateRowPower,
  isCardAffectedByWeather,
  findCardById,
  removeCardById,
  addCardToRow,
  removeCardFromRow,
  shuffleDeck,
  drawCards,
  canPlayCardInRow,
  getWeatherEffectsForRow,
  calculatePlayerScore,
  hasPlayableCards,
  modifyCardPower,
  filterCardsByType,
  filterCardsByRow,
  hasActiveWeather,
  clearAllWeather
} from './utils/GameUtils.js';

// Constants
export * from './constants/GameConstants.js';

// Re-export types from shared-types for convenience
export type {
  GameState,
  Player,
  Card,
  Round,
  BoardRow,
  WeatherType,
  RowType,
  Faction,
  CardType,
  RoundOutcome
} from '@gwent/shared-types';