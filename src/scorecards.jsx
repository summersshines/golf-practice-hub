import { useState } from "react";

const PAR72_HOLES = [
  {
    hole: 1, desc: "50m shot to hole", balls: 5,
    options: [
      { value: 1, label: "1 — Inside 3ft" },
      { value: 2, label: "2 — 3–6ft" },
      { value: 3, label: "3 — Hit Green" },
      { value: 4, label: "4 — Missed Green" },
    ],
    default: 4,
  },
  {
    hole: 2, desc: "35m shot to hole", balls: 5,
    options: [
      { value: 1, label: "1 — Inside 3ft" },
      { value: 2, label: "2 — 3–6ft" },
      { value: 3, label: "3 — Hit Green" },
      { value: 4, label: "4 — Missed Green" },
    ],
    default: 4,
  },
  {
    hole: 3, desc: "20m pitch over bunker", balls: 3,
    options: [
      { value: 1, label: "1 — Holed" },
      { value: 2, label: "2 — 0–3ft" },
      { value: 3, label: "3 — 3–6ft" },
      { value: 4, label: "4 — Hit Green" },
      { value: 5, label: "5 — Missed Green" },
    ],
    default: 5,
  },
  {
    hole: 4, desc: "Greenside bunker", balls: 3,
    options: [
      { value: 1, label: "1 — Holed" },
      { value: 2, label: "2 — 0–3ft" },
      { value: 3, label: "3 — 3–6ft" },
      { value: 4, label: "4 — Hit Green" },
      { value: 5, label: "5 — Missed Green" },
    ],
    default: 5,
  },
  {
    hole: 5, desc: "15m chip", balls: 3,
    options: [
      { value: 1, label: "1 — Holed" },
      { value: 2, label: "2 — 0–3ft" },
      { value: 3, label: "3 — 3–6ft" },
      { value: 4, label: "4 — Hit Green" },
      { value: 5, label: "5 — Missed Green" },
    ],
    default: 5,
  },
  {
    hole: 6, desc: "30, 40, 50ft putts (1 each)", balls: 3,
    options: [
      { value: 1, label: "1 — Holed" },
      { value: 2, label: "2 — 0–3ft" },
      { value: 3, label: "3 — 3–6ft" },
      { value: 4, label: "4 — Hit Green" },
      { value: 5, label: "5 — Missed Green" },
    ],
    default: 5,
  },
  {
    hole: 7, desc: "20ft putt — 3 locations", balls: 3,
    options: [
      { value: 1, label: "1 — Holed" },
      { value: 2, label: "2 — 0–3ft" },
      { value: 3, label: "3 — 3–6ft" },
      { value: 4, label: "4 — Hit Green" },
      { value: 5, label: "5 — Missed Green" },
    ],
    default: 5,
  },
  {
    hole: 8, desc: "3ft putts around the hole", balls: 8,
    options: [
      { value: 1, label: "1 — Holed" },
      { value: 2, label: "2 — Missed" },
    ],
    default: 2,
  },
];

const PROXIMITY_SCORECARDS = {
  1: {
    title: "Global Combine",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Chip & Run", stations: ["15–19m", "20–25m", "30–35m"] },
      { label: "Bunker",     stations: ["10–14m", "20–25m", "30–35m"] },
      { label: "Pitch",      stations: ["20–25m", "30–35m", "40–45m"] },
      { label: "Lob",        stations: ["10–12m", "15–17m", "20–22m"] },
    ],
  },
  8: {
    title: "Full Range Combine 10–100m",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["10m", "20m", "30m", "40m", "50m", "60m", "70m", "80m", "90m", "100m"] },
    ],
  },
  10: {
    title: "Variety Combine",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Chip & Run", stations: ["8m", "16m", "24m"] },
      { label: "Bunker",     stations: ["10m", "20m"] },
      { label: "Wedge",      stations: ["8m", "23m", "36m"] },
      { label: "Flop / Lob", stations: ["11m", "16m"] },
    ],
  },
  21: {
    title: "10 Shot Circuit 8–35m",
    icon: "🔄",
    unit: "ft",
    groups: [
      { label: "Fairway", stations: ["9m", "12m", "20m"] },
      { label: "Bunker",  stations: ["8m", "16m", "25m"] },
      { label: "Rough",   stations: ["11m", "22m", "33m"] },
      { label: "Pitch",   stations: ["45m fairway"] },
    ],
  },
  25: {
    title: "9 Station Circuit 10–35m",
    icon: "🔁",
    unit: "ft",
    groups: [
      { label: "Fairway", stations: ["15m", "25m", "35m"] },
      { label: "Rough",   stations: ["10m", "20m", "30m"] },
      { label: "Bunker",  stations: ["11m", "22m", "33m"] },
    ],
  },
  27: {
    title: "All the Shots Combine 20–70m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Fairway", stations: ["20m", "30m", "40m", "50m", "60m", "70m"] },
      { label: "Bunker",  stations: ["20m", "30m", "40m", "50m", "60m", "70m"] },
      { label: "Rough",   stations: ["20m", "30m", "40m", "50m", "60m", "70m"] },
    ],
  },
  28: {
    title: "15 Shot Grinder Combine 7–35m",
    icon: "💪",
    unit: "ft",
    groups: [
      { label: "Fairway", stations: ["7m", "14m", "21m", "28m", "35m"] },
      { label: "Bunker",  stations: ["7m", "14m", "21m", "28m", "35m"] },
      { label: "Rough",   stations: ["7m", "14m", "21m", "28m", "35m"] },
    ],
  },
  11: {
    title: "Wedge Combine 30–70m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["30m", "40m", "50m", "60m", "70m"] },
    ],
  },
  12: {
    title: "3 Shot Close Range Combine (10–14m)",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Shots", stations: ["10m Fairway", "12m Bunker", "14m Rough"] },
    ],
  },
  13: {
    title: "3 Shot Mid Range Combine (20–25m)",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Shots", stations: ["20m Rough", "23m Bunker", "25m Fairway"] },
    ],
  },
  14: {
    title: "3 Shot Long Range Combine (30–40m)",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Shots", stations: ["30m Bunker", "35m Fairway", "40m Rough"] },
    ],
  },
  15: {
    title: "Fairway 3 – 10-30m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Fairway", stations: ["10m", "20m", "30m"] },
    ],
  },
  16: {
    title: "Bunker 3 – 10-30m",
    icon: "⛱️",
    unit: "ft",
    groups: [
      { label: "Bunker", stations: ["10m", "20m", "30m"] },
    ],
  },
  17: {
    title: "Rough 3 – 10-30m",
    icon: "🌿",
    unit: "ft",
    groups: [
      { label: "Rough", stations: ["10m", "20m", "30m"] },
    ],
  },
  18: {
    title: "Fairway 6 – 10-35m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Fairway", stations: ["10m", "15m", "20m", "25m", "30m", "35m"] },
    ],
  },
  19: {
    title: "Bunker 6 – 10-35m",
    icon: "⛱️",
    unit: "ft",
    groups: [
      { label: "Bunker", stations: ["10m", "15m", "20m", "25m", "30m", "35m"] },
    ],
  },
  20: {
    title: "Rough 6 – 10-35m",
    icon: "🌿",
    unit: "ft",
    groups: [
      { label: "Rough", stations: ["10m", "15m", "20m", "25m", "30m", "35m"] },
    ],
  },
  24: {
    title: "Lob Master – 6 Shot Challenge (10–35m)",
    icon: "🎯",
    unit: "ft",
    groups: [
      { label: "Lob Wedge", stations: ["10m", "15m", "20m", "25m", "30m", "35m"] },
    ],
  },
  26: {
    title: "Wedge Combine 80–120m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["80m", "90m", "100m", "110m", "120m"] },
    ],
  },
  29: {
    title: "Bump and Run – No Wedges Allowed",
    icon: "⛳",
    unit: "ft",
    groups: [
      { label: "Bump & Run", stations: ["10m", "15m", "20m", "25m", "30m", "35m"] },
    ],
  },
  30: {
    title: "Wedge Combine 50–75m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["50m", "65m", "75m"] },
    ],
  },
  31: {
    title: "Wedge Combine 80–100m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["80m", "90m", "100m"] },
    ],
  },
  32: {
    title: "Wedge Circuit 50–100m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["50m", "90m", "75m", "83m", "63m", "99m"] },
    ],
  },
  37: {
    title: "Long Distance Proximity Test",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Putts", stations: ["30ft", "40ft", "50ft", "60ft", "70ft"] },
    ],
  },
  76: {
    title: "Washington Speed Control – 20ft",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Putts from 20ft", stations: ["Putt 1", "Putt 2", "Putt 3", "Putt 4", "Putt 5", "Putt 6", "Putt 7", "Putt 8", "Putt 9", "Putt 10"] },
    ],
  },
  77: {
    title: "Washington Speed Control – 30ft",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Putts from 30ft", stations: ["Putt 1", "Putt 2", "Putt 3", "Putt 4", "Putt 5", "Putt 6", "Putt 7", "Putt 8", "Putt 9", "Putt 10"] },
    ],
  },
  83: {
    title: "3 Distance Test (10, 15, 20m)",
    icon: "📏",
    unit: "ft",
    groups: [
      { label: "Shots", stations: ["10m", "15m", "20m"] },
    ],
  },
  84: {
    title: "Wedge Combine 50–80m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["50m", "65m", "80m"] },
    ],
  },
  85: {
    title: "Wedge Combine 55–95m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["55m", "65m", "75m", "85m", "95m"] },
    ],
  },
  86: {
    title: "Wedge Combine 60–80m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["60m", "65m", "70m", "75m", "80m"] },
    ],
  },
  87: {
    title: "Wedge Combine 80–100m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["80m", "85m", "90m", "95m", "100m"] },
    ],
  },
  88: {
    title: "Wedge Combine 70–90m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["70m", "75m", "80m", "85m", "90m"] },
    ],
  },
  89: {
    title: "Wedge Combine 40–80m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["40m", "60m", "80m"] },
    ],
  },
  90: {
    title: "Wedge Combine 50–90m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["50m", "70m", "90m"] },
    ],
  },
  91: {
    title: "Wedge Combine 30–50m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["30m", "35m", "40m", "45m", "50m"] },
    ],
  },
  92: {
    title: "Wedge Combine 40–60m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["40m", "45m", "50m", "55m", "60m"] },
    ],
  },
  96: {
    title: "Wedge Combine 40–100m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["40m", "55m", "70m", "85m", "100m"] },
    ],
  },
  97: {
    title: "Wedge Combine 30–90m",
    icon: "🏌️",
    unit: "ft",
    groups: [
      { label: "Wedge Shots", stations: ["30m", "60m", "90m"] },
    ],
  },
};

const NEGATIVE_SCORECARDS = {
  22: {
    title: "Texas Tech Challenge",
    icon: "🤠",
    shots: [
      "10m fringe chip",
      "15m flop shot (short sided)",
      "20m fairway — 50% green available",
      "20m fairway bump & run",
      "15m bunker (short sided)",
      "20m bunker (open side)",
      "15m rough — 50% green available",
      "25m rough open sided downhill",
      "10m rough short side",
    ],
  },
  23: {
    title: "Recovery Mission — 9 Hole Challenge",
    icon: "🚨",
    shots: [
      "8m fringe (downslope)",
      "12m chip & run (upslope)",
      "12m bunker (upslope)",
      "15m bunker (downslope)",
      "25m pitch (ball above feet)",
      "30m pitch (ball below feet)",
      "10m lob (upslope)",
      "20m chip & run (uphill)",
      "25m chip & run (downhill)",
    ],
  },
};

const NEGATIVE_OPTIONS = [
  { value: -2, label: "-2 — Holed" },
  { value: -1, label: "-1 — 0–3ft" },
  { value:  0, label: " 0 — 3–6ft" },
  { value:  1, label: "+1 — 6–12ft" },
  { value:  2, label: "+2 — 12ft+" },
];

const BROADIE_OPTIONS = [
  { value: 2,  label: "2 pts — Holed" },
  { value: 0,  label: "0 pts — 2-putt" },
  { value: -1, label: "-1 pt — Short, 2-putt" },
  { value: -3, label: "-3 pts — 3-putt" },
];

