import { useState } from "react";
import { calcCategoryLeaderboard } from './leaderboard.js';

const CATEGORIES = ["Putting", "Chipping", "Pitching", "Bunker", "Mixed"];

function ratingColor(idx) {
  if (idx === null || idx === undefined) return { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" };
  if (idx >= 80) return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" };
  if (idx >= 50) return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" };
  return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
}

function SparkLine({ trend }) {
  if (!trend || trend.length < 2) return <span className="inline-block w-20" />;
  const W = 80, H = 24, pad = 3;
  const vals = trend.map(p => p.y);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const rangeV = maxV - minV || 1;
  const xs = trend.map((_, i) => pad + (i / (trend.length - 1)) * (W - pad * 2));
  const ys = trend.map(p => H - pad - ((p.y - minV) / rangeV) * (H - pad * 2));
  const last = trend[trend.length - 1].y;
  const color = last >= 80 ? "#16a34a" : last >= 50 ? "#ca8a04" : "#dc2626";
  return (
    <svg width={W} height={H} className="shrink-0">
      <polyline
        points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CategoryLeaderboard({ allLbEntries, currentPlayer, drillCategoryMap }) {
  const [activeCategory, setActiveCategory] = useState("Putting");

  const results = calcCategoryLeaderboard(allLbEntries, activeCategory, drillCategoryMap);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {results.length < 2 ? (
        <p className="text-sm text-gray-400 italic py-4 text-center">
          Not enough data yet — players need at least 5 sessions in this category within the last 60 days to appear.
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 text-sm font-semibold flex items-center gap-3">
            <span className="w-8">#</span>
            <span className="flex-1">Player</span>
            <span className="w-16 text-right">Avg PI</span>
            <span className="w-20 shrink-0">Trend</span>
          </div>

          {(() => {
            const currentPlayerIdx = results.findIndex(e => e.player === currentPlayer);
            const showExtra = currentPlayerIdx >= 5;
            const top = results.length <= 5 ? results : results.slice(0, 5);

            const renderRow = (entry, i) => {
              const isCurrentPlayer = entry.player === currentPlayer;
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
              const rc = ratingColor(entry.avgPI);
              return (
                <div
                  key={entry.player}
                  className={`border-b border-gray-100 last:border-0 ${
                    isCurrentPlayer ? "bg-green-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* Player row */}
                  <div className="flex items-center gap-3 px-4 py-3 text-sm">
                    <span className="w-8 font-bold text-gray-500 shrink-0">
                      {medal ?? `${i + 1}`}
                    </span>
                    <span className={`flex-1 font-medium min-w-0 ${isCurrentPlayer ? "text-green-700" : "text-gray-800"}`}>
                      {entry.player}{isCurrentPlayer ? " (you)" : ""}
                      <span className="block text-xs font-normal text-gray-400">{entry.attempts} attempts</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${rc.bg} ${rc.text}`}>
                      {entry.avgPI}
                    </span>
                    <SparkLine trend={entry.trend} />
                  </div>

                  {/* Last 3 drill results */}
                  {entry.last3.length > 0 && (
                    <div className="px-4 pb-3 flex flex-col gap-1">
                      {entry.last3.map((d, j) => {
                        const dr = ratingColor(d.indexScore);
                        return (
                          <div key={j} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                            <span className="flex-1 truncate font-medium text-gray-700">{d.drillName}</span>
                            <span className="shrink-0 font-semibold">{d.score}{d.unit ? ` ${d.unit}` : ""}</span>
                            <span className={`shrink-0 px-1.5 py-0.5 rounded-full font-semibold ${dr.bg} ${dr.text}`}>
                              {d.indexScore}
                            </span>
                            <span className="shrink-0 text-gray-400 w-14 text-right">
                              {new Date(d.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            };

            return (
              <>
                {top.map((entry, i) => renderRow(entry, i))}
                {showExtra && (
                  <>
                    <div className="py-1 text-center text-sm text-gray-400 border-b border-gray-100">· · ·</div>
                    {renderRow(results[currentPlayerIdx], currentPlayerIdx)}
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
