import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase';
import {
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
  NineHoleChippingModal,
  BankDrillModal,
} from './scorecards';
import { DRILLS, DRILL_CATEGORY, CATEGORIES, CAT_COLOR } from './drillData';
import { CategoryLeaderboard } from './leaderboard.jsx';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function calcIndex(drill, score) {
  if (drill.dir === null) return null;
  const s = parseFloat(score);
  if (isNaN(s)) return null;
  const { perfect, worst } = drill;
  const range = Math.abs(perfect - worst);
  if (range === 0) return 50;
  let raw;
  if (drill.dir === "lower") raw = ((worst - s) / (worst - perfect)) * 100;
  else raw = ((s - worst) / (perfect - worst)) * 100;
  return Math.max(0, Math.min(100, raw));
}

function ratingColor(idx) {
  if (idx === null) return { bg:"bg-gray-100", text:"text-gray-500", label:"N/A", dot:"bg-gray-400" };
  if (idx >= 80) return { bg:"bg-green-100", text:"text-green-700", label:"Green", dot:"bg-green-500" };
  if (idx >= 50) return { bg:"bg-yellow-100", text:"text-yellow-700", label:"Yellow", dot:"bg-yellow-500" };
  return { bg:"bg-red-100", text:"text-red-700", label:"Red", dot:"bg-red-500" };
}

function today() { return new Date().toISOString().split("T")[0]; }

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const DB = {
  async getSessions() {
    const { data, error } = await supabase.from('sessions').select('*').order('date', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
  },
  async addSession(session) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('sessions').insert([{
      id: session.id, player: session.player, drill_id: session.drillId,
      drill_name: session.drillName, score: session.score, unit: session.unit,
      dir: session.dir, index_score: session.index, notes: session.notes, date: session.date,
      user_id: user.id,
    }]);
    if (error) console.error(error);
  },
  async deleteSession(id) {
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) console.error(error);
  },
  async getLeaderboard(drillId) {
    const { data, error } = await supabase.from('leaderboard').select('*').eq('drill_id', drillId);
    if (error) { console.error(error); return []; }
    return data;
  },
  async getPIRanking() {
    const { data, error } = await supabase.from('pi_ranking').select('*');
    if (error) { console.error(error); return []; }
    return data;
  },
  async getAllLeaderboardEntries() {
    const { data, error } = await supabase.from('leaderboard').select('*');
    if (error) { console.error(error); return []; }
    return data;
  },
};

// ─── MINI SVG LINE CHART ──────────────────────────────────────────────────────
function MiniLineChart({ points, color = "#16a34a" }) {
  if (!points || points.length < 2) return null;
  const W = 160, H = 40, pad = 4;
  const vals = points.map(p => p.y);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const rangeV = maxV - minV || 1;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (W - pad * 2));
  const ys = points.map(p => H - pad - ((p.y - minV) / rangeV) * (H - pad * 2));
  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline points={xs.map((x,i)=>`${x},${ys[i]}`).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {points.map((p, i) => (
        <circle key={i} cx={xs[i]} cy={ys[i]} r="3" fill={color} />
      ))}
    </svg>
  );
}