const POINTS_RACE_OPTIONS = [
  { value:  3, label: "3 pts — Holed" },
  { value:  0, label: "0 pts — 0–3ft past hole" },
  { value: -3, label: "-3 pts — Short or 3-putt" },
];

const JUNIOR_PUTTING_HOLES = [
  { hole: 1, dist: "3ft" },
  { hole: 2, dist: "4ft" },
  { hole: 3, dist: "5ft" },
  { hole: 4, dist: "6ft" },
  { hole: 5, dist: "8ft" },
  { hole: 6, dist: "12ft" },
  { hole: 7, dist: "15ft" },
  { hole: 8, dist: "20ft" },
  { hole: 9, dist: "30ft" },
];

const JUNIOR_SHORT_GAME_HOLES = [
  { hole: 1, desc: "Fringe <10m" },
  { hole: 2, desc: "Fringe 10–20m" },
  { hole: 3, desc: "Chip & run 10m" },
  { hole: 4, desc: "Chip & run 10–20m" },
  { hole: 5, desc: "Pitch 20m" },
  { hole: 6, desc: "Pitch 30m" },
  { hole: 7, desc: "Lob 10m" },
  { hole: 8, desc: "Bunker 10m" },
  { hole: 9, desc: "Bunker 20m" },
];

const JUNIOR_SHORT_GAME_OPTIONS = [
  { value: 4, label: "4 pts — Holed" },
  { value: 3, label: "3 pts — 0–3ft" },
  { value: 2, label: "2 pts — 3–6ft" },
  { value: 1, label: "1 pt  — 6–12ft" },
  { value: 0, label: "0 pts — 12ft+" },
];

const SUNDAY_STANDARD_QUADRANTS = [
  "R to L Uphill",
  "R to L Downhill",
  "L to R Uphill",
  "L to R Downhill",
];

const SUNDAY_STANDARD_SECTIONS = [
  {
    label: "Section 1 — Gate Drill",
    desc: "4 putts from ~6ft through start gates — must go through gates AND hole out",
    putts: 4,
  },
  {
    label: "Section 2 — Speed Read",
    desc: "Putts from 6, 9, 12, 15ft to a ghost hole — must pass through ghost hole AND finish in speed zone 1–2ft behind",
    putts: 4,
  },
  {
    label: "Section 3 — Hole Out",
    desc: "Putts from 4, 5, 6, 7ft — must hole out",
    putts: 4,
  },
];

const SWEDISH_ROWS = [
  "Chip 10m", "Chip 20m", "Pitch 20m", "Pitch 40m",
  "Lob 15m", "Lob 25m", "Bunker 10m", "Bunker 20m",
];

const SWEDISH_OPTIONS = [
  { value: 0, label: "0 pts — 9ft+" },
  { value: 1, label: "1 pt  — 6–9ft" },
  { value: 2, label: "2 pts — 3–6ft" },
  { value: 3, label: "3 pts — 0–3ft" },
  { value: 4, label: "4 pts — Holed" },
];

const PELZ_CATEGORIES = [
  "3/4 Wedge 70m",
  "1/2 Wedge 40m",
  "Long Sand 20–35m",
  "Short Sand 7–15m",
  "Long Chip 15–30m",
  "Short Chip 7–15m",
  "Pitch Fairway 10–20m",
  "Pitch Rough 10–20m",
  "Cut Lob 10–20m",
];

const PELZ_OPTIONS = [
  { value: 0, label: "0 pts — 6ft+" },
  { value: 1, label: "1 pt  — 3–6ft" },
  { value: 2, label: "2 pts — 0–3ft" },
  { value: 4, label: "4 pts — Holed" },
];

const PELZ_HANDICAP = [
  [155,"+8"],[148,"+7"],[143,"+6"],[138,"+5"],[134,"+4"],[127,"+3"],[125,"+2"],[121,"+1"],
  [117,"0"],[113,"1"],[110,"2"],[106,"3"],[101,"4"],[99,"5"],[94,"6"],[90,"7"],
  [88,"8"],[84,"9"],[80,"10"],[78,"11"],[74,"12"],[71,"13"],[68,"14"],[66,"15"],
  [61,"16"],[59,"17"],[56,"18"],[52,"19"],[49,"20"],[46,"21"],[43,"22"],[41,"23"],
  [37,"24"],[34,"25"],[33,"26"],[29,"27"],[27,"28"],[23,"29"],[22,"30"],[19,"31"],
  [16,"32"],[14,"33"],[12,"34"],[9,"35"],[8,"36"],[3,"37"],[2,"38"],[0,"39"],
];

function getPelzHandicap(score) {
  for (const [threshold, hcp] of PELZ_HANDICAP) {
    if (score >= threshold) return hcp;
  }
  return "40";
}

const HOLE_ALL_DISTANCES_CONFIGS = {
  55: { title: "Full Range Tour Test (3–15ft)", icon: "🎯", distances: [3,4,5,6,7,8,9,10,11,12,13,14,15], perfect: 13, worst: 37 },
  53: { title: "Tour Test 3–10ft",              icon: "🎯", distances: [3,4,5,6,7,8,9,10],               perfect: 8,  worst: 14 },
  54: { title: "Tour Test 10–15ft",             icon: "🎯", distances: [10,11,12,13,14,15],              perfect: 6,  worst: 30 },
  56: { title: "Make Zone Test 3–7ft",          icon: "🎯", distances: [3,4,5,6,7],                      perfect: 5,  worst: 10 },
  57: { title: "Make Zone Test 6–10ft",         icon: "🎯", distances: [6,7,8,9,10],                     perfect: 5,  worst: 15 },
  58: { title: "Make Zone Test 8–12ft",         icon: "🎯", distances: [8,9,10,11,12],                   perfect: 5,  worst: 20 },
  59: { title: "Make Zone Test 3–8ft",          icon: "🎯", distances: [3,4,5,6,7,8],                    perfect: 6,  worst: 10 },
};

const TAP_TO_TOGGLE_CONFIGS = {
  60: {
    title: "Peter Hanson Test (4–5ft)", icon: "🎯",
    putts: [
      { label: "4ft (N)" }, { label: "4ft (E)" }, { label: "4ft (S)" }, { label: "4ft (W)" },
      { label: "5ft (NE)" }, { label: "5ft (NW)" }, { label: "5ft (SE)" }, { label: "5ft (SW)" },
    ],
    total: 8,
  },
  61: {
    title: "4-5-6 Circuit – 6 Putts", icon: "🎯",
    putts: [
      { label: "4ft" }, { label: "5ft" }, { label: "6ft" },
      { label: "4ft" }, { label: "5ft" }, { label: "6ft" },
    ],
    total: 6,
  },
  62: {
    title: "4-5-6 Circuit – 9 Putts", icon: "🎯",
    putts: [
      { label: "4ft" }, { label: "5ft" }, { label: "6ft" },
      { label: "4ft" }, { label: "5ft" }, { label: "6ft" },
      { label: "4ft" }, { label: "5ft" }, { label: "6ft" },
    ],
    total: 9,
  },
  98: {
    title: "Team Ripper Challenge (4, 6, 8ft)", icon: "🎯",
    putts: [
      { label: "4ft" }, { label: "4ft" }, { label: "4ft" }, { label: "4ft" },
      { label: "6ft" }, { label: "6ft" }, { label: "6ft" }, { label: "6ft" },
      { label: "8ft" }, { label: "8ft" },
    ],
    total: 10,
  },
};

// Spiral Hole Out grid config — separate from flat TapToToggle drills
const SPIRAL_HOLE_OUT_CONFIG = {
  title: "Spiral Hole Out Test (5–15ft)", icon: "🌀",
  distances: ["5ft", "7ft", "9ft", "11ft", "13ft", "15ft"],
  holes: 3,
  total: 18,
};

const ELIMINATOR_CONFIGS = {
  46: { title: "Momentum Keeper – 12ft Eliminator", icon: "💪", distance: "12ft", positions: 8, cap: 36 },
  47: { title: "The Surgeon – 4ft Eliminator",      icon: "🔬", distance: "4ft",  positions: 8, cap: 14 },
  48: { title: "The Payday – 8ft Eliminator",       icon: "💰", distance: "8ft",  positions: 8, cap: 24 },
};

const GATE_COMPLETION_CONFIGS = {
  50: { title: "Iron Gates",        icon: "🚪", target: 10, cap: 20, label: "Flat"  },
  51: { title: "Iron Gates (R–L)", icon: "🚪", target: 10, cap: 24, label: "Right to Left" },
  52: { title: "Iron Gates (L–R)", icon: "🚪", target: 10, cap: 24, label: "Left to Right" },
};

// ─── SCORECARD MODAL COMPONENTS ──────────────────────────────────────────────

const LIE_MIX_CONFIGS = {
  80: {
    title: "6 Lie Bunker Challenge",
    icon: "⛱️",
    context: "Hit from various distances — your choice",
    lies: [
      "1 — Flat lie",
      "2 — Ball above feet",
      "3 — Ball below feet",
      "4 — Upslope",
      "5 — Downslope",
      "6 — Plugged lie",
    ],
  },
  81: {
    title: "Close Range Lie Mix",
    icon: "⛱️",
    context: "All shots from 0–10m from the hole",
    lies: [
      "1 — Flat lie",
      "2 — Ball above feet",
      "3 — Ball below feet",
      "4 — Upslope",
      "5 — Downslope",
    ],
  },
  82: {
    title: "Mid Range Lie Mix",
    icon: "⛱️",
    context: "All shots from 10–20m from the hole",
    lies: [
      "1 — Flat lie",
      "2 — Ball above feet",
      "3 — Ball below feet",
      "4 — Upslope",
      "5 — Downslope",
    ],
  },
};

const LIE_MIX_OPTIONS = [
  { value: 4, label: "4 pts — Holed" },
  { value: 3, label: "3 pts — 0–3ft" },
  { value: 2, label: "2 pts — 3–6ft" },
  { value: 1, label: "1 pt  — 6–12ft" },
  { value: 0, label: "0 pts — 12ft+" },
];

