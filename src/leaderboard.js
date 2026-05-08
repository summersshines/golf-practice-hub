// ─── CATEGORY LEADERBOARD LOGIC ──────────────────────────────────────────────

const WINDOW_DAYS = 60;
const MAX_ATTEMPTS = 10;
const MAX_SAME_DRILL = 5;
const MIN_ATTEMPTS = 5;

/**
 * calcCategoryLeaderboard
 *
 * Takes all leaderboard entries and a category name, applies:
 * - 60 day rolling window
 * - Max 10 attempts per player per category
 * - Max 5 attempts of the same drill counted
 * - Minimum 5 attempts to appear on leaderboard
 *
 * Returns array of players sorted by rolling average PI descending, each with:
 * - player: string
 * - avgPI: number (rounded)
 * - attempts: number
 * - last3: array of last 3 drill results { drillName, score, unit, indexScore, date }
 * - trend: array of { y: indexScore } for spark line (chronological order)
 */
export function calcCategoryLeaderboard(allEntries, category, drillCategoryMap) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - WINDOW_DAYS);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  // Filter to category and within window
  const catEntries = allEntries.filter(e =>
    drillCategoryMap[e.drill_id] === category &&
    e.index_score !== null &&
    e.date >= cutoffStr
  );

  // Group by player
  const byPlayer = {};
  catEntries.forEach(e => {
    if (!byPlayer[e.player]) byPlayer[e.player] = [];
    byPlayer[e.player].push(e);
  });

  const results = [];

  Object.entries(byPlayer).forEach(([player, entries]) => {
    // Sort by date descending (most recent first)
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

    // Apply drill cap and attempt cap
    const drillCounts = {};
    const counted = [];

    for (const entry of sorted) {
      if (counted.length >= MAX_ATTEMPTS) break;
      const dc = drillCounts[entry.drill_id] ?? 0;
      if (dc >= MAX_SAME_DRILL) continue;
      drillCounts[entry.drill_id] = dc + 1;
      counted.push(entry);
    }

    // Minimum attempts check
    if (counted.length < MIN_ATTEMPTS) return;

    // Rolling average PI
    const avgPI = Math.round(
      counted.reduce((sum, e) => sum + e.index_score, 0) / counted.length
    );

    // Last 3 drill results (most recent first)
    const last3 = counted.slice(0, 3).map(e => ({
      drillName: e.drill_name,
      score: e.score,
      unit: e.unit ?? '',
      indexScore: Math.round(e.index_score),
      date: e.date,
    }));

    // Trend points in chronological order for spark line
    const trend = [...counted]
      .reverse()
      .map(e => ({ y: e.index_score }));

    results.push({ player, avgPI, attempts: counted.length, last3, trend });
  });

  // Sort by avgPI descending
  results.sort((a, b) => b.avgPI - a.avgPI);

  return results;
}