// ─── OVERALL INDEX TREND CHART ────────────────────────────────────────────────
function OverallTrendChart({ sessions }) {
  const withIdx = sessions.filter(s => s.index !== null).slice().sort((a,b) => a.date.localeCompare(b.date));
  if (withIdx.length < 2) return (
    <div className="text-center text-gray-400 py-6 text-sm">Log at least 2 scored sessions to see your trend chart.</div>
  );
  const pts = withIdx.map(s => ({ date: s.date, y: s.index }));
  const W = 600, H = 160, padL = 36, padR = 12, padT = 12, padB = 28;
  const iW = W - padL - padR, iH = H - padT - padB;
  const minY = 0, maxY = 100;
  const xs = pts.map((_, i) => padL + (i / Math.max(pts.length - 1, 1)) * iW);
  const ys = pts.map(p => padT + iH - ((p.y - minY) / (maxY - minY)) * iH);
  const gridLines = [0, 25, 50, 75, 100];
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{minWidth:300}}>
        {gridLines.map(v => {
          const y = padT + iH - ((v - minY) / (maxY - minY)) * iH;
          const col = v >= 80 ? "#dcfce7" : v >= 50 ? "#fef9c3" : "#fee2e2";
          return (
            <g key={v}>
              {v > 0 && <rect x={padL} y={y} width={iW} height={iH - (padT + iH - ((Math.min(v+25,100)-minY)/(maxY-minY))*iH - y)} fill={col} opacity="0.35"/>}
              <line x1={padL} x2={W-padR} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1"/>
              <text x={padL-4} y={y+4} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
            </g>
          );
        })}
        <text x={padL+4} y={padT+8} fontSize="8" fill="#16a34a" opacity="0.7">Green Zone</text>
        <text x={padL+4} y={padT + iH*0.35} fontSize="8" fill="#ca8a04" opacity="0.7">Yellow Zone</text>
        <text x={padL+4} y={padT + iH*0.75} fontSize="8" fill="#dc2626" opacity="0.7">Red Zone</text>
        <polyline points={xs.map((x,i)=>`${x},${ys[i]}`).join(" ")} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {pts.map((p, i) => {
          const dotCol = p.y >= 80 ? "#16a34a" : p.y >= 50 ? "#ca8a04" : "#dc2626";
          return <circle key={i} cx={xs[i]} cy={ys[i]} r="4" fill={dotCol} stroke="white" strokeWidth="1.5"/>;
        })}
        {[0, Math.floor((pts.length-1)/2), pts.length-1].filter((v,i,a)=>a.indexOf(v)===i).map(i => (
          <text key={i} x={xs[i]} y={H-4} textAnchor="middle" fontSize="8" fill="#9ca3af">
            {new Date(pts[i].date).toLocaleDateString("en-AU",{day:"numeric",month:"short"})}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ─── PERSONAL BESTS PANEL ─────────────────────────────────────────────────────
function PersonalBestsPanel({ sessions }) {
  const bests = [];
  DRILLS.forEach(drill => {
    const ds = sessions.filter(s => s.drillId === drill.id && s.dir !== null);
    if (!ds.length) return;
    const best = drill.dir === "lower"
      ? ds.reduce((a,b) => a.score < b.score ? a : b)
      : ds.reduce((a,b) => a.score > b.score ? a : b);
    const idx = calcIndex(drill, best.score);
    bests.push({ drill, session: best, idx });
  });
  if (!bests.length) return <p className="text-sm text-gray-400">No scored sessions yet.</p>;
  bests.sort((a,b) => (b.idx ?? -1) - (a.idx ?? -1));
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
      {bests.map(({ drill, session, idx }) => {
        const r = ratingColor(idx);
        const cat = DRILL_CATEGORY[drill.id];
        return (
          <div key={drill.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${CAT_COLOR[cat]}`}>{cat}</span>
            <span className="flex-1 text-gray-700 truncate">{drill.name}</span>
            <span className="font-bold text-green-700 shrink-0">{session.score}{drill.unit ? ` ${drill.unit}` : ""}</span>
            {idx !== null && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${r.bg} ${r.text}`}>{Math.round(idx)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CATEGORY STATS PANEL ─────────────────────────────────────────────────────
function CategoryStatsPanel({ sessions }) {
  const cats = ["Putting", "Chipping", "Pitching", "Bunker", "Mixed"];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {cats.map(cat => {
        const catSessions = sessions.filter(s => DRILL_CATEGORY[s.drillId] === cat);
        const withIdx = catSessions.filter(s => s.index !== null);
        const avgIdx = withIdx.length ? Math.round(withIdx.reduce((a,b)=>a+b.index,0)/withIdx.length) : null;
        const r = ratingColor(avgIdx);
        const trendPts = withIdx.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(s=>({y:s.index}));
        return (
          <div key={cat} className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-1">
            <div className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${CAT_COLOR[cat]}`}>{cat}</div>
            <div className="text-2xl font-bold text-green-700">{avgIdx ?? "—"}</div>
            <div className="text-xs text-gray-400">Avg Index</div>
            <div className="text-xs text-gray-500">{catSessions.length} session{catSessions.length !== 1 ? "s" : ""}</div>
            {trendPts.length >= 2 && (
              <div className="mt-1">
                <MiniLineChart points={trendPts} color={avgIdx >= 80 ? "#16a34a" : avgIdx >= 50 ? "#ca8a04" : "#dc2626"} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MILESTONE BADGES ─────────────────────────────────────────────────────────
function MilestoneBadges({ sessions }) {
  const total = sessions.length;
  const withIdx = sessions.filter(s => s.index !== null);
  const greens = withIdx.filter(s => s.index >= 80).length;
  const drillsPlayed = new Set(sessions.map(s => s.drillId)).size;
  const best = withIdx.length ? Math.max(...withIdx.map(s=>s.index)) : 0;
  const streak = (() => {
    const days = [...new Set(sessions.map(s=>s.date))].sort((a,b)=>b.localeCompare(a));
    if (!days.length) return 0;
    let count = 1;
    for (let i=1; i<days.length; i++) {
      const prev = new Date(days[i-1]), curr = new Date(days[i]);
      const diff = (prev - curr) / 86400000;
      if (diff === 1) count++; else break;
    }
    return count;
  })();
  const all = [
    { icon:"🎯", label:"First Session",    earned: total >= 1,   desc:"Logged your first session" },
    { icon:"📅", label:"10 Sessions",      earned: total >= 10,  desc:"Logged 10 sessions" },
    { icon:"💪", label:"50 Sessions",      earned: total >= 50,  desc:"Logged 50 sessions" },
    { icon:"🏆", label:"100 Sessions",     earned: total >= 100, desc:"Logged 100 sessions" },
    { icon:"🟢", label:"First Green",      earned: greens >= 1,  desc:"Scored a Green Index (80+)" },
    { icon:"🌟", label:"5 Greens",         earned: greens >= 5,  desc:"Scored 5 Green Index results" },
    { icon:"⭐", label:"20 Greens",        earned: greens >= 20, desc:"Scored 20 Green Index results" },
    { icon:"🔥", label:"Perfect 100",      earned: best >= 99,   desc:"Achieved a perfect 100 Index" },
    { icon:"🎲", label:"10 Drills",        earned: drillsPlayed >= 10, desc:"Tried 10 different drills" },
    { icon:"🎪", label:"25 Drills",        earned: drillsPlayed >= 25, desc:"Tried 25 different drills" },
    { icon:"📆", label:"3-Day Streak",     earned: streak >= 3,  desc:"Practiced 3 days in a row" },
    { icon:"🗓️", label:"7-Day Streak",     earned: streak >= 7,  desc:"Practiced 7 days in a row" },
  ];
  const earned = all.filter(m=>m.earned);
  const locked = all.filter(m=>!m.earned);
  return (
    <div>
      {earned.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {earned.map(m => (
            <div key={m.label} title={m.desc} className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-sm font-medium text-green-800">
              <span>{m.icon}</span><span>{m.label}</span>
            </div>
          ))}
        </div>
      )}
      {locked.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {locked.map(m => (
            <div key={m.label} title={m.desc} className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-400">
              <span className="grayscale opacity-50">{m.icon}</span><span>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PLAYER DRILL BREAKDOWN ───────────────────────────────────────────────────
function PlayerDrillBreakdown({ playerName, allEntries }) {
  const CATS = ["Putting", "Chipping", "Pitching", "Bunker", "Mixed"];
  const [activeTab, setActiveTab] = useState("Putting");

  const playerEntries = allEntries.filter(e => e.player === playerName);

  function getCatAvg(cat) {
    const entries = playerEntries.filter(e => DRILL_CATEGORY[e.drill_id] === cat && e.index_score !== null);
    if (!entries.length) return null;
    return Math.round(entries.reduce((a, b) => a + b.index_score, 0) / entries.length);
  }

  function getCatTrend(cat) {
    const entries = playerEntries
      .filter(e => DRILL_CATEGORY[e.drill_id] === cat && e.index_score !== null)
      .sort((a, b) => a.date.localeCompare(b.date));
    return entries.map(e => ({ y: e.index_score }));
  }

  function getRecentSessions(cat) {
    return playerEntries
      .filter(e => DRILL_CATEGORY[e.drill_id] === cat)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }

  const recentSessions = getRecentSessions(activeTab);
  const avgIdx = getCatAvg(activeTab);

  return (
    <div className="px-4 pb-4 pt-2 bg-green-50 border-t border-green-100">
      <p className="text-xs font-semibold text-green-800 mb-3">{playerName} — drill breakdown</p>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {CATS.map(cat => {
          const avg = getCatAvg(cat);
          const trend = getCatTrend(cat);
          const isActive = cat === activeTab;
          const avgColor = avg === null ? "text-gray-400" : avg >= 80 ? "text-green-600" : avg >= 50 ? "text-yellow-600" : "text-red-500";
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isActive
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
              }`}
            >
              {trend.length >= 2 && (
                <svg width="24" height="12" viewBox="0 0 24 12">
                  {(() => {
                    const vals = trend.map(p => p.y);
                    const min = Math.min(...vals), max = Math.max(...vals);
                    const range = max - min || 1;
                    const pts = trend.map((p, i) => {
                      const x = 2 + (i / (trend.length - 1)) * 20;
                      const y = 10 - ((p.y - min) / range) * 8;
                      return `${x},${y}`;
                    }).join(" ");
                    return <polyline points={pts} fill="none" stroke={isActive ? "#fff" : "#16a34a"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>;
                  })()}
                </svg>
              )}
              {cat}
              <span className={`${isActive ? "text-green-200" : avgColor} font-semibold`}>
                · {avg ?? "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Drill list */}
      <p className="text-xs font-semibold text-green-700 mb-2">{activeTab} — last 5 sessions</p>
      {recentSessions.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No sessions logged yet.</p>
      ) : (
        <div className="space-y-1.5">
          {recentSessions.map((e, i) => {
            const drill = DRILLS.find(d => d.id === e.drill_id);
            const r = ratingColor(e.index_score);
            return (
              <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs">
                <span className="flex-1 text-gray-700 truncate">{e.drill_name}</span>
                <span className="font-semibold text-green-700 shrink-0">{e.score}{drill?.unit ? ` ${drill.unit}` : ""}</span>
                {e.index_score !== null && (
                  <span className={`px-2 py-0.5 rounded-full font-medium shrink-0 ${r.bg} ${r.text}`}>{Math.round(e.index_score)}</span>
                )}
                <span className="text-gray-400 shrink-0 w-16 text-right">
                  {new Date(e.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── DRILL HISTORY PANEL ──────────────────────────────────────────────────────
function DrillHistoryPanel({ drillId, sessions }) {
  const [expanded, setExpanded] = useState(false);

  if (!drillId) return null;

  const drill = DRILLS.find(d => d.id === drillId);
  if (!drill) return null;

  const history = sessions
    .filter(s => s.drillId === drillId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  if (!history.length) return null;

  const withIdx = history.filter(s => s.index !== null);
  const hasTrend = withIdx.length >= 2;

  const trendSummary = (() => {
    if (!hasTrend) return null;
    const oldest = withIdx[withIdx.length - 1].index;
    const newest = withIdx[0].index;
    const diff = Math.round(newest - oldest);
    if (diff > 0) return { label: `+${diff} pts over ${withIdx.length} sessions`, up: true };
    if (diff < 0) return { label: `${diff} pts over ${withIdx.length} sessions`, up: false };
    return { label: `No change over ${withIdx.length} sessions`, up: null };
  })();

  const trendColor = trendSummary === null ? "" : trendSummary.up === true ? "text-green-600" : trendSummary.up === false ? "text-red-500" : "text-gray-400";

  const sparkPoints = (() => {
    if (!hasTrend) return null;
    const pts = [...withIdx].reverse();
    const vals = pts.map(p => p.index);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    return pts.map((p, i) => {
      const x = 2 + (i / (pts.length - 1)) * 56;
      const y = 18 - ((p.index - min) / range) * 14;
      return `${x},${y}`;
    }).join(" ");
  })();

  const last = history[0];
  const lastR = ratingColor(last.index);

  return (
    <div className="mt-2 mb-1 border border-gray-200 rounded-lg overflow-hidden">
      {/* Compact strip — always visible */}
      <div className="px-3 py-2 bg-gray-50">
        {/* Row 1: Last attempt + History button */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Last attempt</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-green-700">{last.score}{drill.unit ? ` ${drill.unit}` : ""}</span>
              <span className="text-xs text-gray-400">{new Date(last.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span>
              {last.index !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${lastR.bg} ${lastR.text}`}>{Math.round(last.index)}</span>
              )}
            </div>
          </div>
          {history.length > 1 && (
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              className="shrink-0 text-xs text-green-700 underline hover:text-green-800"
            >
              {expanded ? "Hide" : "History"}
            </button>
          )}
        </div>
        {/* Row 2: Trend + Sparkline */}
        {trendSummary && (
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Trend</p>
              <p className={`text-xs font-semibold ${trendColor}`}>{trendSummary.label}</p>
            </div>
            {sparkPoints && (
              <svg width="60" height="20" viewBox="0 0 60 20" className="shrink-0">
                <polyline points={sparkPoints} fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3 py-2 border-t border-gray-200 bg-white space-y-1.5">
          {history.map((s, i) => {
            const r = ratingColor(s.index);
            const barWidth = s.index !== null ? Math.round(s.index) : 0;
            const barColor = s.index >= 80 ? "#16a34a" : s.index >= 50 ? "#ca8a04" : "#dc2626";
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 w-14 shrink-0">
                  {new Date(s.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                </span>
                <span className="font-semibold text-green-700 w-16 shrink-0">{s.score}{drill.unit ? ` ${drill.unit}` : ""}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  {s.index !== null && (
                    <div className="h-full rounded-full" style={{ width: `${barWidth}%`, background: barColor }}></div>
                  )}
                </div>
                {s.index !== null && (
                  <span className={`px-1.5 py-0.5 rounded-full font-medium shrink-0 ${r.bg} ${r.text}`}>{Math.round(s.index)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD PANEL ──────────────────────────────────────────────────────────
function DashboardPanel({ sessions, player, onGoToLog }) {
  if (!sessions.length) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">⛳</div>
      <p className="text-gray-500 text-lg font-medium mb-2">No sessions logged yet</p>
      <p className="text-gray-400 text-sm mb-6">Add your first practice session to see your dashboard.</p>
      <button onClick={onGoToLog} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
        + Add First Session
      </button>
    </div>
  );

  const withIdx = sessions.filter(s => s.index !== null);

  // ── Overall PI ──────────────────────────────────────────────────────────────
  const overallPI = withIdx.length
    ? Math.round(withIdx.reduce((a,b) => a + b.index, 0) / withIdx.length)
    : null;

  // Trend: compare avg of last 5 scored sessions vs the 5 before that
  const trend = (() => {
    if (withIdx.length < 2) return null;
    const sorted = [...withIdx].sort((a,b) => b.date.localeCompare(a.date));
    const recent = sorted.slice(0, 5);
    const prior = sorted.slice(5, 10);
    if (!prior.length) return null;
    const recentAvg = recent.reduce((a,b) => a + b.index, 0) / recent.length;
    const priorAvg = prior.reduce((a,b) => a + b.index, 0) / prior.length;
    const diff = Math.round(recentAvg - priorAvg);
    return diff;
  })();

  const piColor = overallPI === null ? "text-gray-400"
    : overallPI >= 80 ? "text-green-600"
    : overallPI >= 50 ? "text-yellow-500"
    : "text-red-500";

  const piBg = overallPI === null ? "bg-gray-50"
    : overallPI >= 80 ? "bg-green-50 border border-green-200"
    : overallPI >= 50 ? "bg-yellow-50 border border-yellow-200"
    : "bg-red-50 border border-red-200";

  const piLabel = overallPI === null ? "No data"
    : overallPI >= 80 ? "Green Zone — Elite"
    : overallPI >= 50 ? "Yellow Zone — Developing"
    : "Red Zone — Needs Work";

  // ── Weak category ──────────────────────────────────────────────────────────
  const cats = ["Putting", "Chipping", "Pitching", "Bunker", "Mixed"];

  // Build category stats
  const catAvgs = cats.map(cat => {
    const cs = withIdx.filter(s => DRILL_CATEGORY[s.drillId] === cat);
    const avg = cs.length ? Math.round(cs.reduce((a, b) => a + b.index, 0) / cs.length) : null;
    return { cat, avg, count: cs.length };
  }).filter(c => c.avg !== null);

  // Priority 1 — declining trend (overall direction over last 3 scored sessions)
  const decliningCat = (() => {
    for (const cat of cats) {
      const recent = withIdx
        .filter(s => DRILL_CATEGORY[s.drillId] === cat)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3);
      if (recent.length < 3) continue;
      const newest = recent[0].index;
      const oldest = recent[2].index;
      if (newest < oldest) return { cat, newest: Math.round(newest), oldest: Math.round(oldest) };
    }
    return null;
  })();

  // Priority 2 — neglected category (no session in 14+ days)
  const neglectedCat = (() => {
    if (decliningCat) return null;
    const today = new Date();
    for (const cat of cats) {
      const catSessions = sessions.filter(s => DRILL_CATEGORY[s.drillId] === cat);
      if (!catSessions.length) continue;
      const latest = catSessions.sort((a, b) => b.date.localeCompare(a.date))[0];
      const daysSince = Math.floor((today - new Date(latest.date)) / 86400000);
      if (daysSince >= 14) return { cat, daysSince };
    }
    return null;
  })();

  // Priority 3 — fallback to lowest average
  const weakCat = (() => {
    if (decliningCat || neglectedCat) return null;
    if (!catAvgs.length) return null;
    return catAvgs.reduce((a, b) => a.avg < b.avg ? a : b);
  })();

  // Suggested drills for fallback weakCat only
  const suggestedDrills = (() => {
    if (!weakCat) return [];
    const catDrills = DRILLS.filter(d => DRILL_CATEGORY[d.id] === weakCat.cat && d.dir !== null);
    const played = [];
    catDrills.forEach(drill => {
      const ds = withIdx.filter(s => s.drillId === drill.id);
      if (!ds.length) return;
      const avg = Math.round(ds.reduce((a, b) => a + b.index, 0) / ds.length);
      played.push({ drill, avgIdx: avg, played: true });
    });
    played.sort((a, b) => a.avgIdx - b.avgIdx);
    const playedIds = new Set(played.map(p => p.drill.id));
    const unplayed = catDrills
      .filter(d => !playedIds.has(d.id))
      .map(d => ({ drill: d, avgIdx: null, played: false }));
    return [...played, ...unplayed].slice(0, 3);
  })();

  // ── Recent sessions (last 3) ────────────────────────────────────────────────
  const recent = sessions.slice(0, 3);

  return (
    <div className="space-y-4">

      {/* Quick log button */}
  <div className="flex justify-end">
    <button
      onClick={onGoToLog}
      className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 text-sm">
      + Log Session
    </button>
  </div>
      {/* 1 — Overall PI headline */}
      <div className={`rounded-xl p-5 ${piBg}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Overall Performance Index</p>
            <div className="flex items-end gap-3">
              <span className={`text-6xl font-extrabold leading-none ${piColor}`}>
                {overallPI ?? "—"}
              </span>
              <div className="pb-1">
                {trend !== null && (
                  <span className={`text-sm font-semibold flex items-center gap-1 ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-500" : "text-gray-400"}`}>
                    {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {Math.abs(trend)} vs prior 5
                  </span>
                )}
                <span className="text-xs text-gray-500">{piLabel}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div><strong className="text-gray-700">{withIdx.length}</strong> scored sessions</div>
            <div><strong className="text-gray-700">{sessions.length}</strong> total sessions</div>
          </div>
        </div>
      </div>

      {/* 2 — Category breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Avg Index by Category</p>
        <CategoryStatsPanel sessions={sessions} />
      </div>

      {/* 3 — Weak area + suggested drills */}
      {(decliningCat || neglectedCat || weakCat) && (
        <div className={`rounded-xl p-4 border ${
          decliningCat ? "bg-red-50 border-red-200" :
          neglectedCat ? "bg-yellow-50 border-yellow-200" :
          "bg-orange-50 border-orange-200"
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">
              {decliningCat ? "📉" : neglectedCat ? "⏰" : "🎯"}
            </span>
            <div>
              {decliningCat && (
                <>
                  <p className="text-sm font-bold text-red-800">Declining: {decliningCat.cat}</p>
                  <p className="text-xs text-red-600">Index dropped from {decliningCat.oldest} to {decliningCat.newest} over your last 3 sessions</p>
                </>
              )}
              {neglectedCat && (
                <>
                  <p className="text-sm font-bold text-yellow-800">Overdue: {neglectedCat.cat}</p>
                  <p className="text-xs text-yellow-600">No {neglectedCat.cat} session in {neglectedCat.daysSince} days — time to revisit</p>
                </>
              )}
              {weakCat && (
                <>
                  <p className="text-sm font-bold text-orange-800">Focus Area: {weakCat.cat}</p>
                  <p className="text-xs text-orange-600">Avg index {weakCat.avg} — your lowest category</p>
                </>
              )}
            </div>
          </div>
          {weakCat && suggestedDrills.length > 0 && (
            <>
              <p className="text-xs font-semibold text-orange-700 mb-2">Suggested drills to work on:</p>
              <div className="space-y-2">
                {suggestedDrills.map(({ drill, avgIdx, played }) => {
                  const r = played ? ratingColor(avgIdx) : null;
                  return (
                    <div key={drill.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm shadow-sm">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${CAT_COLOR[weakCat.cat]}`}>{weakCat.cat}</span>
                      <span className="flex-1 text-gray-700 truncate">{drill.name}</span>
                      {played && avgIdx !== null ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${r.bg} ${r.text}`}>
                          Avg {avgIdx}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 shrink-0 italic">Not yet played</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* 4 — Recent sessions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Recent Sessions</p>
        <div className="space-y-2">
          {recent.map(s => {
            const r = ratingColor(s.index);
            return (
              <div key={s.id} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-400 text-xs w-20 shrink-0">
                  {new Date(s.date).toLocaleDateString("en-AU", { day:"numeric", month:"short" })}
                </span>
                <span className="flex-1 text-gray-700 truncate">{s.drillName}</span>
                <span className="font-semibold text-green-700 shrink-0">{s.score}{s.unit ? ` ${s.unit}` : ""}</span>
                {s.index !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${r.bg} ${r.text}`}>
                    {Math.round(s.index)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ─── COMPLETE PROFILE SCREEN ──────────────────────────────────────────────────
function CompleteProfileScreen({ user, onComplete }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim()) return setError("Please enter your name.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");

    setLoading(true);
    setError("");

    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ display_name: name.trim(), profile_completed: true })
      .eq('id', user.id);

    if (profileErr) {
      setError("Could not save your name. Please try again.");
      setLoading(false);
      return;
    }

    const { error: passErr } = await supabase.auth.updateUser({ password });

    if (passErr) {
      setError("Could not set password. Please try again.");
      setLoading(false);
      return;
    }

    onComplete(name.trim());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⛳</div>
          <h1 className="text-2xl font-bold text-green-800">Welcome aboard!</h1>
          <p className="text-gray-500 text-sm mt-1">Set up your profile to get started.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose a password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Same password again"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Let's go ⛳"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("password"); // "password" | "magic"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handlePasswordSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  }

  async function handleMagicLink(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (err) setError(err.message);
    else setSent(true);
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) { setError("Enter your email address first."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (err) setError(err.message);
    else setForgotSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⛳</div>
          <h1 className="text-2xl font-bold text-green-800">Anthony Summers</h1>
          <p className="text-gray-500 text-sm mt-1">AS Performance Centre</p>
        </div>

        {forgotSent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📧</div>
            <p className="font-semibold text-gray-800 mb-2">Check your email</p>
            <p className="text-sm text-gray-500 mb-4">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <button
              onClick={() => { setForgotSent(false); setError(""); }}
              className="text-sm text-green-600 underline hover:text-green-800"
            >
              Back to sign in
            </button>
          </div>
        ) : sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📧</div>
            <p className="font-semibold text-gray-800 mb-2">Check your email</p>
            <p className="text-sm text-gray-500 mb-4">
              We sent a sign-in link to <strong>{email}</strong>
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-green-600 underline hover:text-green-800"
            >
              Try again
            </button>
          </div>
        ) : (
          <form onSubmit={mode === "password" ? handlePasswordSignIn : handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>

            {mode === "password" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                />
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-xs text-gray-400 hover:text-green-600 underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "password" ? "Sign In" : "Send Magic Link"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setMode(mode === "password" ? "magic" : "password"); setError(""); }}
                className="text-sm text-green-600 underline hover:text-green-800"
              >
                {mode === "password" ? "Send me a magic link instead" : "Sign in with password instead"}
              </button>
            </div>
          </form>
        )}
        <p className="text-center text-xs text-gray-400 mt-6">
          New here? Contact your coach to get set up.
        </p>
      </div>
    </div>
  );
}

// ─── SQUAD PANEL ─────────────────────────────────────────────────────────────
function SquadPanel({ authUser, profile, allLbEntries }) {
  const isAdmin = profile?.role === 'admin';
  const [squads, setSquads] = useState([]);
  const [activeSquadId, setActiveSquadId] = useState(null);
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSquadId, setInviteSquadId] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [inviteError, setInviteError] = useState('');
  const [expandedSquadPlayer, setExpandedSquadPlayer] = useState(null);

  useEffect(() => { loadSquads(); }, []);

  async function loadSquads() {
    setLoading(true);
    let q = supabase.from('squads').select('*');
    if (!isAdmin) q = q.eq('coach_id', authUser.id);
    const { data, error } = await q.order('name');
    if (error) { console.error(error); setLoading(false); return; }
    const list = data ?? [];
    setSquads(list);
    if (list.length) {
      setActiveSquadId(list[0].id);
      await loadMembers(list[0].id);
    }
    setLoading(false);
  }

  async function loadMembers(squadId) {
    const { data: memberRows, error: e1 } = await supabase
      .from('squad_members').select('user_id').eq('squad_id', squadId);
    if (e1) { console.error(e1); return; }
    if (!memberRows?.length) { setMembers(prev => ({ ...prev, [squadId]: [] })); return; }
    const ids = memberRows.map(r => r.user_id);
    const { data: profileRows, error: e2 } = await supabase
      .from('profiles').select('id, display_name, role').in('id', ids);
    if (e2) { console.error(e2); return; }
    setMembers(prev => ({ ...prev, [squadId]: profileRows ?? [] }));
  }

  async function handleSquadChange(squadId) {
    setActiveSquadId(squadId);
    setInviteStatus(null);
    setInviteEmail('');
    if (!members[squadId]) await loadMembers(squadId);
  }

  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    setInviteStatus(null);
    setInviteError('');
    const body = { email: inviteEmail, redirect_to: window.location.origin };
    if (inviteSquadId) body.squad_id = inviteSquadId;
    const { error } = await supabase.functions.invoke('invite-player', { body });
    if (error) {
      setInviteError(error.message ?? 'Invite failed — edge function may not be deployed yet.');
      setInviteStatus('error');
    } else {
      setInviteStatus('sent');
      setInviteEmail('');
      if (inviteSquadId) await loadMembers(inviteSquadId);
    }
    setInviting(false);
  }

  if (loading) return <p className="text-center text-gray-400 py-12">Loading squad…</p>;

  if (!squads.length) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">👥</div>
      <p className="text-gray-500 font-medium">No squad found</p>
      <p className="text-gray-400 text-sm mt-1">Contact Anthony to get your squad configured.</p>
    </div>
  );

  const currentSquad = squads.find(s => s.id === activeSquadId);
  const currentMembers = members[activeSquadId] ?? [];

  const memberNames = new Set(currentMembers.map(p => p.display_name).filter(Boolean));
  const now = new Date();
  const cutoff30 = new Date(now); cutoff30.setDate(now.getDate() - 60);
  const cutoff14 = new Date(now); cutoff14.setDate(now.getDate() - 14);
  const cutoff30Str = cutoff30.toISOString().split('T')[0];
  const cutoff14Str = cutoff14.toISOString().split('T')[0];
  const squadEntries30 = allLbEntries.filter(e => memberNames.has(e.player) && e.date >= cutoff30Str);
  const SQUAD_CATS = ['Putting', 'Chipping', 'Pitching', 'Bunker', 'Mixed'];
  const catStats = SQUAD_CATS.map(cat => {
    const catEntries = squadEntries30.filter(e => DRILL_CATEGORY[e.drill_id] === cat);
    const withIdx = catEntries.filter(e => e.index_score !== null);
    const avg = withIdx.length ? Math.round(withIdx.reduce((a, b) => a + b.index_score, 0) / withIdx.length) : null;
    const noRecentActivity = catEntries.length > 0 && !catEntries.some(e => e.date >= cutoff14Str);
    return { cat, avg, count: catEntries.length, noRecentActivity };
  });
  const focusCat = catStats.filter(c => c.avg !== null).reduce((a, b) => (a === null || b.avg < a.avg) ? b : a, null);

  return (
    <div className="space-y-5">
      {isAdmin && squads.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {squads.map(s => (
            <button key={s.id} onClick={() => handleSquadChange(s.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeSquadId === s.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
              }`}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h2 className="text-xl font-bold text-green-800 mb-0.5">{currentSquad?.name}</h2>
        <p className="text-green-600 text-sm">{currentMembers.length} {currentMembers.length === 1 ? 'player' : 'players'}</p>
      </div>

      {currentMembers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Squad Overview</h3>
            <p className="text-xs text-gray-400">Last 60 days</p>
          </div>
          {allLbEntries.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No session data yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                {catStats.map(({ cat, avg, count, noRecentActivity }) => {
                  const piColor = avg === null ? 'text-gray-400' : avg >= 80 ? 'text-green-600' : avg >= 50 ? 'text-yellow-500' : 'text-red-500';
                  return (
                    <div key={cat} className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${CAT_COLOR[cat]}`}>{cat}</span>
                      <div className={`text-2xl font-bold leading-none mt-1 ${piColor}`}>{avg ?? '—'}</div>
                      <div className="text-xs text-gray-400">Squad avg</div>
                      <div className="text-xs text-gray-500">{count} session{count !== 1 ? 's' : ''}</div>
                      {noRecentActivity && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <span>⏰</span><span>No recent activity</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {focusCat && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="text-sm font-bold text-orange-800">Focus Area: {focusCat.cat}</p>
                    <p className="text-xs text-orange-600">Squad avg {focusCat.avg} — lowest performing category in the last 60 days</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Invite a Player</h3>
        <form onSubmit={handleInvite} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Squad (optional)</label>
            <select
              value={inviteSquadId}
              onChange={e => { setInviteSquadId(e.target.value); setInviteStatus(null); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            >
              {isAdmin && <option value="">No squad / Individual player</option>}
              {squads.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 flex-wrap">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={e => { setInviteEmail(e.target.value); setInviteStatus(null); }}
              placeholder="player@example.com"
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-500"
            />
            <button
              type="submit"
              disabled={inviting || !inviteEmail}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-green-700 disabled:opacity-50 shrink-0"
            >
              {inviting ? 'Sending…' : 'Send Invite'}
            </button>
          </div>
        </form>
        {inviteStatus === 'sent' && (
          <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {inviteSquadId
              ? `✅ Invite sent — player will be added to ${squads.find(s => s.id === inviteSquadId)?.name}.`
              : '✅ Invite sent — player will receive a sign-up link by email as an individual.'}
          </p>
        )}
        {inviteStatus === 'error' && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {inviteError}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          {inviteSquadId
            ? `Player receives a magic link to set their name and password, and is automatically added to ${squads.find(s => s.id === inviteSquadId)?.name}.`
            : 'Player receives a magic link to set their name and password.'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Squad Members</h3>
        {currentMembers.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No players yet — use the invite form above to add your first player.</p>
        ) : (
          <div className="space-y-2">
            {[...currentMembers].sort((a, b) => {
              const avgFor = name => {
                const entries = allLbEntries.filter(e => e.player === name && e.index_score !== null);
                return entries.length ? entries.reduce((s, e) => s + e.index_score, 0) / entries.length : -1;
              };
              return avgFor(b.display_name) - avgFor(a.display_name);
            }).map(p => {
              const roleLabel = p.role === 'admin' ? 'Admin' : p.role === 'coach' ? 'Coach' : 'Player';
              const roleColor = p.role === 'admin'
                ? 'bg-purple-100 text-purple-700'
                : p.role === 'coach'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700';
              const isExpanded = expandedSquadPlayer === p.display_name;
              const piEntries = allLbEntries.filter(e => e.player === p.display_name && e.index_score !== null);
              const playerPiAvg = piEntries.length ? Math.round(piEntries.reduce((s, e) => s + e.index_score, 0) / piEntries.length) : null;
              const piR = ratingColor(playerPiAvg);
              return (
                <div key={p.id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div
                    onClick={() => setExpandedSquadPlayer(isExpanded ? null : p.display_name)}
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-sm shrink-0">
                      {(p.display_name ?? '?')[0].toUpperCase()}
                    </div>
                    <span className="flex-1 font-medium text-gray-800">{p.display_name ?? 'Unknown'}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${playerPiAvg !== null ? `${piR.bg} ${piR.text}` : 'bg-gray-100 text-gray-400'}`}>
                      {playerPiAvg ?? '—'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${roleColor}`}>
                      {roleLabel}
                    </span>
                    <span className="text-gray-300 text-xs shrink-0">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  {isExpanded && (
                    <PlayerDrillBreakdown
                      playerName={p.display_name}
                      allEntries={allLbEntries}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PASSWORD RESET SCREEN ────────────────────────────────────────────────────
function PasswordResetScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    setDone(true);
    setTimeout(onDone, 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-green-800">Set New Password</h1>
          <p className="text-gray-500 text-sm mt-1">AS Performance Centre</p>
        </div>
        {done ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-gray-800">Password updated!</p>
            <p className="text-sm text-gray-500 mt-2">Taking you to the app…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Updating…" : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);
  const player = profile?.display_name ?? null;
  const [sessions, setSessions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [allLbEntries, setAllLbEntries] = useState([]);
  const [piRanking, setPiRanking] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ drillId:"", drillCategory:"", score:"", notes:"", date:today() });
  const [filterDrill, setFilterDrill] = useState("");
  const [lbDrill, setLbDrill] = useState(DRILLS[0].id);
  const [lbCategory, setLbCategory] = useState("All");
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guideSearch, setGuideSearch] = useState("");
  const [statsSection, setStatsSection] = useState("overview");
  const [showSwedishScorecard, setShowSwedishScorecard] = useState(false);
  const [showPar72Scorecard, setShowPar72Scorecard] = useState(false);
  const [showPelzScorecard, setShowPelzScorecard] = useState(false);
  const [showProximityScorecard, setShowProximityScorecard] = useState(false);
  const [showNegativeScorecard, setShowNegativeScorecard] = useState(false);
  const [showJuniorPuttingScorecard, setShowJuniorPuttingScorecard] = useState(false);
  const [showJuniorShortGameScorecard, setShowJuniorShortGameScorecard] = useState(false);
  const [showSundayStandardScorecard, setShowSundayStandardScorecard] = useState(false);
  const [showSwedishQuickFireScorecard, setShowSwedishQuickFireScorecard] = useState(false);
  const [showPelzSnapshotScorecard, setShowPelzSnapshotScorecard] = useState(false);
  const [showBroadieChaseScorecard, setShowBroadieChaseScorecard] = useState(false);
  const [showPointsRaceScorecard, setShowPointsRaceScorecard] = useState(false);
  const [showBroadieTestScorecard, setShowBroadieTestScorecard] = useState(false);
  const [showLukeDonaldScorecard, setShowLukeDonaldScorecard] = useState(false);
  const [showGauntletScorecard, setShowGauntletScorecard] = useState(false);
  const [show250ChallengeScorecard, setShow250ChallengeScorecard] = useState(false);
  const [showSuddenDeathCarouselScorecard, setShowSuddenDeathCarouselScorecard] = useState(false);
  const [showDrawbackGauntletScorecard, setShowDrawbackGauntletScorecard] = useState(false);
  const [showJaggedPeaksScorecard, setShowJaggedPeaksScorecard] = useState(false);
  const [showAscentScorecard, setShowAscentScorecard] = useState(false);
  const [showAnchorScorecard, setShowAnchorScorecard] = useState(false);
  const [showCrucibleScorecard, setShowCrucibleScorecard] = useState(false);
  const [showSniperSchoolScorecard, setShowSniperSchoolScorecard] = useState(false);
  const [showHoleAllDistancesScorecard, setShowHoleAllDistancesScorecard] = useState(false);
  const [showLieMixScorecard, setShowLieMixScorecard] = useState(false);
  const [showTapToToggleScorecard, setShowTapToToggleScorecard] = useState(false);
  const [showSpiralHoleOutScorecard, setShowSpiralHoleOutScorecard] = useState(false);
  const [showEliminatorScorecard, setShowEliminatorScorecard] = useState(false);
  const [showGateCompletionScorecard, setShowGateCompletionScorecard] = useState(false);
  const [showBankDrillScorecard, setShowBankDrillScorecard] = useState(false);
  const [showNineHoleChippingScorecard, setShowNineHoleChippingScorecard] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [failedSession, setFailedSession] = useState(null);

  useEffect(() => {
    let active = true;

    // getSession() deadlocks when TOKEN_REFRESHED is in progress — both compete for
    // the same internal Supabase session lock. onAuthStateChange already delivers the
    // session on every event (INITIAL_SESSION, TOKEN_REFRESHED, SIGNED_IN, SIGNED_OUT),
    // so we use it as the sole source of truth and clear authLoading synchronously there.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === 'PASSWORD_RECOVERY') {
        setAuthUser(session.user);
        setNeedsPasswordReset(true);
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data: p }) => { if (active) setProfile(p ?? null); });
        setAuthLoading(false);
        return;
      }

      if (session?.user) {
        setAuthUser(session.user);
        // Profile fetch is non-blocking — a slow or failing query won't freeze the app.
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data: p }) => { if (active) setProfile(p ?? null); });
      } else {
        setAuthUser(null);
        setProfile(null);
      }

      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => { if (player) loadAll(); }, [player]);
  useEffect(() => { if (player && tab === "leaderboard") loadLeaderboard(); }, [lbDrill, tab]);
  useEffect(() => {
    if (player && tab === "squad" && allLbEntries.length === 0) {
      DB.getAllLeaderboardEntries().then(all => setAllLbEntries(all));
    }
  }, [tab, player]);

  async function loadAll() {
    setLoading(true);
    const rows = await DB.getSessions();
    setSessions(rows.filter(r => r.user_id === authUser.id).map(r => ({
      id:r.id, player:r.player, drillId:r.drill_id, drillName:r.drill_name,
      score:r.score, unit:r.unit, dir:r.dir, index:r.index_score, notes:r.notes, date:r.date,
    })));
    setLoading(false);
  }

  async function loadLeaderboard() {
    const entries = await DB.getLeaderboard(lbDrill);
    setLeaderboard(entries);
    const ranking = await DB.getPIRanking();
    setPiRanking(ranking);
    const all = await DB.getAllLeaderboardEntries();
    setAllLbEntries(all);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthUser(null);
    setProfile(null);
  }

  async function saveSession() {
    if (!form.drillId || form.score === "") return;
    const drill = DRILLS.find(d => d.id === +form.drillId);
    const idx = calcIndex(drill, form.score);
    const session = {
      id:Date.now(), player, drillId:+form.drillId, drillName:drill.name,
      score:parseFloat(form.score), unit:drill.unit, dir:drill.dir,
      index:idx !== null ? Math.round(idx) : null,
      notes:form.notes, date:form.date,
    };
    await DB.addSession(session);
    setSessions([session, ...sessions]);
    setShowAdd(false);
    setForm({ drillId:"", drillCategory:"", score:"", notes:"", date:today() });
  }

  async function autoSaveSession(score) {
    if (!form.drillId) return;
    const drill = DRILLS.find(d => d.id === +form.drillId);
    const idx = calcIndex(drill, score);
    const session = {
      id:Date.now(), player, drillId:+form.drillId, drillName:drill.name,
      score:parseFloat(score), unit:drill.unit, dir:drill.dir,
      index:idx !== null ? Math.round(idx) : null,
      notes:form.notes, date:form.date,
    };
    setSaveStatus("saving");
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('sessions').insert([{
      id: session.id, player: session.player, drill_id: session.drillId,
      drill_name: session.drillName, score: session.score, unit: session.unit,
      dir: session.dir, index_score: session.index, notes: session.notes, date: session.date,
      user_id: user.id,
    }]);
    if (error) {
      console.error(error);
      setSaveStatus("error");
      setFailedSession(session);
      return;
    }
    setSessions(prev => [session, ...prev]);
    setSaveStatus("idle");
    setShowAdd(false);
    setForm({ drillId:"", drillCategory:"", score:"", notes:"", date:today() });
  }

  async function retrySession() {
    if (!failedSession) return;
    setSaveStatus("saving");
    await DB.addSession(failedSession);
    setSessions(prev => [failedSession, ...prev]);
    setSaveStatus("idle");
    setFailedSession(null);
  }

  async function deleteSession(s) {
    if (!window.confirm(`Delete "${s.drillName}" on ${new Date(s.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}? This cannot be undone.`)) return;
    await DB.deleteSession(s.id);
    setSessions(sessions.filter(x => x.id !== s.id));
  }

  async function saveNote(id) {
    const { error } = await supabase.from('sessions').update({ notes: noteInput }).eq('id', id);
    if (error) { console.error(error); return; }
    setSessions(sessions.map(s => s.id === id ? { ...s, notes: noteInput } : s));
    setEditingNoteId(null);
    setNoteInput("");
  }

  // ── Auth guards ───────────────────────────────────────────────────────────────
  if (authLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-5xl mb-4">⛳</div>
        <p className="text-green-200 text-sm">Loading…</p>
      </div>
    </div>
  );

  if (!authUser) return <LoginScreen />;

  if (needsPasswordReset) return (
    <PasswordResetScreen onDone={() => setNeedsPasswordReset(false)} />
  );

  const needsProfileCompletion = profile && !profile.profile_completed;

  if (needsProfileCompletion) return (
    <CompleteProfileScreen
      user={authUser}
      onComplete={name => setProfile(p => ({ ...p, display_name: name }))}
    />
  );

  if (!profile) return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">⛳</div>
        <p className="font-semibold text-gray-800 mb-2">Account setup in progress</p>
        <p className="text-sm text-gray-500 mb-4">Your profile is being configured. Contact Anthony if this persists.</p>
        <button onClick={handleSignOut} className="text-sm text-green-600 underline">Sign out</button>
      </div>
    </div>
  );

  const isCoachOrAdmin = profile?.role === 'coach' || profile?.role === 'admin';

  const isSwedish = +form.drillId === 93;
  const isPar72 = +form.drillId === 2;
  const isPelz = +form.drillId === 9;
  const isProximity = [1, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29, 30, 31, 32, 37, 76, 77, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 96, 97, 105].includes(+form.drillId);
  const isNegative = [22, 23].includes(+form.drillId);
  const isJuniorPutting = +form.drillId === 78;
  const isJuniorShortGame = +form.drillId === 79;
  const isSundayStandard = +form.drillId === 42;
  const isSwedishQuickFire = +form.drillId === 94;
  const isPelzSnapshot = +form.drillId === 95;
  const isBroadieChase = [70, 71, 72].includes(+form.drillId);
  const isPointsRace = +form.drillId === 69;
  const isBroadieTest = [73, 74, 75].includes(+form.drillId);
  const isLukeDonald = +form.drillId === 49;
  const isGauntlet = +form.drillId === 33;
  const is250Challenge = +form.drillId === 34;
  const isSuddenDeathCarousel = +form.drillId === 35;
  const isDrawbackGauntlet = [36, 68].includes(+form.drillId);
  const isJaggedPeaks = +form.drillId === 45;
  const isAscent = +form.drillId === 99;
  const isAnchor = +form.drillId === 63;
  const isCrucible = [64, 65, 66].includes(+form.drillId);
  const isSniperSchool = +form.drillId === 67;
  const isHoleAllDistances = [53, 54, 55, 56, 57, 58, 59].includes(+form.drillId);
  const isLieMix = [80, 81, 82].includes(+form.drillId);
  const isTapToToggle = [60, 61, 62, 98].includes(+form.drillId);
  const isSpiralHoleOut = +form.drillId === 44;
  const isEliminator = [46, 47, 48].includes(+form.drillId);
  const isGateCompletion = [50, 51, 52, 103, 104].includes(+form.drillId);
  const isBankDrill = [101, 102].includes(+form.drillId);
  const isNineHoleChipping = +form.drillId === 3;
  const isScorecardDrill = isSwedish || isPar72 || isPelz || isProximity || isNegative || isJuniorPutting || isJuniorShortGame || isSundayStandard || isSwedishQuickFire || isPelzSnapshot || isBroadieChase || isPointsRace || isBroadieTest || isLukeDonald || isGauntlet || is250Challenge || isSuddenDeathCarousel || isDrawbackGauntlet || isJaggedPeaks || isAscent || isAnchor || isCrucible || isSniperSchool || isHoleAllDistances || isLieMix || isTapToToggle || isSpiralHoleOut || isEliminator || isGateCompletion || isBankDrill || isNineHoleChipping;
  const CRUCIBLE_CONFIGS = {
    64: { drillId: 64, title: "Crucible — The Gridlock (4–6ft)",  icon: "🔒", startDist: 4, finishDist: 6, cap: 60 },
    65: { drillId: 65, title: "Crucible — No Fly Zone (5–7ft)",   icon: "🚫", startDist: 5, finishDist: 7, cap: 80 },
    66: { drillId: 66, title: "Crucible — The Trenches (6–8ft)",  icon: "⚔️", startDist: 6, finishDist: 8, cap: 100 },
  };
  const filtered = filterDrill ? sessions.filter(s => s.drillId === +filterDrill) : sessions;

  function playerStats() {
    if (!sessions.length) return null;
    const withIndex = sessions.filter(s => s.index !== null);
    const avgIdx = withIndex.length ? Math.round(withIndex.reduce((a,b)=>a+b.index,0)/withIndex.length) : null;
    const best = withIndex.length ? Math.max(...withIndex.map(s=>s.index)) : null;
    const thisMonth = sessions.filter(s => s.date.startsWith(new Date().toISOString().slice(0,7)));
    return { total:sessions.length, avgIdx, best, thisMonth:thisMonth.length };
  }

  const stats = playerStats();

  const lbDrillsForCategory = lbCategory === "All"
    ? DRILLS
    : DRILLS.filter(d => DRILL_CATEGORY[d.id] === lbCategory);

  function handleLbCategoryChange(cat) {
    setLbCategory(cat);
    setExpandedPlayer(null);
    const first = cat === "All" ? DRILLS[0] : DRILLS.find(d => DRILL_CATEGORY[d.id] === cat);
    if (first) setLbDrill(first.id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showSwedishScorecard && (
        <SwedishScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowSwedishScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowSwedishScorecard(false)}
        />
      )}
      {showPar72Scorecard && (
        <Par72ScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPar72Scorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowPar72Scorecard(false)}
        />
      )}
      {showPelzScorecard && (
        <PelzScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPelzScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowPelzScorecard(false)}
        />
      )}
      {showProximityScorecard && isProximity && (
        <ProximityScorecardModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowProximityScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowProximityScorecard(false)}
        />
      )}
      {showNegativeScorecard && isNegative && (
        <NegativeScorecardModal
          drillId={+form.drillId}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowNegativeScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowNegativeScorecard(false)}
        />
      )}
      {showJuniorPuttingScorecard && (
        <JuniorPuttingScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowJuniorPuttingScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowJuniorPuttingScorecard(false)}
        />
      )}
      {showJuniorShortGameScorecard && (
        <JuniorShortGameScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowJuniorShortGameScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowJuniorShortGameScorecard(false)}
        />
      )}
      {showSundayStandardScorecard && (
        <SundayStandardScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowSundayStandardScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowSundayStandardScorecard(false)}
        />
      )}
      {showSwedishQuickFireScorecard && (
        <SwedishQuickFireScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowSwedishQuickFireScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowSwedishQuickFireScorecard(false)}
        />
      )}
      {showPelzSnapshotScorecard && (
        <PelzSnapshotScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPelzSnapshotScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowPelzSnapshotScorecard(false)}
        />
      )}
      {showBroadieChaseScorecard && isBroadieChase && (
        <BroadieChaseModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowBroadieChaseScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowBroadieChaseScorecard(false)}
        />
      )}
      {showPointsRaceScorecard && (
        <PointsRaceScorecardModal
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPointsRaceScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowPointsRaceScorecard(false)}
        />
      )}
      {showBroadieTestScorecard && isBroadieTest && (
        <BroadieTestModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowBroadieTestScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowBroadieTestScorecard(false)}
        />
      )}
      {showLukeDonaldScorecard && (
        <LukeDonaldScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowLukeDonaldScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowLukeDonaldScorecard(false)}
        />
      )}
      {showGauntletScorecard && (
        <GauntletScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowGauntletScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowGauntletScorecard(false)}
        />
      )}
      {show250ChallengeScorecard && (
        <Challenge250ScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShow250ChallengeScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShow250ChallengeScorecard(false)}
        />
      )}
      {showSuddenDeathCarouselScorecard && (
        <SuddenDeathCarouselModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowSuddenDeathCarouselScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowSuddenDeathCarouselScorecard(false)}
        />
      )}
      {showDrawbackGauntletScorecard && isDrawbackGauntlet && (
        <DrawbackGauntletModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowDrawbackGauntletScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowDrawbackGauntletScorecard(false)}
        />
      )}
      {showJaggedPeaksScorecard && (
        <JaggedPeaksModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowJaggedPeaksScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowJaggedPeaksScorecard(false)}
        />
      )}
      {showAscentScorecard && (
        <AscentModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowAscentScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowAscentScorecard(false)}
        />
      )}
      {showAnchorScorecard && (
        <AnchorModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowAnchorScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowAnchorScorecard(false)}
        />
      )}
      {showCrucibleScorecard && isCrucible && (
        <CrucibleModal
          config={CRUCIBLE_CONFIGS[+form.drillId]}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowCrucibleScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowCrucibleScorecard(false)}
        />
      )}
      {showSniperSchoolScorecard && (
        <SniperSchoolModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowSniperSchoolScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowSniperSchoolScorecard(false)}
        />
      )}
      {showHoleAllDistancesScorecard && isHoleAllDistances && (
        <HoleAllDistancesModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowHoleAllDistancesScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowHoleAllDistancesScorecard(false)}
        />
      )}
      {showLieMixScorecard && isLieMix && (
        <LieMixScorecardModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowLieMixScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowLieMixScorecard(false)}
        />
      )}
      {showTapToToggleScorecard && isTapToToggle && (
        <TapToToggleModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowTapToToggleScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowTapToToggleScorecard(false)}
        />
      )}
      {showSpiralHoleOutScorecard && (
        <SpiralHoleOutModal
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowSpiralHoleOutScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowSpiralHoleOutScorecard(false)}
        />
      )}
      {showEliminatorScorecard && isEliminator && (
        <EliminatorModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowEliminatorScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowEliminatorScorecard(false)}
        />
      )}
      {showGateCompletionScorecard && isGateCompletion && (
        <GateCompletionModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowGateCompletionScorecard(false); autoSaveSession(total); }}
          onCancel={() => setShowGateCompletionScorecard(false)}
        />
      )}
      {showNineHoleChippingScorecard && (
        <NineHoleChippingModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowNineHoleChippingScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowNineHoleChippingScorecard(false)}
        />
      )}
      {showBankDrillScorecard && isBankDrill && (
        <BankDrillModal
          drillId={+form.drillId}
          drill={DRILLS.find(d => d.id === +form.drillId)}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowBankDrillScorecard(false);
            autoSaveSession(total);
          }}
          onCancel={() => setShowBankDrillScorecard(false)}
        />
      )}
      {/* Header */}
      <div className="bg-green-800 text-white px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold">⛳ AS Performance Centre</h1>
            <p className="text-green-300 text-sm">Welcome, <strong>{player}</strong></p>
          </div>
          <button onClick={handleSignOut} className="text-green-300 text-sm hover:text-white underline">
            Sign Out
          </button>
        </div>
      </div>

      {/* Nav tabs — Dashboard is now first */}
      <div className="bg-white border-b shadow-sm overflow-x-auto">
        <div className="max-w-5xl mx-auto flex">
          {[
            ["dashboard","🏠 Dashboard"],
            ["log","📋 Session Log"],
            ["stats","📊 My Stats"],
            ["leaderboard","🏆 Leaderboard"],
            ["guide","📖 Drill Guide"],
            ...(isCoachOrAdmin ? [["squad","👥 Squad"]] : []),
          ].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${tab===k?"border-green-600 text-green-700":"border-transparent text-gray-500 hover:text-gray-700"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}

        {/* ── DASHBOARD ───────────────────────────────────────────────────────── */}
        {!loading && tab === "dashboard" && (
          <DashboardPanel
            sessions={sessions}
            player={player}
            onGoToLog={() => setTab("log")}
          />
        )}

        {/* ── SESSION LOG ─────────────────────────────────────────────────────── */}
        {!loading && tab === "log" && (
          <div>
            {saveStatus === "saving" && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 text-sm text-green-700">
                <svg className="animate-spin h-4 w-4 text-green-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Saving session…
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
                <span>⚠️ Session didn't save — tap to retry</span>
                <button
                  onClick={retrySession}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-700 shrink-0"
                >
                  Retry
                </button>
              </div>
            )}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[["Total Sessions",stats.total],["This Month",stats.thisMonth],["Avg Index",stats.avgIdx??"—"],["Best Index",stats.best??"—"]].map(([l,v]) => (
                  <div key={l} className="bg-white rounded-lg shadow-sm p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">{v}</div>
                    <div className="text-xs text-gray-500 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={() => setShowAdd(!showAdd)} className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700">
                + Add Session
              </button>
              <select value={filterDrill} onChange={e => setFilterDrill(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-0">
                <option value="">All drills</option>
                {DRILLS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            {showAdd && (
              <div className="bg-white rounded-xl shadow-md p-5 mb-5 border border-green-100">
                <h3 className="font-semibold text-lg mb-4 text-green-800">New Practice Session</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Drill</label>
  <div className="flex flex-wrap gap-2 mb-2">
    {["Putting","Chipping","Pitching","Bunker","Mixed"].map(cat => (
      <button
        type="button"
        key={cat}
        onClick={() => setForm({...form, drillCategory: cat, drillId: ""})}
        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${form.drillCategory === cat ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-300 hover:border-green-400"}`}>
        {cat}
      </button>
    ))}
  </div>
  {form.drillCategory && (
    <select value={form.drillId} onChange={e => setForm({...form, drillId:e.target.value, score:""})}
      className="w-full border border-gray-300 rounded-lg px-3 py-2">
      <option value="">Select drill...</option>
      {DRILLS.filter(d => DRILL_CATEGORY[d.id] === form.drillCategory).map(d => (
        <option key={d.id} value={d.id}>{d.name}</option>
      ))}
    </select>
  )}
</div>
                  <div>
                    <DrillHistoryPanel drillId={+form.drillId || null} sessions={sessions} />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score {form.drillId && !isSwedish && !isPar72 && !isPelz && !isProximity && !isNegative && !isJuniorPutting && !isJuniorShortGame && !isSundayStandard && !isSwedishQuickFire && !isPelzSnapshot && !isBroadieChase && !isPointsRace && !isBroadieTest && !isLukeDonald && !isGauntlet && !is250Challenge && !isSuddenDeathCarousel && !isDrawbackGauntlet && !isJaggedPeaks && !isAscent && !isAnchor && !isCrucible && !isSniperSchool && !isHoleAllDistances && !isLieMix && !isTapToToggle && !isSpiralHoleOut && !isEliminator && !isGateCompletion && DRILLS.find(d=>d.id===+form.drillId)?.unit ? `(${DRILLS.find(d=>d.id===+form.drillId).unit})` : ""}
                    </label>
                    {isSwedish ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowSwedishScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🇸🇪 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button
                              type="button"
                              onClick={() => setShowSwedishScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isPar72 ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowPar72Scorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          ⛳ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score}
                            <button
                              type="button"
                              onClick={() => setShowPar72Scorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isPelz ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowPelzScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🏌️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button
                              type="button"
                              onClick={() => setShowPelzScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isProximity ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowProximityScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          📏 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} ft
                            <button
                              type="button"
                              onClick={() => setShowProximityScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isNegative ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowNegativeScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🤠 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score}
                            <button
                              type="button"
                              onClick={() => setShowNegativeScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isJuniorPutting ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowJuniorPuttingScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🟢 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button
                              type="button"
                              onClick={() => setShowJuniorPuttingScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isJuniorShortGame ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowJuniorShortGameScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🏌️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button
                              type="button"
                              onClick={() => setShowJuniorShortGameScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isSundayStandard ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowSundayStandardScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          📋 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} / 48
                            <button
                              type="button"
                              onClick={() => setShowSundayStandardScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isSwedishQuickFire ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowSwedishQuickFireScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🇸🇪 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button
                              type="button"
                              onClick={() => setShowSwedishQuickFireScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isPelzSnapshot ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowPelzSnapshotScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🏌️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button
                              type="button"
                              onClick={() => setShowPelzSnapshotScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isBroadieChase ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowBroadieChaseScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🏌️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button
                              type="button"
                              onClick={() => setShowBroadieChaseScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isPointsRace ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowPointsRaceScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button
                              type="button"
                              onClick={() => setShowPointsRaceScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isBroadieTest ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowBroadieTestScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🏌️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button
                              type="button"
                              onClick={() => setShowBroadieTestScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isLukeDonald ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowLukeDonaldScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} / 20
                            <button
                              type="button"
                              onClick={() => setShowLukeDonaldScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isGauntlet ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowGauntletScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} / 18
                            <button
                              type="button"
                              onClick={() => setShowGauntletScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : is250Challenge ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShow250ChallengeScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          📏 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score}ft
                            <button
                              type="button"
                              onClick={() => setShow250ChallengeScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isSuddenDeathCarousel ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowSuddenDeathCarouselScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} holed
                            <button
                              type="button"
                              onClick={() => setShowSuddenDeathCarouselScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isDrawbackGauntlet ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowDrawbackGauntletScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🔄 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button
                              type="button"
                              onClick={() => setShowDrawbackGauntletScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isJaggedPeaks ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowJaggedPeaksScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          ⛰️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button
                              type="button"
                              onClick={() => setShowJaggedPeaksScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isAscent ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowAscentScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm"
                        >
                          🧗 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score}ft
                            <button
                              type="button"
                              onClick={() => setShowAscentScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700"
                            >Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isAnchor ? (
                      <div>
                        <button type="button" onClick={() => setShowAnchorScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          ⚓ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button type="button" onClick={() => setShowAnchorScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isCrucible ? (
                      <div>
                        <button type="button" onClick={() => setShowCrucibleScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          {CRUCIBLE_CONFIGS[+form.drillId]?.icon} Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button type="button" onClick={() => setShowCrucibleScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isSniperSchool ? (
                      <div>
                        <button type="button" onClick={() => setShowSniperSchoolScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button type="button" onClick={() => setShowSniperSchoolScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isHoleAllDistances ? (
                      <div>
                        <button type="button" onClick={() => setShowHoleAllDistancesScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button type="button" onClick={() => setShowHoleAllDistancesScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isLieMix ? (
                      <div>
                        <button type="button" onClick={() => setShowLieMixScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          ⛱️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button type="button" onClick={() => setShowLieMixScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isTapToToggle ? (
                      <div>
                        <button type="button" onClick={() => setShowTapToToggleScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} holed
                            <button type="button" onClick={() => setShowTapToToggleScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isSpiralHoleOut ? (
                      <div>
                        <button type="button" onClick={() => setShowSpiralHoleOutScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🌀 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} / 18
                            <button type="button" onClick={() => setShowSpiralHoleOutScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isEliminator ? (
                      <div>
                        <button type="button" onClick={() => setShowEliminatorScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button type="button" onClick={() => setShowEliminatorScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isGateCompletion ? (
                      <div>
                        <button type="button" onClick={() => setShowGateCompletionScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🚪 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button type="button" onClick={() => setShowGateCompletionScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isNineHoleChipping ? (
                      <div>
                        <button type="button" onClick={() => setShowNineHoleChippingScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🏌️ Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} pts
                            <button type="button" onClick={() => setShowNineHoleChippingScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : isBankDrill ? (
                      <div>
                        <button type="button" onClick={() => setShowBankDrillScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🏦 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} shots
                            <button type="button" onClick={() => setShowBankDrillScorecard(true)}
                              className="ml-2 text-xs underline text-gray-500 hover:text-gray-700">Edit</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input type="number" step="0.1" value={form.score}
                        onChange={e => setForm({...form, score:e.target.value})}
                        placeholder="Enter score..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    )}
                    {form.drillId && form.score !== "" && (() => {
                      const d = DRILLS.find(x => x.id === +form.drillId);
                      const idx = calcIndex(d, form.score);
                      if (idx === null) return null;
                      const r = ratingColor(idx);
                      return (
                        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2 ${r.bg} ${r.text}`}>
                          <span className={`w-2 h-2 rounded-full ${r.dot}`}></span>
                          Performance Index: {Math.round(idx)} / 100
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input type="text" value={form.notes} onChange={e => setForm({...form, notes:e.target.value})}
                      placeholder="Optional notes..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                {form.drillId && (() => {
                  const d = DRILLS.find(x => x.id === +form.drillId);
                  return (
                    <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                      <strong>📖 How to play:</strong> {d.notes}
                    </div>
                  );
                })()}
                <div className="flex gap-3 mt-4">
                  {!isScorecardDrill && (
                    <button onClick={saveSession} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">Save</button>
                  )}
                  <button onClick={() => setShowAdd(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                </div>
              </div>
            )}
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No sessions yet. Add your first session above!</p>
            ) : (
              <div className="space-y-3">
                {filtered.map(s => {
                  const r = ratingColor(s.index);
                  return (
                    <div key={s.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${s.index>=80?"border-green-400":s.index>=50?"border-yellow-400":s.index!==null?"border-red-400":"border-gray-200"} p-4 flex items-start justify-between gap-4`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800">{s.drillName}</span>
                          {s.index !== null && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${r.bg} ${r.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`}></span>
                              {Math.round(s.index)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                          <span>{new Date(s.date).toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</span>
                          <span className="font-bold text-green-700 text-base">{s.score}{s.unit ? ` ${s.unit}` : ""}</span>
                          {s.notes && <span className="italic text-gray-400">"{s.notes}"</span>}
                        </div>
                        {!s.notes && editingNoteId !== s.id && (
                          <button
                            onClick={() => { setEditingNoteId(s.id); setNoteInput(""); }}
                            className="mt-1 text-xs text-green-600 underline"
                          >+ Add a note</button>
                        )}
                        {editingNoteId === s.id && (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              autoFocus
                              value={noteInput}
                              onChange={e => setNoteInput(e.target.value)}
                              placeholder="What went well? What needs work?"
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-green-500"
                            />
                            <button
                              onClick={() => saveNote(s.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700"
                            >Save</button>
                          </div>
                        )}
                      </div>
                      <button onClick={() => deleteSession(s)} className="text-red-400 hover:text-red-600 text-lg shrink-0">✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MY STATS ────────────────────────────────────────────────────────── */}
        {!loading && tab === "stats" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 {player}'s Progress</h2>
            {sessions.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No sessions logged yet.</p>
            ) : (
              <>
                <div className="flex gap-2 mb-5 flex-wrap">
                  {[["overview","📈 Overview"],["drills","🏌️ By Drill"],["bests","🏅 Personal Bests"]].map(([k,l]) => (
                    <button key={k} onClick={() => setStatsSection(k)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${statsSection===k?"bg-green-600 text-white border-green-600":"bg-white text-gray-600 border-gray-300 hover:border-green-400"}`}>
                      {l}
                    </button>
                  ))}
                </div>
                {statsSection === "overview" && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">Overall Performance Index — All Sessions</h3>
                      <OverallTrendChart sessions={sessions} />
                      <div className="flex gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Green (80–100)</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> Yellow (50–79)</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span> Red (0–49)</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">Avg Index by Category</h3>
                      <CategoryStatsPanel sessions={sessions} />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">🏅 Milestones & Badges</h3>
                      <MilestoneBadges sessions={sessions} />
                    </div>
                  </div>
                )}
                {statsSection === "drills" && (
                  <div className="space-y-3">
                    {DRILLS.map(drill => {
                      const ds = sessions.filter(s => s.drillId === drill.id);
                      if (!ds.length) return null;
                      const withIdx = ds.filter(s => s.index !== null);
                      const avgIdx = withIdx.length ? Math.round(withIdx.reduce((a,b)=>a+b.index,0)/withIdx.length) : null;
                      const best = drill.dir === "lower" ? Math.min(...ds.map(s=>s.score)) : Math.max(...ds.map(s=>s.score));
                      const r = ratingColor(avgIdx);
                      const cat = DRILL_CATEGORY[drill.id];
                      const trendPts = withIdx.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(s=>({y:s.index}));
                      return (
                        <div key={drill.id} className="bg-white rounded-xl shadow-sm p-4">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs px-2 py-0.5 rounded font-medium ${CAT_COLOR[cat]}`}>{cat}</span>
                                <span className="font-semibold text-gray-800">{drill.name}</span>
                                {avgIdx !== null && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${r.bg} ${r.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`}></span>
                                    Avg: {avgIdx}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                                <span>Sessions: <strong>{ds.length}</strong></span>
                                <span>Best: <strong className="text-green-700">{best}{drill.unit ? ` ${drill.unit}` : ""}</strong></span>
                                <span>Latest: <strong>{ds[0].score}{drill.unit ? ` ${drill.unit}` : ""}</strong></span>
                              </div>
                            </div>
                            <div className="flex items-end gap-1 h-8">
                              {ds.slice(0,8).reverse().map((s,i) => {
                                const h = s.index !== null ? Math.max(4, Math.round(s.index * 0.32)) : 8;
                                const c = s.index>=80?"bg-green-400":s.index>=50?"bg-yellow-400":s.index!==null?"bg-red-400":"bg-gray-300";
                                return <div key={i} className={`w-3 rounded-sm ${c}`} style={{height:`${h}px`}}></div>;
                              })}
                            </div>
                          </div>
                          {trendPts.length >= 2 && (
                            <div className="mt-3 border-t border-gray-50 pt-3">
                              <MiniLineChart points={trendPts} color={avgIdx >= 80 ? "#16a34a" : avgIdx >= 50 ? "#ca8a04" : "#dc2626"} />
                            </div>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {ds.map(s => {
                              const sr = ratingColor(s.index);
                              return (
                                <span key={s.id} className={`text-xs px-2 py-1 rounded ${sr.bg} ${sr.text}`}>
                                  {new Date(s.date).toLocaleDateString("en-AU",{day:"numeric",month:"short"})} — {s.score}{drill.unit ? ` ${drill.unit}` : ""}
                                  {s.index !== null ? ` (${Math.round(s.index)})` : ""}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {statsSection === "bests" && (
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-700 mb-1">Personal Best Scores</h3>
                    <p className="text-xs text-gray-400 mb-4">Your best recorded score per drill, sorted by Performance Index.</p>
                    <PersonalBestsPanel sessions={sessions} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── DRILL GUIDE ─────────────────────────────────────────────────────── */}
        {!loading && tab === "guide" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">📖 Drill Guide</h2>
            <p className="text-gray-500 text-sm mb-4">How to play and scoring for all {DRILLS.length} drills.</p>
            <input type="text" placeholder="Search drills..." value={guideSearch}
              onChange={e => setGuideSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm" />
            <div className="space-y-3">
              {DRILLS.filter(d => d.name.toLowerCase().includes(guideSearch.toLowerCase())).map(drill => {
                const perfectLabel = drill.perfect !== null ? `${drill.perfect}${drill.unit ? ` ${drill.unit}` : ""}` : "N/A";
                const worstLabel = drill.worst !== null ? `${drill.worst}${drill.unit ? ` ${drill.unit}` : ""}` : "N/A";
                const cat = DRILL_CATEGORY[drill.id];
                return (
                  <div key={drill.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-gray-400">#{drill.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${CAT_COLOR[cat]}`}>{cat}</span>
                      <h3 className="font-semibold text-gray-800">{drill.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{drill.notes}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {drill.dir === "lower" ? "↓ Lower is better" : drill.dir === "higher" ? "↑ Higher is better" : "No index rating"}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">✅ Perfect: {perfectLabel}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">❌ Worst: {worstLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LEADERBOARD ─────────────────────────────────────────────────────── */}
        {!loading && tab === "leaderboard" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Leaderboard</h2>
            <div className="flex gap-2 flex-wrap mb-3">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => handleLbCategoryChange(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${lbCategory===cat?"bg-green-600 text-white border-green-600":"bg-white text-gray-600 border-gray-300 hover:border-green-400"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <select value={lbDrill} onChange={e => setLbDrill(+e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700">
                {lbDrillsForCategory.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            {(() => {
              const drill = DRILLS.find(d => d.id === lbDrill);
              const sorted = [...leaderboard].sort((a,b) => {
                if (a.index_score !== null && b.index_score !== null) return b.index_score - a.index_score;
                return drill?.dir === "lower" ? a.score - b.score : b.score - a.score;
              });
              if (!sorted.length) return <p className="text-center text-gray-400 py-12">No scores recorded for this drill yet.</p>;
              return (
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="bg-green-700 text-white px-4 py-3 text-sm font-semibold flex gap-4">
                    <span className="w-8">#</span>
                    <span className="flex-1">Player</span>
                    <span className="w-20 text-right">Score</span>
                    <span className="w-20 text-right">Index</span>
                    <span className="w-24 text-right">Date</span>
                  </div>
                  {sorted.map((e,i) => {
                    const r = ratingColor(e.index_score);
                    const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
                    return (
                      <div key={`${e.player}-${i}`}
                        className={`flex gap-4 px-4 py-3 items-center border-b border-gray-100 text-sm ${e.player===player?"bg-green-50":i%2===0?"bg-white":"bg-gray-50"}`}>
                        <span className="w-8 font-bold text-gray-500">{medal||`${i+1}`}</span>
                        <span className={`flex-1 font-medium ${e.player===player?"text-green-700":""}`}>
                          {e.player}{e.player===player?" (you)":""}
                        </span>
                        <span className="w-20 text-right font-semibold">{e.score}{drill.unit ? ` ${drill.unit}` : ""}</span>
                        <span className="w-20 text-right">
                          {e.index_score !== null
                            ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.bg} ${r.text}`}>{Math.round(e.index_score)}</span>
                            : "—"}
                        </span>
                        <span className="w-24 text-right text-gray-400">
                          {new Date(e.date).toLocaleDateString("en-AU",{day:"numeric",month:"short"})}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-1">Category Leaders</h3>
              <p className="text-xs text-gray-400 mb-3">Rolling average PI — last 60 days, up to 10 attempts, max 5 of the same drill. Minimum 5 attempts to qualify.</p>
              <CategoryLeaderboard
                allLbEntries={allLbEntries}
                currentPlayer={player}
                drillCategoryMap={DRILL_CATEGORY}
              />
            </div>
            {piRanking.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Overall Performance Index Ranking</h3>
                <p className="text-xs text-gray-400 mb-3">Click any player to see their drill-by-drill breakdown.</p>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-green-700 text-white px-4 py-3 text-sm font-semibold flex gap-4">
                    <span className="w-8">#</span>
                    <span className="flex-1">Player</span>
                    <span className="w-24 text-right">Avg Index</span>
                    <span className="w-24 text-right">Sessions</span>
                  </div>
                  {piRanking.map((r2,i) => {
                    const rc = ratingColor(r2.avg_index);
                    const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
                    const isExpanded = expandedPlayer === r2.player;
                    return (
                      <div key={r2.player}>
                        <div
                          onClick={() => setExpandedPlayer(isExpanded ? null : r2.player)}
                          className={`flex gap-4 px-4 py-3 items-center border-b border-gray-100 text-sm cursor-pointer hover:bg-green-50 transition-colors ${r2.player===player?"bg-green-50":i%2===0?"bg-white":"bg-gray-50"}`}>
                          <span className="w-8 font-bold text-gray-500">{medal||`${i+1}`}</span>
                          <span className={`flex-1 font-medium ${r2.player===player?"text-green-700":""}`}>
                            {r2.player}{r2.player===player?" (you)":""}
                          </span>
                          <span className="w-24 text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>{r2.avg_index}</span>
                          </span>
                          <span className="w-24 text-right text-gray-500 flex items-center justify-end gap-1">
                            {r2.session_count}
                            <span className="text-gray-300 text-xs">{isExpanded ? "▲" : "▼"}</span>
                          </span>
                        </div>
                        {isExpanded && (
                          <PlayerDrillBreakdown
                            playerName={r2.player}
                            allEntries={allLbEntries}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SQUAD ───────────────────────────────────────────────────────────── */}
        {tab === "squad" && isCoachOrAdmin && (
          <SquadPanel authUser={authUser} profile={profile} allLbEntries={allLbEntries} />
        )}
      </div>
    </div>
  );
}