function LieMixScorecardModal({ drillId, drill, onSave, onCancel }) {
  const config = LIE_MIX_CONFIGS[drillId];
  const [values, setValues] = useState(config.lies.map(() => 0));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? Number(val) : v));
  }

  const grandTotal = values.reduce((a, b) => a + b, 0);
  const maxScore = config.lies.length * 4;
  const zone = grandTotal >= Math.round(maxScore * 0.75)
    ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= Math.round(maxScore * 0.5)
    ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">{config.context}</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span>Holed = 4pts</span>
          <span>0–3ft = 3pts</span>
          <span>3–6ft = 2pts</span>
          <span>6–12ft = 1pt</span>
          <span>12ft+ = 0pts</span>
        </div>
        <div className="px-4 py-4 space-y-2">
          {config.lies.map((lie, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-sm text-gray-700 flex-1">{lie}</span>
              <select
                value={values[i]}
                onChange={e => setValue(i, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
              >
                {LIE_MIX_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              {drill && <p>Perfect: {drill.perfect} pts</p>}
              <p>Worst: 0 pts</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={() => onSave(grandTotal)} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm">
            Save Score ({grandTotal} pts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function TapToToggleModal({ drillId, drill, onSave, onCancel }) {
  const config = TAP_TO_TOGGLE_CONFIGS[drillId];
  const [values, setValues] = useState(Array(config.total).fill(null));

  function toggle(idx) {
    setValues(prev => prev.map((v, i) => i === idx ? (v === 1 ? 0 : 1) : v));
  }

  const allFilled = values.every(v => v !== null);
  const grandTotal = values.reduce((a, v) => a + (v ?? 0), 0);
  const zone = grandTotal >= Math.round(config.total * 0.8)
    ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= Math.round(config.total * 0.5)
    ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">Tap each putt to mark holed or missed — higher is better</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Tap to toggle ✅ Holed · ❌ Missed · Score = total holed
        </div>
        <div className="px-4 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {config.putts.map((putt, i) => {
              const val = values[i];
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{putt.label}</span>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className={`w-14 h-14 rounded-xl border-2 text-xl font-bold transition-colors ${
                      val === 1 ? "bg-green-500 border-green-600 text-white"
                      : val === 0 ? "bg-red-100 border-red-300 text-red-400"
                      : "bg-gray-100 border-gray-300 text-gray-300"
                    }`}
                  >
                    {val === 1 ? "✅" : val === 0 ? "❌" : "·"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${allFilled ? zone.color : "text-gray-500 bg-gray-50 border-gray-200"}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Holed</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal} / {config.total}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{allFilled ? zone.label : '—'}</p>
              {drill && <p>Perfect: {drill.perfect} · Worst: {drill.worst}</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal} / {config.total})
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SpiralHoleOutModal({ drill, onSave, onCancel }) {
  const config = SPIRAL_HOLE_OUT_CONFIG;
  // values[hole][distIdx]: null = untapped, 1 = holed, 0 = missed
  const [values, setValues] = useState(
    Array(config.holes).fill(null).map(() => Array(config.distances.length).fill(null))
  );

  function toggle(hi, di) {
    setValues(prev => prev.map((h, hIdx) =>
      hIdx === hi ? h.map((v, dIdx) => dIdx === di ? (v === 1 ? 0 : 1) : v) : h
    ));
  }

  const allFilled = values.every(h => h.every(v => v !== null));
  const grandTotal = values.reduce((a, h) => a + h.reduce((x, v) => x + (v ?? 0), 0), 0);
  const zone = grandTotal >= 12 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 7 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">3 holes × 6 distances — tap to mark holed or missed</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Tap to toggle ✅ Holed · ❌ Missed · Score = total holed out of 18
        </div>
        <div className="px-4 py-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 w-16">Dist</th>
                {Array(config.holes).fill(null).map((_, hi) => (
                  <th key={hi} className="text-center pb-2 text-xs font-semibold text-green-700">
                    Hole {hi + 1}
                    <div className="text-gray-400 font-normal">
                      {values[hi].filter(v => v === 1).length}/{config.distances.length}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.distances.map((dist, di) => (
                <tr key={di} className={di % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-1.5 pr-2 text-xs font-semibold text-gray-600">{dist}</td>
                  {Array(config.holes).fill(null).map((_, hi) => {
                    const val = values[hi][di];
                    return (
                      <td key={hi} className="py-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggle(hi, di)}
                          className={`w-12 h-10 rounded-lg border-2 text-base font-bold transition-colors ${
                            val === 1 ? "bg-green-500 border-green-600 text-white"
                            : val === 0 ? "bg-red-100 border-red-300 text-red-400"
                            : "bg-gray-100 border-gray-300 text-gray-300"
                          }`}
                        >
                          {val === 1 ? "✅" : val === 0 ? "❌" : "·"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${allFilled ? zone.color : "text-gray-500 bg-gray-50 border-gray-200"}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Holed</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal} / 18</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{allFilled ? zone.label : "—"}</p>
              <p>Green 12+ · Yellow 7–11 · Red &lt;7</p>
              {drill && <p>Perfect: {drill.perfect} · Worst: {drill.worst}</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal} / 18)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function EliminatorModal({ drillId, onSave, onCancel }) {
  const config = ELIMINATOR_CONFIGS[drillId];
  // null = active, true = eliminated
  const [eliminated, setEliminated] = useState(Array(config.positions).fill(false));
  const [puttCount, setPuttCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);

  function recordPutt(posIdx, made) {
    const newPuttCount = puttCount + 1;
    setPuttCount(newPuttCount);
    if (made) {
      const newEliminated = eliminated.map((v, i) => i === posIdx ? true : v);
      setEliminated(newEliminated);
      if (newEliminated.every(v => v)) setFinished(true);
    }
    if (!finished && newPuttCount >= config.cap) {
      setCapReached(true);
      setFinished(true);
    }
  }

  const eliminatedCount = eliminated.filter(v => v).length;
  const zone = puttCount <= config.perfect + 2
    ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : puttCount <= Math.round((config.perfect + config.cap) / 2)
    ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">Hole the putt to eliminate each position — count total putts</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800 flex justify-between">
          <span>All putts from {config.distance} · Cap: {config.cap} putts</span>
          <span className="font-bold">Eliminated: {eliminatedCount} / {config.positions}</span>
        </div>

        <div className="px-4 py-6">
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {Array(config.positions).fill(null).map((_, i) => {
              const isEliminated = eliminated[i];
              return (
                <div
                  key={i}
                  className={`${i === 1 ? "col-start-2" : i === 3 ? "col-start-3" : i === 4 ? "col-start-2" : i === 5 ? "col-start-1" : ""}`}
                >
                  {!isEliminated ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="text-center text-xs font-semibold text-gray-500">{COMPASS[i]}</div>
                      <div className="flex gap-1.5 justify-center">
                        <button
                          type="button"
                          onClick={() => recordPutt(i, true)}
                          disabled={finished}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 disabled:opacity-40"
                        >✅</button>
                        <button
                          type="button"
                          onClick={() => recordPutt(i, false)}
                          disabled={finished}
                          className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-200 border border-red-200 disabled:opacity-40"
                        >❌</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-center text-xs font-semibold text-gray-400">{COMPASS[i]}</div>
                      <div className="w-full h-12 rounded-lg bg-green-100 border-2 border-green-300 flex items-center justify-center text-lg">✅</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {finished && (
          <div className={`mx-4 mb-4 rounded-xl border px-4 py-3 text-center ${capReached ? "bg-red-50 border-red-200 text-red-700" : zone.color}`}>
            <p className="text-sm font-bold mb-1">{capReached ? "Cap reached" : "All positions eliminated! 🎉"}</p>
            <p className="text-4xl font-extrabold">{puttCount}</p>
            <p className="text-sm mt-1">total putts</p>
          </div>
        )}

        <div className="px-4 pb-4 flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Putts taken</p>
            <p className="text-2xl font-extrabold text-gray-700">{puttCount}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="text-2xl font-extrabold text-gray-700">{config.positions - eliminatedCount}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Cap</p>
            <p className="text-2xl font-extrabold text-gray-700">{config.cap}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(puttCount)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({puttCount} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function GateCompletionModal({ drillId, onSave, onCancel }) {
  const config = GATE_COMPLETION_CONFIGS[drillId];
  const [successful, setSuccessful] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);

  function recordPutt(success) {
    const newTotal = total + 1;
    const newSuccessful = success ? successful + 1 : successful;
    setTotal(newTotal);
    setSuccessful(newSuccessful);
    if (newSuccessful >= config.target) setFinished(true);
    else if (newTotal >= config.cap) { setCapReached(true); setFinished(true); }
  }

  const zone = total <= config.target + 2
    ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : total <= Math.round((config.target + config.cap) / 2)
    ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">{config.label} — get {config.target} putts through the gate</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800 flex justify-between">
          <span>Count all putts taken · Lower is better · Cap: {config.cap}</span>
          <span className="font-bold">Through gate: {successful} / {config.target}</span>
        </div>

        <div className="px-4 py-6">
          {!finished ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-3">Putt {total + 1} — did it go through the gate and hole out?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => recordPutt(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700"
                >
                  ✅ Through gate + holed
                </button>
                <button
                  type="button"
                  onClick={() => recordPutt(false)}
                  className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-semibold text-sm hover:bg-red-200 border border-red-200"
                >
                  ❌ Failed
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border px-4 py-4 text-center ${capReached ? "bg-red-50 border-red-200 text-red-700" : zone.color}`}>
              <p className="text-lg font-bold mb-1">{capReached ? "Cap reached" : "Target reached! 🎉"}</p>
              <p className="text-4xl font-extrabold">{total}</p>
              <p className="text-sm mt-1">total putts · {successful} successful</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-4 flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Total putts</p>
            <p className="text-2xl font-extrabold text-gray-700">{total}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Successful</p>
            <p className="text-2xl font-extrabold text-green-700">{successful}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Needed</p>
            <p className="text-2xl font-extrabold text-gray-700">{Math.max(0, config.target - successful)}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(total)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({total} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SwedishScorecardModal({ onSave, onCancel }) {
  const [grid, setGrid] = useState(
    Array.from({ length: 8 }, () => Array(5).fill(0))
  );
  function setCell(row, col, val) {
    setGrid(prev => prev.map((r, ri) =>
      ri === row ? r.map((c, ci) => ci === col ? Number(val) : c) : r
    ));
  }
  const rowTotals = grid.map(r => r.reduce((a, b) => a + b, 0));
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);
  const zone = grandTotal >= 64 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 40 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🇸🇪 Swedish National 40 Shot Combine</h2>
          <p className="text-green-300 text-sm mt-0.5">Hit 5 attempts from each shot type — select your result per attempt</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span>Holed = 4</span>
          <span>0–3ft = 3</span>
          <span>3–6ft = 2</span>
          <span>6–9ft = 1</span>
          <span>9ft+ = 0</span>
          <span className="text-green-600 ml-auto italic">Åberg benchmark: 82 pts</span>
        </div>
        <div className="px-3 py-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-xs text-gray-500 text-center">
                <th className="text-left py-1 pr-2 font-semibold text-gray-700 w-28">Shot Type</th>
                {[1,2,3,4,5].map(n => (
                  <th key={n} className="py-1 px-1 font-medium w-24">Attempt {n}</th>
                ))}
                <th className="py-1 px-2 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {SWEDISH_ROWS.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-2 pr-2 font-medium text-gray-700 text-xs">{row}</td>
                  {[0,1,2,3,4].map(ci => (
                    <td key={ci} className="py-1 px-1">
                      <select
                        value={grid[ri][ci]}
                        onChange={e => setCell(ri, ci, e.target.value)}
                        className="w-full border border-gray-300 rounded px-1 py-1 text-xs text-center bg-white focus:outline-none focus:border-green-500"
                      >
                        {SWEDISH_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                  <td className="py-1 px-2 text-center font-bold text-green-700">{rowTotals[ri]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
              <p className="text-xs mt-0.5">out of 160 possible pts</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{zone.label}</p>
              <p className="text-xs opacity-70 mt-0.5">Green 64+ · Yellow 40–63 · Red &lt;40</p>
              <p className="text-xs opacity-70">Åberg benchmark: 82 pts</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={() => onSave(grandTotal)} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm">
            Save Score ({grandTotal} pts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Par72ScorecardModal({ onSave, onCancel }) {
  const [shots, setShots] = useState(
    PAR72_HOLES.map(h => Array(h.balls).fill(h.default))
  );

  function setShot(holeIdx, shotIdx, val) {
    setShots(prev => prev.map((h, hi) =>
      hi === holeIdx ? h.map((s, si) => si === shotIdx ? Number(val) : s) : h
    ));
  }

  const holeTotals = shots.map(h => h.reduce((a, b) => a + b, 0));
  const grandTotal = holeTotals.reduce((a, b) => a + b, 0);
  const toPar = grandTotal - 72;
  const toParLabel = toPar === 0 ? "Level par" : toPar > 0 ? `+${toPar} over par` : `${toPar} under par`;

  const zone = grandTotal <= 68 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal <= 75 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">

        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">⛳ Par 72 Scoring Challenge</h2>
          <p className="text-green-300 text-sm mt-0.5">Select your result for each shot — lower is better</p>
        </div>

        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span>Holes 1–2: Inside 3ft = 1 · 3–6ft = 2 · Hit Green = 3 · Missed Green = 4</span>
          <span>Holes 3–7: Holed = 1 · 0–3ft = 2 · 3–6ft = 3 · Hit Green = 4 · Missed Green = 5</span>
          <span>Hole 8: Holed = 1 · Missed = 2</span>
        </div>

        <div className="px-4 py-4 space-y-4">
          {PAR72_HOLES.map((h, hi) => (
            <div key={hi} className={`rounded-xl p-3 ${hi % 2 === 0 ? "bg-gray-50" : "bg-white border border-gray-100"}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-green-700 mr-2">Hole {h.hole}</span>
                  <span className="text-xs text-gray-600">{h.desc}</span>
                  <span className="text-xs text-gray-400 ml-1">({h.balls} {h.balls === 1 ? "ball" : "balls"})</span>
                </div>
                <span className="text-sm font-bold text-green-700">Total: {holeTotals[hi]}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {shots[hi].map((val, si) => (
                  <div key={si} className="flex flex-col items-center gap-0.5">
                    <span className="text-xs text-gray-400">#{si + 1}</span>
                    <select
                      value={val}
                      onChange={e => setShot(hi, si, e.target.value)}
                      className="border border-gray-300 rounded px-1 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
                    >
                      {h.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
              <p className="text-xs mt-0.5">{toParLabel} · Par 72</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{zone.label}</p>
              <p className="text-xs opacity-70 mt-0.5">Perfect: 68 · Par: 72 · Worst: 88</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
          >
            Save Score ({grandTotal})
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

function PelzScorecardModal({ onSave, onCancel }) {
  const [mode, setMode] = useState(null);
  const [currentCat, setCurrentCat] = useState(0);
  const [shots, setShots] = useState(null);

  function initMode(m) {
    const count = m === "full" ? 10 : 5;
    setShots(PELZ_CATEGORIES.map(() => Array(count).fill(0)));
    setMode(m);
    setCurrentCat(0);
  }

  function setShot(shotIdx, val) {
    setShots(prev => prev.map((cat, ci) =>
      ci === currentCat ? cat.map((s, si) => si === shotIdx ? Number(val) : s) : cat
    ));
  }

  const catTotals = shots ? shots.map(cat => cat.reduce((a, b) => a + b, 0)) : [];
  const grandTotal = catTotals.reduce((a, b) => a + b, 0);
  const shotCount = mode === "full" ? 10 : 5;
  const isLast = currentCat === 8;
  const isReview = mode !== null && shots !== null && currentCat === 9;
  const finalScore = mode === "half" ? grandTotal * 2 : grandTotal;

  if (!mode) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
          <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
            <h2 className="text-lg font-bold">🏌️ Dave Pelz Short Game Challenge</h2>
            <p className="text-green-300 text-sm mt-0.5">Select challenge mode to begin</p>
          </div>
          <div className="px-5 py-6 space-y-4">
            <button
              onClick={() => initMode("full")}
              className="w-full bg-green-700 text-white py-4 px-5 rounded-xl font-semibold hover:bg-green-800 text-left"
            >
              <div className="text-base">Full Challenge — 90 shots</div>
              <div className="text-green-300 text-sm font-normal mt-0.5">10 shots from each of the 9 categories</div>
            </button>
            <button
              onClick={() => initMode("half")}
              className="w-full bg-green-600 text-white py-4 px-5 rounded-xl font-semibold hover:bg-green-700 text-left"
            >
              <div className="text-base">Half Challenge — 45 shots</div>
              <div className="text-green-300 text-sm font-normal mt-0.5">5 shots from each category · score doubled for comparison</div>
            </button>
            <button onClick={onCancel} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isReview) {
    const hcp = getPelzHandicap(finalScore);
    const zone = finalScore >= 117 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
      : finalScore >= 80 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
      : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
          <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
            <h2 className="text-lg font-bold">🏌️ Dave Pelz Short Game Challenge</h2>
            <p className="text-green-300 text-sm mt-0.5">Summary — {mode === "full" ? "Full (90 shots)" : "Half (45 shots)"}</p>
          </div>
          <div className="px-4 py-4">
            <table className="w-full text-sm mb-4">
              <tbody>
                {PELZ_CATEGORIES.map((cat, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-1.5 px-2 text-gray-700">{cat}</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-green-700">{catTotals[i]} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-gray-200 pt-3 mb-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Raw total</span>
                <span className="font-semibold">{grandTotal} pts</span>
              </div>
              {mode === "half" && (
                <div className="flex justify-between text-green-700">
                  <span>Doubled score <span className="text-gray-400 font-normal">(Half version)</span></span>
                  <span className="font-semibold">{finalScore} pts</span>
                </div>
              )}
            </div>
            <div className={`flex items-center justify-between rounded-xl border px-4 py-3 mb-4 ${zone.color}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Final Score</p>
                <p className="text-4xl font-extrabold leading-none">{finalScore}</p>
                <p className="text-xs mt-0.5">out of {mode === "full" ? "360" : "360 (doubled)"} possible pts</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{zone.label}</p>
                <p className="text-2xl font-extrabold">HCP {hcp}</p>
                <p className="text-xs opacity-70 mt-0.5">PGA Tour 143+ · LPGA Tour 110–125</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-5 pb-5">
            <button
              onClick={() => onSave(finalScore)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({finalScore} pts)
            </button>
            <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const catRunningTotal = shots.slice(0, currentCat + 1).reduce((a, cat) => a + cat.reduce((x, y) => x + y, 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🏌️ Dave Pelz Short Game Challenge</h2>
          <p className="text-green-300 text-sm mt-0.5">{mode === "full" ? "Full (90 shots)" : "Half (45 shots)"}</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span className="font-semibold">Category {currentCat + 1} of 9 — {PELZ_CATEGORIES[currentCat]}</span>
          <span className="ml-auto">Holed = 4pts · 0–3ft = 2pts · 3–6ft = 1pt · 6ft+ = 0pts</span>
        </div>
        <div className="px-4 py-4">
          <div className="flex flex-wrap gap-3 mb-4">
            {shots[currentCat].map((val, si) => (
              <div key={si} className="flex flex-col items-center gap-0.5">
                <span className="text-xs text-gray-400">Shot {si + 1}</span>
                <select
                  value={val}
                  onChange={e => setShot(si, e.target.value)}
                  className="border border-gray-300 rounded px-1 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
                >
                  {PELZ_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-500 text-xs">This category</span>
              <span className="block font-bold text-green-700 text-lg">{shots[currentCat].reduce((a, b) => a + b, 0)} pts</span>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-500 text-xs">Running total</span>
              <span className="block font-bold text-green-700 text-lg">{catRunningTotal} pts</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => setCurrentCat(c => c - 1)}
            disabled={currentCat === 0}
            className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={() => setCurrentCat(c => c + 1)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
          >
            {isLast ? "Review Score →" : `Next — ${PELZ_CATEGORIES[currentCat + 1] ?? ""} →`}
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ProximityScorecardModal({ drillId, drill, onSave, onCancel }) {
  const config = PROXIMITY_SCORECARDS[drillId];
  const flatStations = config.groups.flatMap(g => g.stations.map(s => ({ group: g.label, station: s })));
  const [values, setValues] = useState(flatStations.map(() => ""));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? val : v));
  }

  const runningTotal = parseFloat(
    values.reduce((sum, v) => sum + (v === "" ? 0 : parseFloat(v) || 0), 0).toFixed(1)
  );
  const allFilled = values.every(v => v !== "");
  const finalScore = parseFloat(
    values.reduce((sum, v) => sum + (parseFloat(v) || 0), 0).toFixed(1)
  );

  let stationIdx = 0;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">Enter proximity to hole in feet for each shot — lower is better</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Record how many feet each shot finishes from the hole · Total all shots for your score
        </div>
        <div className="px-4 py-4 space-y-4">
          {config.groups.map((group, gi) => (
            <div key={gi}>
              <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 pb-1 border-b border-green-100">
                {group.label}
              </div>
              <div className="space-y-2">
                {group.stations.map((station) => {
                  const idx = stationIdx++;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 flex-1">{station}</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={values[idx]}
                        onChange={e => setValue(idx, e.target.value)}
                        placeholder="ft"
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-green-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Running Total</p>
              <p className="text-4xl font-extrabold leading-none">{runningTotal}</p>
              <p className="text-xs mt-0.5">feet — lower is better</p>
            </div>
            <div className="text-right text-xs text-green-600">
              {drill && <p>Perfect: {drill.perfect} ft</p>}
              {drill && <p>Worst: {drill.worst} ft</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(finalScore)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({runningTotal} ft)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function NegativeScorecardModal({ drillId, onSave, onCancel }) {
  const config = NEGATIVE_SCORECARDS[drillId];
  const [values, setValues] = useState(config.shots.map(() => 2));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? Number(val) : v));
  }

  const grandTotal = values.reduce((a, b) => a + b, 0);
  const totalLabel = grandTotal < 0
    ? { text: `${grandTotal} under`, color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal > 0
    ? { text: `+${grandTotal} over`, color: "text-red-700 bg-red-50 border-red-200" }
    : { text: "Level", color: "text-yellow-700 bg-yellow-50 border-yellow-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">Select your result for each shot — lower is better</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800 flex flex-wrap gap-x-4 gap-y-1">
          <span>Holed = -2</span>
          <span>0–3ft = -1</span>
          <span>3–6ft = 0</span>
          <span>6–12ft = +1</span>
          <span>12ft+ = +2</span>
        </div>
        <div className="px-4 py-4 space-y-2">
          {config.shots.map((shot, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-xs font-bold text-green-700 w-5 shrink-0">{i + 1}</span>
              <span className="text-sm text-gray-700 flex-1">{shot}</span>
              <select
                value={values[i]}
                onChange={e => setValue(i, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
              >
                {NEGATIVE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${totalLabel.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
              <p className="text-xs mt-0.5">{totalLabel.text} · Perfect: -3 · Worst: +6</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p>-3 = perfect</p>
              <p>0 = level par</p>
              <p>+6 = worst</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
          >
            Save Score ({grandTotal})
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function JuniorPuttingScorecardModal({ onSave, onCancel }) {
  const [values, setValues] = useState(JUNIOR_PUTTING_HOLES.map(() => ""));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? val : v));
  }

  const allFilled = values.every(v => v !== "" && !isNaN(parseInt(v)) && parseInt(v) >= 1);
  const grandTotal = values.reduce((sum, v) => sum + (parseInt(v) || 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🟢 Junior Putting Circuit</h2>
          <p className="text-green-300 text-sm mt-0.5">Enter number of putts to hole out at each distance — lower is better</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Putt each ball out until holed · Add up total putts across all 9 holes · Perfect: 12 · Worst: 24
        </div>
        <div className="px-4 py-4 space-y-2">
          {JUNIOR_PUTTING_HOLES.map((h, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-xs font-bold text-green-700 w-6 shrink-0">{h.hole}</span>
              <span className="text-sm text-gray-700 flex-1">{h.dist}</span>
              <input
                type="number"
                min="1"
                value={values[i]}
                onChange={e => setValue(i, e.target.value)}
                placeholder="putts"
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-green-500"
              />
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Putts</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal || "—"}</p>
              <p className="text-xs mt-0.5">lower is better</p>
            </div>
            <div className="text-right text-xs text-green-600">
              <p>Perfect: 12 putts</p>
              <p>Worst: 24 putts</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal} putts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function JuniorShortGameScorecardModal({ onSave, onCancel }) {
  const [values, setValues] = useState(JUNIOR_SHORT_GAME_HOLES.map(() => 0));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? Number(val) : v));
  }

  const grandTotal = values.reduce((a, b) => a + b, 0);
  const zone = grandTotal >= 20 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 12 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🏌️ Junior Short Game Circuit</h2>
          <p className="text-green-300 text-sm mt-0.5">Select your result for each hole — higher is better</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span>Holed = 4pts</span>
          <span>0–3ft = 3pts</span>
          <span>3–6ft = 2pts</span>
          <span>6–12ft = 1pt</span>
          <span>12ft+ = 0pts</span>
        </div>
        <div className="px-4 py-4 space-y-2">
          {JUNIOR_SHORT_GAME_HOLES.map((h, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-xs font-bold text-green-700 w-6 shrink-0">{h.hole}</span>
              <span className="text-sm text-gray-700 flex-1">{h.desc}</span>
              <select
                value={values[i]}
                onChange={e => setValue(i, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
              >
                {JUNIOR_SHORT_GAME_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
              <p className="text-xs mt-0.5">out of 36 possible pts</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              <p>Green 20+ · Yellow 12–19 · Red &lt;12</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
          >
            Save Score ({grandTotal} pts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SundayStandardScorecardModal({ onSave, onCancel }) {
  const [quadrant, setQuadrant] = useState(0);
  // scores[quadrant][section][putt] = 0 or 1
  const [scores, setScores] = useState(
    SUNDAY_STANDARD_QUADRANTS.map(() =>
      SUNDAY_STANDARD_SECTIONS.map(s => Array(s.putts).fill(0))
    )
  );

  function togglePutt(q, s, p) {
    setScores(prev => prev.map((qs, qi) =>
      qi === q ? qs.map((ss, si) =>
        si === s ? ss.map((v, pi) => pi === p ? (v === 1 ? 0 : 1) : v) : ss
      ) : qs
    ));
  }

  const quadrantTotals = scores.map(qs => qs.reduce((a, ss) => a + ss.reduce((x, v) => x + v, 0), 0));
  const grandTotal = quadrantTotals.reduce((a, b) => a + b, 0);
  const isLastQuadrant = quadrant === 3;
  const isReview = quadrant === 4;

  const zone = grandTotal >= 36 ? { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 24 ? { label: "Good", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Needs Work", color: "text-red-700 bg-red-50 border-red-200" };

  if (isReview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
          <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
            <h2 className="text-lg font-bold">📋 Sunday Showcase — Summary</h2>
            <p className="text-green-300 text-sm mt-0.5">48 Putt Performance Check</p>
          </div>
          <div className="px-4 py-4">
            <table className="w-full text-sm mb-4">
              <tbody>
                {SUNDAY_STANDARD_QUADRANTS.map((q, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-2 text-gray-700">{q}</td>
                    <td className="py-2 px-2 text-right font-semibold text-green-700">{quadrantTotals[i]} / 12</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Grand Total</p>
                <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
                <p className="text-xs mt-0.5">out of 48 putts</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{zone.label}</p>
                <p className="text-xs opacity-70 mt-0.5">36+ = Excellent · 24–35 = Good</p>
                <p className="text-xs opacity-70">Benchmark: 36</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-5 pb-5">
            <button
              onClick={() => onSave(grandTotal)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({grandTotal} / 48)
            </button>
            <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuadrantTotal = quadrantTotals[quadrant];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">📋 Sunday Showcase — 48 Putt PK</h2>
          <p className="text-green-300 text-sm mt-0.5">Quadrant {quadrant + 1} of 4 — {SUNDAY_STANDARD_QUADRANTS[quadrant]}</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800 flex justify-between">
          <span>Tap to toggle each putt — ✅ = success · ⬜ = miss</span>
          <span className="font-bold">Grand total: {grandTotal} / 48</span>
        </div>
        <div className="px-4 py-4 space-y-4">
          {SUNDAY_STANDARD_SECTIONS.map((section, si) => (
            <div key={si}>
              <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-0.5">{section.label}</div>
              <div className="text-xs text-gray-400 mb-2">{section.desc}</div>
              <div className="flex gap-2 flex-wrap">
                {scores[quadrant][si].map((val, pi) => (
                  <button
                    key={pi}
                    type="button"
                    onClick={() => togglePutt(quadrant, si, pi)}
                    className={`w-12 h-12 rounded-lg border-2 text-xl font-bold transition-colors ${val === 1 ? "bg-green-500 border-green-600 text-white" : "bg-gray-100 border-gray-300 text-gray-300"}`}
                  >
                    {val === 1 ? "✅" : "⬜"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className="flex gap-3">
            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-green-600 font-medium">This quadrant</p>
              <p className="text-2xl font-extrabold text-green-700">{currentQuadrantTotal} / 12</p>
            </div>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-gray-500 font-medium">Grand total</p>
              <p className="text-2xl font-extrabold text-gray-700">{grandTotal} / 48</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => setQuadrant(q => q - 1)}
            disabled={quadrant === 0}
            className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={() => setQuadrant(q => q + 1)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
          >
            {isLastQuadrant ? "Review Score →" : `Next — ${SUNDAY_STANDARD_QUADRANTS[quadrant + 1]} →`}
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SwedishQuickFireScorecardModal({ onSave, onCancel }) {
  const [values, setValues] = useState(SWEDISH_ROWS.map(() => 0));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? Number(val) : v));
  }

  const grandTotal = values.reduce((a, b) => a + b, 0);
  const zone = grandTotal >= 13 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 8 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🇸🇪 Swedish National Quick Fire</h2>
          <p className="text-green-300 text-sm mt-0.5">1 shot from each category — select your result</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span>Holed = 4pts</span>
          <span>0–3ft = 3pts</span>
          <span>3–6ft = 2pts</span>
          <span>6–9ft = 1pt</span>
          <span>9ft+ = 0pts</span>
        </div>
        <div className="px-4 py-4 space-y-2">
          {SWEDISH_ROWS.map((row, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-sm text-gray-700 flex-1">{row}</span>
              <select
                value={values[i]}
                onChange={e => setValue(i, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
              >
                {SWEDISH_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              <p>Green 13+ · Yellow 8–12 · Red &lt;8</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
          >
            Save Score ({grandTotal} pts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PelzSnapshotScorecardModal({ onSave, onCancel }) {
  const [values, setValues] = useState(PELZ_CATEGORIES.map(() => 0));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? Number(val) : v));
  }

  const grandTotal = values.reduce((a, b) => a + b, 0);
  const zone = grandTotal >= 12 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 6 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🏌️ Pelz Snapshot</h2>
          <p className="text-green-300 text-sm mt-0.5">1 shot from each category — select your result</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span>Holed = 4pts</span>
          <span>0–3ft = 2pts</span>
          <span>3–6ft = 1pt</span>
          <span>6ft+ = 0pts</span>
        </div>
        <div className="px-4 py-4 space-y-2">
          {PELZ_CATEGORIES.map((cat, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-sm text-gray-700 flex-1">{cat}</span>
              <select
                value={values[i]}
                onChange={e => setValue(i, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
              >
                {PELZ_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              <p>Green 12+ · Yellow 6–11 · Red &lt;6</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
          >
            Save Score ({grandTotal} pts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function BroadieChaseModal({ drillId, drill, onSave, onCancel }) {
  const configs = {
    70: { dist: "5ft",  target: 15, cap: 16 },
    71: { dist: "10ft", target: 10, cap: 26 },
    72: { dist: "15ft", target: 5,  cap: 26 },
  };
  const config = configs[drillId];
  const [putts, setPutts] = useState([]);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);

  const runningPoints = putts.reduce((a, b) => a + b, 0);
  const totalPutts = putts.length;

  function addPutt(val) {
    const newVal = Number(val);
    const newPutts = [...putts, newVal];
    const newPoints = newPutts.reduce((a, b) => a + b, 0);
    setPutts(newPutts);
    if (newPoints >= config.target) {
      setFinished(true);
    } else if (newPutts.length >= config.cap) {
      setCapReached(true);
      setFinished(true);
    }
  }

  const nextPuttNum = totalPutts + 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🏌️ Broadie Chase — {config.dist}</h2>
          <p className="text-green-300 text-sm mt-0.5">Reach {config.target} points — count total putts taken</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex justify-between text-xs font-medium text-green-800">
          <span>Holed = 2pts · 2-putt = 0pts · Short 2-putt = -1pt · 3-putt = -3pts</span>
        </div>

        <div className="px-4 py-4">
          {/* Running log */}
          {putts.length > 0 && (
            <div className="space-y-1 mb-4 max-h-48 overflow-y-auto">
              {putts.map((v, i) => {
                const opt = BROADIE_OPTIONS.find(o => o.value === v);
                return (
                  <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <span className="text-xs font-bold text-green-700 w-16 shrink-0">Putt {i + 1} — {config.dist}</span>
                    <span className="flex-1 text-gray-600 text-xs">{opt?.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Next putt input or finished message */}
          {!finished ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">Putt {nextPuttNum} — {config.dist}</p>
              <div className="flex flex-col gap-2">
                {BROADIE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => addPutt(opt.value)}
                    className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-green-50 hover:border-green-400 text-sm transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border px-4 py-4 text-center ${capReached ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <p className="text-lg font-bold mb-1">
                {capReached ? "Maximum putts reached!" : "Target reached! 🎉"}
              </p>
              <p className="text-xs opacity-70 mb-2">
                {capReached ? `You hit the ${config.cap} putt cap` : `You reached ${config.target} points`}
              </p>
              <p className="text-4xl font-extrabold">{totalPutts}</p>
              <p className="text-sm mt-1">total putts · {runningPoints} pts</p>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="px-5 pb-4 flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Putts taken</p>
            <p className="text-2xl font-extrabold text-gray-700">{totalPutts}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Points</p>
            <p className={`text-2xl font-extrabold ${runningPoints >= 0 ? "text-green-700" : "text-red-600"}`}>{runningPoints}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Target</p>
            <p className="text-2xl font-extrabold text-gray-700">{config.target}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(totalPutts)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({totalPutts} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PointsRaceScorecardModal({ drill, onSave, onCancel }) {
  const TARGET = 15;
  const CAP = 40;
  const DISTANCES = ["4m", "5m", "6m"];
  const [putts, setPutts] = useState([]);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);

  const runningPoints = putts.reduce((a, b) => a + b, 0);
  const totalPutts = putts.length;
  const currentDist = DISTANCES[totalPutts % 3];

  function addPutt(val) {
    const newVal = Number(val);
    const newPutts = [...putts, newVal];
    const newPoints = newPutts.reduce((a, b) => a + b, 0);
    setPutts(newPutts);
    if (newPoints >= TARGET) {
      setFinished(true);
    } else if (newPutts.length >= CAP) {
      setCapReached(true);
      setFinished(true);
    }
  }

  const nextPuttNum = totalPutts + 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🎯 4-5-6m Points Race</h2>
          <p className="text-green-300 text-sm mt-0.5">Reach {TARGET} points — count total putts taken</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          <span>Holed = 3pts · 0–3ft past = 0pts · Short or 3-putt = -3pts</span>
        </div>

        <div className="px-4 py-4">
          {putts.length > 0 && (
            <div className="space-y-1 mb-4 max-h-48 overflow-y-auto">
              {putts.map((v, i) => {
                const dist = DISTANCES[i % 3];
                const opt = POINTS_RACE_OPTIONS.find(o => o.value === v);
                return (
                  <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <span className="text-xs font-bold text-green-700 w-16 shrink-0">Putt {i + 1} — {dist}</span>
                    <span className="flex-1 text-gray-600 text-xs">{opt?.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {!finished ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">Putt {nextPuttNum} — {currentDist}</p>
              <div className="flex flex-col gap-2">
                {POINTS_RACE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => addPutt(opt.value)}
                    className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-green-50 hover:border-green-400 text-sm transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border px-4 py-4 text-center ${capReached ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <p className="text-lg font-bold mb-1">
                {capReached ? "Maximum putts reached!" : "Target reached! 🎉"}
              </p>
              <p className="text-xs opacity-70 mb-2">
                {capReached ? `You hit the ${CAP} putt cap` : `You reached ${TARGET} points`}
              </p>
              <p className="text-4xl font-extrabold">{totalPutts}</p>
              <p className="text-sm mt-1">total putts · {runningPoints} pts</p>
            </div>
          )}
        </div>

        <div className="px-5 pb-4 flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Putts taken</p>
            <p className="text-2xl font-extrabold text-gray-700">{totalPutts}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Points</p>
            <p className={`text-2xl font-extrabold ${runningPoints >= 0 ? "text-green-700" : "text-red-600"}`}>{runningPoints}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Target</p>
            <p className="text-2xl font-extrabold text-gray-700">{TARGET}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(totalPutts)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({totalPutts} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function BroadieTestModal({ drillId, drill, onSave, onCancel }) {
  const configs = {
    73: { dist: "5ft",  putts: 10 },
    74: { dist: "10ft", putts: 10 },
    75: { dist: "15ft", putts: 10 },
  };
  const config = configs[drillId];
  const [values, setValues] = useState(Array(config.putts).fill(null));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? Number(val) : v));
  }

  const allFilled = values.every(v => v !== null);
  const grandTotal = values.reduce((a, b) => a + (b ?? 0), 0);
  const zone = grandTotal >= (drillId === 73 ? 16 : drillId === 74 ? 8 : 4)
    ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= (drillId === 73 ? 10 : drillId === 74 ? 4 : 2)
    ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🏌️ Broadie Test — {config.dist}</h2>
          <p className="text-green-300 text-sm mt-0.5">10 putts from {config.dist} — select result for each</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-green-800">
          <span>Holed = 2pts</span>
          <span>2-putt = 0pts</span>
          <span>Short 2-putt = -1pt</span>
          <span>3-putt = -3pts</span>
        </div>
        <div className="px-4 py-4 space-y-2">
          {values.map((val, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-xs font-bold text-green-700 w-16 shrink-0">Putt {i + 1} — {config.dist}</span>
              <select
                value={val ?? ""}
                onChange={e => setValue(i, e.target.value)}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-green-500"
              >
                <option value="" disabled>Select...</option>
                {BROADIE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Score</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}</p>
              <p className="text-xs mt-0.5">from 10 putts</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              {drill && <p>Perfect: {drill.perfect} pts · Worst: {drill.worst} pts</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal} pts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function LukeDonaldScorecardModal({ onSave, onCancel }) {
  const HOLES = 4;
  const DISTANCES = ["4ft", "5ft", "6ft", "7ft", "8ft"];
  const [values, setValues] = useState(
    Array(HOLES).fill(null).map(() => Array(DISTANCES.length).fill(null))
  );

  function togglePutt(hole, dist, val) {
    setValues(prev => prev.map((h, hi) =>
      hi === hole ? h.map((v, di) => di === dist ? val : v) : h
    ));
  }

  const allFilled = values.every(h => h.every(v => v !== null));
  const grandTotal = values.reduce((a, h) => a + h.reduce((x, v) => x + (v ?? 0), 0), 0);
  const zone = grandTotal >= 17 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 10 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🎯 Luke Donald Make Zone Test</h2>
          <p className="text-green-300 text-sm mt-0.5">4 holes × 5 distances — tap to mark holed</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Tap each putt — ✅ Holed · ❌ Missed · Tour average: 15/20
        </div>
        <div className="px-4 py-4 space-y-4">
          {Array(HOLES).fill(null).map((_, hi) => (
            <div key={hi} className={`rounded-xl p-3 ${hi % 2 === 0 ? "bg-gray-50" : "bg-white border border-gray-100"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-700">Hole {hi + 1}</span>
                <span className="text-xs text-gray-500">{values[hi].filter(v => v === 1).length} / {DISTANCES.length} holed</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {DISTANCES.map((dist, di) => {
                  const val = values[hi][di];
                  return (
                    <div key={di} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-400">{dist}</span>
                      <button
                        type="button"
                        onClick={() => togglePutt(hi, di, val === 1 ? 0 : val === 0 ? null : 1)}
                        className={`w-12 h-12 rounded-lg border-2 text-lg font-bold transition-colors ${val === 1 ? "bg-green-500 border-green-600 text-white" : val === 0 ? "bg-red-100 border-red-300 text-red-400" : "bg-gray-100 border-gray-300 text-gray-300"}`}
                      >
                        {val === 1 ? "✅" : val === 0 ? "❌" : "·"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Holed</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal} / 20</p>
              <p className="text-xs mt-0.5">Tour average: 15</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              <p>Green 17+ · Yellow 10–16 · Red &lt;10</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal} / 20)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function GauntletScorecardModal({ onSave, onCancel }) {
  const PUTTS = [
    ...Array(9).fill("3ft"),
    ...Array(4).fill("6ft"),
    ...Array(3).fill("9ft"),
    "10ft", "12ft",
  ];
  const [values, setValues] = useState(Array(18).fill(null));

  function togglePutt(idx) {
    setValues(prev => prev.map((v, i) => i === idx ? (v === 1 ? 0 : v === 0 ? null : 1) : v));
  }

  const allFilled = values.every(v => v !== null);
  const grandTotal = values.reduce((a, v) => a + (v ?? 0), 0);
  const zone = grandTotal >= 14 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 9 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🎯 100ft Gauntlet</h2>
          <p className="text-green-300 text-sm mt-0.5">18 putts — tap to mark holed or missed</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          9×3ft · 4×6ft · 3×9ft · 1×10ft · 1×12ft — tap to toggle ✅ Holed · ❌ Missed
        </div>
        <div className="px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {PUTTS.map((dist, i) => {
              const val = values[i];
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{dist}</span>
                  <button
                    type="button"
                    onClick={() => togglePutt(i)}
                    className={`w-12 h-12 rounded-lg border-2 text-lg transition-colors ${val === 1 ? "bg-green-500 border-green-600 text-white" : val === 0 ? "bg-red-100 border-red-300 text-red-400" : "bg-gray-100 border-gray-300 text-gray-300"}`}
                  >
                    {val === 1 ? "✅" : val === 0 ? "❌" : "·"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Holed</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal} / 18</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              <p>Green 14+ · Yellow 9–13 · Red &lt;9</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal} / 18)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Challenge250ScorecardModal({ onSave, onCancel }) {
  const DISTANCES = ["5ft", "10ft", "15ft", "20ft"];
  const HOLES = 5;
  const [values, setValues] = useState(
    Array(HOLES).fill(null).map(() => Array(DISTANCES.length).fill(null))
  );

  function togglePutt(hole, dist) {
    setValues(prev => prev.map((h, hi) =>
      hi === hole ? h.map((v, di) => di === dist ? (v === 1 ? 0 : v === 0 ? null : 1) : v) : h
    ));
  }

  const allFilled = values.every(h => h.every(v => v !== null));
  const feetValues = [5, 10, 15, 20];
  const grandTotal = values.reduce((a, h) =>
    a + h.reduce((x, v, di) => x + (v === 1 ? feetValues[di] : 0), 0), 0
  );
  const zone = grandTotal >= 130 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal >= 75 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">📏 250ft Challenge</h2>
          <p className="text-green-300 text-sm mt-0.5">5 holes × 4 distances — tap to mark holed</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Score = total feet of holed putts · 100ft = average · 130ft = excellent · 250ft = near impossible
        </div>
        <div className="px-4 py-4 space-y-4">
          {Array(HOLES).fill(null).map((_, hi) => (
            <div key={hi} className={`rounded-xl p-3 ${hi % 2 === 0 ? "bg-gray-50" : "bg-white border border-gray-100"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-700">Hole {hi + 1}</span>
                <span className="text-xs text-gray-500">
                  {values[hi].reduce((a, v, di) => a + (v === 1 ? feetValues[di] : 0), 0)}ft holed
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {DISTANCES.map((dist, di) => {
                  const val = values[hi][di];
                  return (
                    <div key={di} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-400">{dist}</span>
                      <button
                        type="button"
                        onClick={() => togglePutt(hi, di)}
                        className={`w-12 h-12 rounded-lg border-2 text-lg transition-colors ${val === 1 ? "bg-green-500 border-green-600 text-white" : val === 0 ? "bg-red-100 border-red-300 text-red-400" : "bg-gray-100 border-gray-300 text-gray-300"}`}
                      >
                        {val === 1 ? "✅" : val === 0 ? "❌" : "·"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Feet Holed</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal}ft</p>
              <p className="text-xs mt-0.5">100ft = average · 130ft = excellent</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              <p>Green 130+ · Yellow 75–129 · Red &lt;75</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal}ft)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SuddenDeathCarouselModal({ onSave, onCancel }) {
  const ROWS = ["Str Up", "R-L Up", "R-L", "R-L Dn", "Str Dn", "L-R Dn", "L-R", "L-R Up"];
  const COLS = [4, 5, 6, 7, 8, 9, 10];
  // state[row][col]: null = locked, "active" = playable, "holed" = ✅, "missed" = ❌
  const initState = () => ROWS.map(() => COLS.map((_, ci) => ci === 0 ? "active" : null));
  const [grid, setGrid] = useState(initState);

  function tap(ri, ci) {
    setGrid(prev => prev.map((row, r) => {
      if (r !== ri) return row;
      const cell = row[ci];
      if (cell === "active") {
        // Mark holed, unlock next
        return row.map((v, c) => c === ci ? "holed" : c === ci + 1 ? "active" : v);
      }
      if (cell === "holed") {
        // Mark missed, lock rest of row
        return row.map((v, c) => c === ci ? "missed" : c > ci ? null : v);
      }
      if (cell === "missed") {
        // Undo miss: reopen from this cell
        return row.map((v, c) => c === ci ? "active" : c > ci ? null : v);
      }
      return row;
    }));
  }

  const totalHoled = grid.reduce((a, row) => a + row.filter(v => v === "holed").length, 0);
  const hasMiss = grid.some(row => row.includes("missed"));
  const saveEnabled = hasMiss;

  const zone = totalHoled >= 26 ? { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" }
    : totalHoled >= 16 ? { label: "Good", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Needs Work", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🎯 Sudden Death Carousel (4–10ft)</h2>
          <p className="text-green-300 text-sm mt-0.5">Tap to advance each row — score = total putts holed</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800 flex justify-between">
          <span>✅ = Holed · ❌ = Missed (row ends) · Tap ❌ to undo</span>
          <span className="font-bold">Holed: {totalHoled}</span>
        </div>
        <div className="px-4 py-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left pr-2 pb-1 text-gray-500 font-medium w-16"></th>
                {COLS.map(c => (
                  <th key={c} className="text-center pb-1 text-gray-500 font-medium w-10">{c}ft</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((label, ri) => (
                <tr key={ri}>
                  <td className="pr-2 py-1 text-xs font-semibold text-green-700 whitespace-nowrap">{label}</td>
                  {COLS.map((_, ci) => {
                    const cell = grid[ri][ci];
                    return (
                      <td key={ci} className="py-1 text-center">
                        <button
                          type="button"
                          onClick={() => (cell === "active" || cell === "holed" || cell === "missed") && tap(ri, ci)}
                          className={`w-9 h-9 rounded-lg border-2 text-sm font-bold transition-colors ${
                            cell === "holed" ? "bg-green-500 border-green-600 text-white" :
                            cell === "missed" ? "bg-red-100 border-red-300 text-red-500" :
                            cell === "active" ? "bg-white border-green-400 text-green-400 hover:bg-green-50" :
                            "bg-gray-50 border-gray-200 text-gray-200 cursor-default"
                          }`}
                        >
                          {cell === "holed" ? "✅" : cell === "missed" ? "❌" : cell === "active" ? "·" : ""}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Holed</p>
              <p className="text-4xl font-extrabold leading-none">{totalHoled}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              <p>Green 26+ · Yellow 16–25 · Red &lt;16</p>
              <p>32 = excellent</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(totalHoled)}
            disabled={!saveEnabled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({totalHoled} holed)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function DrawbackGauntletModal({ drillId, drill, onSave, onCancel }) {
  const configs = {
    36: { title: "Drawback Gauntlet 5–15ft",  perfect: 9,  worst: 27, greenMax: 13, yellowMax: 20, label: "Goal: 13 putts or less" },
    68: { title: "Drawback Gauntlet 15–30ft", perfect: 16, worst: 36, greenMax: 22, yellowMax: 29, label: "Goal: 18 putts or less" },
  };
  const config = configs[drillId];
  const [values, setValues] = useState(Array(9).fill(""));

  function setValue(idx, val) {
    setValues(prev => prev.map((v, i) => i === idx ? val : v));
  }

  const allFilled = values.every(v => v !== "" && !isNaN(parseInt(v)) && parseInt(v) >= 1);
  const grandTotal = values.reduce((sum, v) => sum + (parseInt(v) || 0), 0);

  const zone = allFilled
    ? grandTotal <= config.greenMax ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : grandTotal <= config.yellowMax ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" }
    : { label: "—", color: "text-gray-500 bg-gray-50 border-gray-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🔄 {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">Enter putts taken per hole — {config.label}</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          First putt misses = draw back 1 putter length · No tap ins · Putt out each hole
        </div>
        <div className="px-4 py-4 space-y-2">
          {values.map((val, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
              <span className="text-xs font-bold text-green-700 w-12 shrink-0">Hole {i + 1}</span>
              <div className="flex-1 text-xs text-gray-400">putts to hole out</div>
              <input
                type="number"
                min="1"
                value={val}
                onChange={e => setValue(i, e.target.value)}
                placeholder="—"
                className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-green-500"
              />
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.color}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total Putts</p>
              <p className="text-4xl font-extrabold leading-none">{grandTotal || "—"}</p>
              <p className="text-xs mt-0.5">lower is better</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{zone.label}</p>
              {drillId === 36
                ? <p>Green ≤13 · Yellow 14–20 · Red 21+</p>
                : <p>Green ≤22 · Yellow 23–29 · Red 30+</p>
              }
              {drill && <p className="text-xs opacity-70 mt-0.5">Perfect: {drill.perfect} putts · Worst: {drill.worst} putts</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(grandTotal)}
            disabled={!allFilled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({grandTotal} putts)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function JaggedPeaksModal({ onSave, onCancel }) {
  const CAP = 60;
  const TRANSITIONS = {
    3:  { make: 7,  miss: 3  },
    7:  { make: 4,  miss: 3  },
    4:  { make: 8,  miss: 7  },
    8:  { make: 5,  miss: 4  },
    5:  { make: 9,  miss: 8  },
    9:  { make: 6,  miss: 5  },
    6:  { make: 10, miss: 9  },
    10: { make: null, miss: 6 },
  };

  const [current, setCurrent] = useState(3);
  const [putts, setPutts] = useState([]);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);

  const totalPutts = putts.length;
  const t = TRANSITIONS[current];

  function recordPutt(made) {
    const next = made ? t.make : t.miss;
    const newPutts = [...putts, { dist: current, made }];
    setPutts(newPutts);
    if (made && t.make === null) {
      setFinished(true);
    } else if (newPutts.length >= CAP) {
      setCapReached(true);
      setFinished(true);
    } else {
      setCurrent(next);
    }
  }

  const zone = totalPutts <= 20 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : totalPutts <= 40 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">⛰️ Jagged Peaks</h2>
          <p className="text-green-300 text-sm mt-0.5">Hole the 10ft putt to complete · 60 putt cap</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800 flex justify-between">
          <span>Make → advance · Miss → step back · 3ft is the floor</span>
          <span className="font-bold">Putts: {totalPutts} / {CAP}</span>
        </div>

        <div className="px-4 py-4">
          {!finished ? (
            <>
              <div className="text-center mb-4 py-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Current Distance</p>
                <p className="text-5xl font-extrabold text-green-700">{current}ft</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => recordPutt(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700"
                >
                  ✅ Holed → {t.make === null ? "Finish" : `${t.make}ft`}
                </button>
                <button
                  type="button"
                  onClick={() => recordPutt(false)}
                  className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-semibold text-sm hover:bg-red-200 border border-red-200"
                >
                  ❌ Missed → {t.miss}ft
                </button>
              </div>
            </>
          ) : (
            <div className={`rounded-xl border px-4 py-4 text-center mb-4 ${capReached ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <p className="text-lg font-bold mb-1">{capReached ? "Cap reached!" : "Complete! 🎉"}</p>
              <p className="text-4xl font-extrabold">{totalPutts}</p>
              <p className="text-sm mt-1">total putts</p>
            </div>
          )}

          {putts.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto space-y-1">
              {[...putts].reverse().map((p, i) => (
                <div key={i} className={`flex gap-3 rounded px-3 py-1 text-xs ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <span className="font-bold text-green-700 w-14 shrink-0">Putt {putts.length - i} — {p.dist}ft</span>
                  <span className={p.made ? "text-green-600" : "text-red-500"}>{p.made ? "✅ Holed" : "❌ Missed"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 pb-4 flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Putts taken</p>
            <p className="text-2xl font-extrabold text-gray-700">{totalPutts}</p>
          </div>
          {finished && (
            <div className={`flex-1 rounded-lg border px-3 py-2 text-center ${zone.color}`}>
              <p className="text-xs font-medium opacity-70">Zone</p>
              <p className="text-sm font-bold">{zone.label}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(totalPutts)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({totalPutts} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AscentModal({ onSave, onCancel }) {
  const DISTANCES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  // state: null = locked, "active" = playable, "holed" = ✅, "missed" = ❌
  const initState = () => DISTANCES.map((_, i) => i === 0 ? "active" : null);
  const [cells, setCells] = useState(initState);

  function tap(idx) {
    const cell = cells[idx];
    if (cell === "active") {
      // Mark holed, unlock next
      setCells(prev => prev.map((v, i) => i === idx ? "holed" : i === idx + 1 ? "active" : v));
    } else if (cell === "holed") {
      // Mark missed, lock rest
      setCells(prev => prev.map((v, i) => i === idx ? "missed" : i > idx ? null : v));
    } else if (cell === "missed") {
      // Undo: reopen from this cell
      setCells(prev => prev.map((v, i) => i === idx ? "active" : i > idx ? null : v));
    }
  }

  const lastHoledIdx = cells.reduce((last, v, i) => v === "holed" ? i : last, -1);
  const lastHoledDist = lastHoledIdx >= 0 ? DISTANCES[lastHoledIdx] : 0;
  const hasMissOrComplete = cells.includes("missed") || cells[DISTANCES.length - 1] === "holed";
  const saveEnabled = lastHoledIdx >= 0;

  const zone = lastHoledDist >= 12 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : lastHoledDist >= 8 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🧗 The Ascent</h2>
          <p className="text-green-300 text-sm mt-0.5">Straight putt, moving back 1ft — tap to advance</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Tap active cell to hole it · Tap ✅ to mark missed · Tap ❌ to undo · Score = last holed distance
        </div>
        <div className="px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {DISTANCES.map((dist, i) => {
              const cell = cells[i];
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{dist}ft</span>
                  <button
                    type="button"
                    onClick={() => (cell === "active" || cell === "holed" || cell === "missed") && tap(i)}
                    className={`w-11 h-11 rounded-lg border-2 text-sm font-bold transition-colors ${
                      cell === "holed" ? "bg-green-500 border-green-600 text-white" :
                      cell === "missed" ? "bg-red-100 border-red-300 text-red-500" :
                      cell === "active" ? "bg-white border-green-400 text-green-400 hover:bg-green-50" :
                      "bg-gray-50 border-gray-200 text-gray-200 cursor-default"
                    }`}
                  >
                    {cell === "holed" ? "✅" : cell === "missed" ? "❌" : cell === "active" ? "·" : ""}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${saveEnabled ? zone.color : "text-gray-500 bg-gray-50 border-gray-200"}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Last Holed</p>
              <p className="text-4xl font-extrabold leading-none">{lastHoledDist > 0 ? `${lastHoledDist}ft` : "—"}</p>
            </div>
            <div className="text-right text-xs opacity-70">
              <p className="font-bold text-sm">{saveEnabled ? zone.label : "—"}</p>
              <p>Green 12ft+ · Yellow 8–11ft · Red &lt;8ft</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={() => onSave(lastHoledDist)}
            disabled={!saveEnabled}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Score ({lastHoledDist}ft)
          </button>
          <button onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AnchorModal({ onSave, onCancel }) {
  const CAP = 40;
  const [teeDistances, setTeeDistances] = useState([3, 3, 3, 3, 3]);
  const [activeTee, setActiveTee] = useState(0);
  const [puttCount, setPuttCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);
  const [log, setLog] = useState([]);

  function recordPutt(made) {
    const prevDist = teeDistances[activeTee];
    const newDist = made ? prevDist + 1 : prevDist - 1;
    const newDistances = teeDistances.map((d, i) => i === activeTee ? newDist : d);
    const newPuttCount = puttCount + 1;
    const newLog = [{ tee: activeTee + 1, dist: prevDist, made, newDist }, ...log];
    const nextTee = (activeTee + 1) % 5;

    setTeeDistances(newDistances);
    setPuttCount(newPuttCount);
    setLog(newLog);
    setActiveTee(nextTee);

    if (made && newDistances.every(d => d >= 5)) {
      setFinished(true);
    } else if (newPuttCount >= CAP) {
      setCapReached(true);
      setFinished(true);
    }
  }

  const teesAt5 = teeDistances.filter(d => d >= 5).length;
  const activeDist = teeDistances[activeTee];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">⚓ Crucible — The Anchor (3–5ft)</h2>
          <p className="text-green-300 text-sm mt-0.5">All 5 tees must reach 5ft to complete the drill</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Make → tee advances 1ft · Miss → tee moves back 1ft · No floor · Drill ends when all 5 tees reach 5ft
        </div>

        {/* Tee cards */}
        <div className="px-4 pt-4 flex gap-2">
          {teeDistances.map((dist, i) => {
            const isActive = i === activeTee && !finished;
            const isDone = dist >= 5;
            return (
              <div
                key={i}
                className={`flex-1 rounded-xl p-2 text-center border-2 transition-colors ${
                  isDone ? "bg-green-100 border-green-400" :
                  isActive ? "bg-white border-amber-400" :
                  "bg-white border-gray-200"
                }`}
              >
                <p className="text-xs font-semibold text-gray-500 mb-1">Tee {i + 1}</p>
                <p className={`text-xl font-extrabold ${isDone ? "text-green-700" : isActive ? "text-amber-600" : "text-gray-700"}`}>
                  {dist}ft
                </p>
                {isDone && <span className="text-sm">✅</span>}
              </div>
            );
          })}
        </div>

        {/* Active tee panel or completion */}
        <div className="px-4 py-4">
          {!finished ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-3">
                Tee {activeTee + 1} — {activeDist}ft
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => recordPutt(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700"
                >
                  ✅ Holed — advance to {activeDist + 1}ft
                </button>
                <button
                  type="button"
                  onClick={() => recordPutt(false)}
                  className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-semibold text-sm hover:bg-red-200 border border-red-200"
                >
                  ❌ Missed — back to {activeDist - 1}ft
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border px-4 py-4 text-center ${capReached ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <p className="text-lg font-bold mb-1">{capReached ? "Cap reached" : "Drill Complete! 🎉"}</p>
              <p className="text-4xl font-extrabold">{puttCount}</p>
              <p className="text-sm mt-1">total putts</p>
            </div>
          )}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="px-4 pb-2 max-h-36 overflow-y-auto space-y-1">
            {log.map((entry, i) => (
              <div key={i} className={`flex gap-3 rounded px-3 py-1 text-xs ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <span className="font-bold text-green-700 w-24 shrink-0">Putt {puttCount - i} — Tee {entry.tee} {entry.dist}ft</span>
                <span className={entry.made ? "text-green-600" : "text-red-500"}>
                  {entry.made ? `✅ Holed → ${entry.newDist}ft` : `❌ Missed → ${entry.newDist}ft`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Stats bar */}
        <div className="px-4 pb-4 flex gap-3 mt-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Putts taken</p>
            <p className="text-2xl font-extrabold text-gray-700">{puttCount}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Cap</p>
            <p className="text-2xl font-extrabold text-gray-700">{CAP}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Tees at 5ft+</p>
            <p className="text-2xl font-extrabold text-green-700">{teesAt5}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(puttCount)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({puttCount} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function CrucibleModal({ config, onSave, onCancel }) {
  const [teeDistances, setTeeDistances] = useState(Array(5).fill(config.startDist));
  const [activeTee, setActiveTee] = useState(0);
  const [puttCount, setPuttCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);
  const [log, setLog] = useState([]);

  function recordPutt(made) {
    const prevDist = teeDistances[activeTee];
    const newDist = made ? prevDist + 1 : prevDist - 1;
    const newDistances = teeDistances.map((d, i) => i === activeTee ? newDist : d);
    const newPuttCount = puttCount + 1;
    const newLog = [{ tee: activeTee + 1, dist: prevDist, made, newDist }, ...log];
    const nextTee = (activeTee + 1) % 5;

    setTeeDistances(newDistances);
    setPuttCount(newPuttCount);
    setLog(newLog);
    setActiveTee(nextTee);

    if (made && newDistances.every(d => d >= config.finishDist)) {
      setFinished(true);
    } else if (newPuttCount >= config.cap) {
      setCapReached(true);
      setFinished(true);
    }
  }

  const teesAtFinish = teeDistances.filter(d => d >= config.finishDist).length;
  const activeDist = teeDistances[activeTee];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">All 5 tees must reach {config.finishDist}ft to complete the drill</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Make → tee advances 1ft · Miss → tee moves back 1ft · No floor · Drill ends when all 5 tees reach {config.finishDist}ft
        </div>

        {/* Tee cards */}
        <div className="px-4 pt-4 flex gap-2">
          {teeDistances.map((dist, i) => {
            const isActive = i === activeTee && !finished;
            const isDone = dist >= config.finishDist;
            return (
              <div
                key={i}
                className={`flex-1 rounded-xl p-2 text-center border-2 transition-colors ${
                  isDone ? "bg-green-100 border-green-400" :
                  isActive ? "bg-white border-amber-400" :
                  "bg-white border-gray-200"
                }`}
              >
                <p className="text-xs font-semibold text-gray-500 mb-1">Tee {i + 1}</p>
                <p className={`text-xl font-extrabold ${isDone ? "text-green-700" : isActive ? "text-amber-600" : "text-gray-700"}`}>
                  {dist}ft
                </p>
                {isDone && <span className="text-sm">✅</span>}
              </div>
            );
          })}
        </div>

        {/* Active tee panel or completion */}
        <div className="px-4 py-4">
          {!finished ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-3">
                Tee {activeTee + 1} — {activeDist}ft
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => recordPutt(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700"
                >
                  ✅ Holed — advance to {activeDist + 1}ft
                </button>
                <button
                  type="button"
                  onClick={() => recordPutt(false)}
                  className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-semibold text-sm hover:bg-red-200 border border-red-200"
                >
                  ❌ Missed — back to {activeDist - 1}ft
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border px-4 py-4 text-center ${capReached ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <p className="text-lg font-bold mb-1">{capReached ? "Cap reached" : "Drill Complete! 🎉"}</p>
              <p className="text-4xl font-extrabold">{puttCount}</p>
              <p className="text-sm mt-1">total putts</p>
            </div>
          )}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="px-4 pb-2 max-h-36 overflow-y-auto space-y-1">
            {log.map((entry, i) => (
              <div key={i} className={`flex gap-3 rounded px-3 py-1 text-xs ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <span className="font-bold text-green-700 w-24 shrink-0">Putt {puttCount - i} — Tee {entry.tee} {entry.dist}ft</span>
                <span className={entry.made ? "text-green-600" : "text-red-500"}>
                  {entry.made ? `✅ Holed → ${entry.newDist}ft` : `❌ Missed → ${entry.newDist}ft`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Stats bar */}
        <div className="px-4 pb-4 flex gap-3 mt-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Putts taken</p>
            <p className="text-2xl font-extrabold text-gray-700">{puttCount}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Cap</p>
            <p className="text-2xl font-extrabold text-gray-700">{config.cap}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Tees at {config.finishDist}ft+</p>
            <p className="text-2xl font-extrabold text-green-700">{teesAtFinish}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(puttCount)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({puttCount} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SniperSchoolModal({ onSave, onCancel }) {
  const START_DIST = 7;
  const RETIRE_DIST = 10;
  const CAP = 130;

  const [teeDistances, setTeeDistances] = useState(Array(5).fill(START_DIST));
  const [teeRetired, setTeeRetired] = useState(Array(5).fill(false));
  const [activeTee, setActiveTee] = useState(0);
  const [puttCount, setPuttCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [capReached, setCapReached] = useState(false);
  const [log, setLog] = useState([]);

  function findNextActive(currentTee, retired) {
    for (let i = 1; i <= 5; i++) {
      const next = (currentTee + i) % 5;
      if (!retired[next]) return next;
    }
    return currentTee;
  }

  function recordPutt(made) {
    const prevDist = teeDistances[activeTee];
    const retiring = made && prevDist === RETIRE_DIST;
    const newDist = retiring ? prevDist : made ? prevDist + 1 : prevDist - 1;
    const newDistances = teeDistances.map((d, i) => i === activeTee ? newDist : d);
    const newRetired = teeRetired.map((r, i) => i === activeTee ? (r || retiring) : r);
    const newPuttCount = puttCount + 1;
    const newLog = [{ tee: activeTee + 1, dist: prevDist, made, retired: retiring }, ...log];

    setTeeDistances(newDistances);
    setTeeRetired(newRetired);
    setPuttCount(newPuttCount);
    setLog(newLog);

    if (newRetired.every(r => r)) {
      setFinished(true);
    } else if (newPuttCount >= CAP) {
      setCapReached(true);
      setFinished(true);
    } else {
      setActiveTee(findNextActive(activeTee, newRetired));
    }
  }

  const retiredCount = teeRetired.filter(r => r).length;
  const activeDist = teeDistances[activeTee];
  const atRetireDist = activeDist === RETIRE_DIST;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">🎯 Crucible — Sniper School (7–10ft)</h2>
          <p className="text-green-300 text-sm mt-0.5">Hole each tee from 10ft to retire it — all 5 must be retired to finish</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Make → advance 1ft · Hole from 10ft → tee retired ✅ · Miss → back 1ft · No floor · Cap: 130 putts
        </div>

        {/* Tee cards */}
        <div className="px-4 pt-4 flex gap-2">
          {teeDistances.map((dist, i) => {
            const isRetired = teeRetired[i];
            const isActive = i === activeTee && !finished;
            return (
              <div
                key={i}
                className={`flex-1 rounded-xl p-2 text-center border-2 transition-colors ${
                  isRetired ? "bg-green-100 border-green-400" :
                  isActive ? "bg-white border-amber-400" :
                  "bg-white border-gray-200"
                }`}
              >
                <p className="text-xs font-semibold text-gray-500 mb-1">Tee {i + 1}</p>
                {isRetired ? (
                  <p className="text-sm font-extrabold text-green-700">✅ Done</p>
                ) : (
                  <p className={`text-xl font-extrabold ${isActive ? "text-amber-600" : "text-gray-700"}`}>
                    {dist}ft
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Active tee panel or completion */}
        <div className="px-4 py-4">
          {!finished ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-3">
                Tee {activeTee + 1} — {activeDist}ft
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => recordPutt(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-700"
                >
                  {atRetireDist ? "✅ Hole It — retire this tee" : `✅ Holed — advance to ${activeDist + 1}ft`}
                </button>
                <button
                  type="button"
                  onClick={() => recordPutt(false)}
                  className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-semibold text-sm hover:bg-red-200 border border-red-200"
                >
                  {atRetireDist ? "❌ Missed — back to 9ft" : `❌ Missed — back to ${activeDist - 1}ft`}
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border px-4 py-4 text-center ${capReached ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <p className="text-lg font-bold mb-1">{capReached ? "Cap reached" : "Drill Complete! 🎉"}</p>
              <p className="text-4xl font-extrabold">{puttCount}</p>
              <p className="text-sm mt-1">total putts</p>
            </div>
          )}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="px-4 pb-2 max-h-36 overflow-y-auto space-y-1">
            {log.map((entry, i) => (
              <div key={i} className={`flex gap-3 rounded px-3 py-1 text-xs ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <span className="font-bold text-green-700 w-24 shrink-0">Putt {puttCount - i} — Tee {entry.tee} {entry.dist}ft</span>
                <span className={entry.made ? "text-green-600" : "text-red-500"}>
                  {entry.retired ? "🏁 Retired!" : entry.made ? `✅ Holed → ${entry.dist + 1}ft` : `❌ Missed → ${entry.dist - 1}ft`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Stats bar */}
        <div className="px-4 pb-4 flex gap-3 mt-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Putts taken</p>
            <p className="text-2xl font-extrabold text-gray-700">{puttCount}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Cap</p>
            <p className="text-2xl font-extrabold text-gray-700">{CAP}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Tees retired</p>
            <p className="text-2xl font-extrabold text-green-700">{retiredCount}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(puttCount)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({puttCount} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function HoleAllDistancesModal({ drillId, drill, onSave, onCancel }) {
  const config = HOLE_ALL_DISTANCES_CONFIGS[drillId];
  const DISTANCES = config.distances;
  const [puttCounts, setPuttCounts] = useState(Array(DISTANCES.length).fill(0));
  const [activeIdx, setActiveIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleMiss() {
    setPuttCounts(prev => prev.map((v, i) => i === activeIdx ? v + 1 : v));
  }

  function handleHole() {
    setPuttCounts(prev => prev.map((v, i) => i === activeIdx ? v + 1 : v));
    if (activeIdx === DISTANCES.length - 1) {
      setFinished(true);
      setActiveIdx(DISTANCES.length);
    } else {
      setActiveIdx(activeIdx + 1);
    }
  }

  const totalPutts = puttCounts.reduce((a, b) => a + b, 0);
  const completedCount = activeIdx;
  const zone = totalPutts <= config.perfect + 3
    ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : totalPutts <= Math.round((config.perfect + config.worst) / 2)
    ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
    : { label: "Red Zone", color: "text-red-700 bg-red-50 border-red-200" };

  function puttOrdinal(count) {
    if (count === 0) return "1st putt";
    if (count === 1) return "2nd putt";
    if (count === 2) return "3rd putt";
    return `${count + 1}th putt`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4">
        <div className="bg-green-800 text-white rounded-t-2xl px-5 py-4">
          <h2 className="text-lg font-bold">{config.icon} {config.title}</h2>
          <p className="text-green-300 text-sm mt-0.5">Hole each distance — miss keeps the putt going</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Hole It → distance complete · Miss → another putt at same distance · Score = total putts across all {DISTANCES.length} distances
        </div>

        <div className="px-4 py-4 space-y-1.5">
          {DISTANCES.map((dist, i) => {
            const isCompleted = i < activeIdx;
            const isActive = i === activeIdx && !finished;
            const count = puttCounts[i];

            if (isCompleted) {
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 bg-green-50">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-green-700">{dist}ft</span>
                    <span className="text-xs text-gray-400 ml-2">{count} {count === 1 ? "putt" : "putts"}</span>
                  </div>
                  <span className="text-lg">✅</span>
                </div>
              );
            }

            if (isActive) {
              return (
                <div key={i} className="rounded-xl border-2 border-orange-300 bg-orange-50 px-3 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-amber-700">{dist}ft</span>
                    <span className="text-xs font-medium text-amber-600">{puttOrdinal(count)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleHole}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700"
                    >
                      ✅ Hole It
                    </button>
                    <button
                      type="button"
                      onClick={handleMiss}
                      className="flex-1 bg-rose-100 text-rose-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-rose-200 border border-rose-200"
                    >
                      ❌ Miss
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-50">
                <span className="text-sm text-gray-400">{dist}ft</span>
              </div>
            );
          })}

          {finished && (
            <div className={`rounded-xl border px-4 py-4 text-center mt-2 ${zone.color}`}>
              <p className="text-lg font-bold mb-1">Complete! 🎉</p>
              <p className="text-4xl font-extrabold leading-none">{totalPutts}</p>
              <p className="text-sm mt-1">total putts</p>
              <p className="text-xs mt-1 opacity-70">{zone.label} · Perfect {config.perfect} · Worst {config.worst}</p>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="px-4 pb-4 flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Total putts</p>
            <p className="text-2xl font-extrabold text-gray-700">{totalPutts}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Distances done</p>
            <p className="text-2xl font-extrabold text-gray-700">{completedCount} / {DISTANCES.length}</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="text-2xl font-extrabold text-gray-700">{DISTANCES.length - completedCount}</p>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          {finished && (
            <button
              onClick={() => onSave(totalPutts)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-sm"
            >
              Save Score ({totalPutts} putts)
            </button>
          )}
          <button onClick={onCancel} className={`bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 text-sm font-medium ${finished ? "" : "flex-1"}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export {
  SwedishScorecardModal,
  Par72ScorecardModal,
  PelzScorecardModal,
  ProximityScorecardModal,
  NegativeScorecardModal,
  JuniorPuttingScorecardModal,
  JuniorShortGameScorecardModal,
  SundayStandardScorecardModal,
  SwedishQuickFireScorecardModal,
  PelzSnapshotScorecardModal,
  BroadieChaseModal,
  PointsRaceScorecardModal,
  BroadieTestModal,
  LukeDonaldScorecardModal,
  GauntletScorecardModal,
  Challenge250ScorecardModal,
  SuddenDeathCarouselModal,
  DrawbackGauntletModal,
  JaggedPeaksModal,
  AscentModal,
  AnchorModal,
  CrucibleModal,
  SniperSchoolModal,
  HoleAllDistancesModal,
  LieMixScorecardModal,
  TapToToggleModal,
  SpiralHoleOutModal,
  EliminatorModal,
  GateCompletionModal,
};
