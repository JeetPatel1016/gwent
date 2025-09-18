// packages/card-data/src/cards/northern-realms.ts

import { Card } from "@gwent/shared-types";

const FACTION = "northern-realms" as const;

export const northernRealmsCards: Card[] = [
  // Melee Units
  {
    // ABILITY: BOOST
    id: "gwint_card_poor_infantry1",
    name: "Poor Fucking Infantry",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description: "I's a war veteran! … spare me a crown?",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_poor_infantry2",
    name: "Poor Fucking Infantry",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description: "I's a war veteran! … spare me a crown?",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_poor_infantry3",
    name: "Poor Fucking Infantry",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description: "I's a war veteran! … spare me a crown?",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_blue_stripes1",
    name: "Blue Stripes Commando",
    power: 4,
    basePower: 4,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description: "I'd do anything for Temeria. Mostly, though, I kill for her.",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_blue_stripes2",
    name: "Blue Stripes Commando",
    power: 4,
    basePower: 4,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description: "I'd do anything for Temeria. Mostly, though, I kill for her.",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_blue_stripes3",
    name: "Blue Stripes Commando",
    power: 4,
    basePower: 4,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description: "I'd do anything for Temeria. Mostly, though, I kill for her.",
  },
  {
    id: "gwint_card_redania1",
    name: "Redanian Foot Soldier",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description:
      "I've bled for Redania! I've killed for Redania... Dammit, I've even raped for Redania!",
  },
  {
    id: "gwint_card_redania2",
    name: "Redanian Foot Soldier",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description:
      "I've bled for Redania! I've killed for Redania... Dammit, I've even raped for Redania!",
  },
  {
    // ABILITY: SPY
    id: "gwint_card_dijkstra",
    name: "Sigismund Dijkstra",
    power: 4,
    basePower: 4,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description: "Gwent's like politics, just more honest.",
  },
  {
    // ABILITY: SPY
    id: "gwint_card_stennis",
    name: "Prince Stennis",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description:
      "He ploughin' wears golden armor. Golden. 'Course he's an arsehole.",
  },
  {
    id: "gwint_card_siegfried",
    name: "Siegrfied of Denesle",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description:
      "We're on the same side, witcher. You'll realize this one day.",
  },
  {
    id: "gwint_card_ves",
    name: "Ves",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description:
      "Better to live one day as a king than a whole life as a beggar.",
  },
  {
    id: "gwint_card_yarpen",
    name: "Yarpen Zigrin",
    power: 2,
    basePower: 2,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: false,
    description:
      "The world belongs to whoever's best at crackin' skulls and impregnatin' lasses.",
  },

  // Ranged Units
  {
    // Ability: BOOST
    id: "gwint_card_crinfrid1",
    name: "Crinfrid Reavers Dragon Hunter",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description: "Haven't had much luck with monsters of late, so we enlisted.",
  },
  {
    // Ability: BOOST
    id: "gwint_card_crinfrid2",
    name: "Crinfrid Reavers Dragon Hunter",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description: "Haven't had much luck with monsters of late, so we enlisted.",
  },
  {
    // Ability: BOOST
    id: "gwint_card_crinfrid3",
    name: "Crinfrid Reavers Dragon Hunter",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description: "Haven't had much luck with monsters of late, so we enlisted.",
  },
  {
    id: "gwint_card_dethmold",
    name: "Dethmold",
    power: 6,
    basePower: 6,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description:
      "I once made a prisoner vomit his own entrails... Ah, good times...",
  },
  {
    id: "gwint_card_keira",
    name: "Keira Metz",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description:
      "If I'm to die today, I wish to look smashing for the occasion.",
  },
  {
    id: "gwint_card_sabrina",
    name: "Sabrina Glevissig",
    power: 4,
    basePower: 4,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description: "The Daughter of the Kaedweni Wilderness.",
  },
  {
    id: "gwint_card_sheldon",
    name: "Sheldon Skaggs",
    power: 4,
    basePower: 4,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description:
      "I was there, on the front lines! Right where the fightin' was the thickest!",
  },
  {
    id: "gwint_card_síle",
    name: "Síle de Tansarville",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: false,
    description:
      "The Lodge lacks humility. Our lust for power may yet be our undoing.",
  },
  // Siege units
  {
    id: "gwint_card_dun_banner_medic",
    name: "Dun Banner Medic",
    power: 5,
    basePower: 5,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "Stitch red to red, white to white, and everything will be all right.",
  },
  {
    id: "gwint_card_ballista",
    name: "Ballista",
    power: 6,
    basePower: 6,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "'Usually we give 'em female names.' 'Like Jenny?' 'More like Bertha.'",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_catapult1",
    name: "Catapult",
    power: 8,
    basePower: 8,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description: "The gods help those who have better catapults.",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_catapult2",
    name: "Catapult",
    power: 8,
    basePower: 8,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description: "The gods help those who have better catapults.",
  },
  {
    // ABILITY: SUPPORT
    id: "gwint_card_kaedwan_siege1",
    name: "Kaedwani Siege Expert",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "'You gotta recalibrate the arm by five degrees.' 'Do what by the what now?'",
  },
  {
    // ABILITY: SUPPORT
    id: "gwint_card_kaedwan_siege2",
    name: "Kaedwani Siege Expert",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "'You gotta recalibrate the arm by five degrees.' 'Do what by the what now?'",
  },
  {
    // ABILITY: SUPPORT
    id: "gwint_card_kaedwan_siege3",
    name: "Kaedwani Siege Expert",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "'You gotta recalibrate the arm by five degrees.' 'Do what by the what now?'",
  },
  {
    id: "gwint_card_siege_tower",
    name: "Siege Tower",
    power: 6,
    basePower: 6,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "I love the clamor of siege towers in the morning. Sounds like victory.",
  },
  {
    // ABILITY: SPY
    id: "gwint_card_thaler",
    name: "Thaler",
    power: 1,
    basePower: 1,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "I love the clamor of siege towers in the morning. Sounds like victory.",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_trebuchet1",
    name: "Trebuchet",
    power: 6,
    basePower: 6,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "I love the clamor of siege towers in the morning. Sounds like victory.",
  },
  {
    // ABILITY: BOOST
    id: "gwint_card_trebuchet2",
    name: "Trebuchet",
    power: 6,
    basePower: 6,
    faction: FACTION,
    type: "unit",
    allowedRows: ["siege"],
    isHero: false,
    description:
      "I love the clamor of siege towers in the morning. Sounds like victory.",
  },

  // Hero Cards - Most heroes are agile
  {
    id: "gwint_card_esterad",
    name: "Esterad Thyssen",
    power: 10,
    basePower: 10,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: true,
    description:
      "Like all Thyssen men, he was tall, powerfully built and criminally handsome.",
  },
  {
    id: "gwint_card_natalis",
    name: "John Natalis",
    power: 10,
    basePower: 10,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: true,
    description:
      "That square should bear the names of my soldiers, of the dead. Not mine.",
  },
  {
    id: "gwint_card_philippa",
    name: "Philippa Eilhart",
    power: 10,
    basePower: 10,
    faction: FACTION,
    type: "unit",
    allowedRows: ["ranged"],
    isHero: true,
    description:
      "Soon the power of kings will wither, and the Lodge shall seize its rightful place.",
  },
  {
    id: "gwint_card-vernon",
    name: "Vernon Roche",
    power: 10,
    basePower: 10,
    faction: FACTION,
    type: "unit",
    allowedRows: ["melee"],
    isHero: true,
    description: "A patriot... and a real son of a bitch.",
  },
];
