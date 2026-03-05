import { useState, useEffect } from "react";
import { supabase } from './supabase';

// ─── DRILL DEFINITIONS ────────────────────────────────────────────────────────
const DRILLS = [
  { id:1,  name:"International Short Game",          type:"score",      unit:"ft",   dir:"lower",  perfect:30,  worst:100, notes:"Total proximity in feet" },
  { id:2,  name:"Par 72 Short Game",                 type:"score",      unit:"",     dir:"lower",  perfect:64,  worst:84,  notes:"Lower than par = better" },
  { id:3,  name:"100ft Putting (18 putts)",           type:"score",      unit:"",     dir:"lower",  perfect:18,  worst:9,   notes:"Count putts holed only" },
  { id:4,  name:"250ft Putting Challenge",            type:"score",      unit:"ft",   dir:"higher", perfect:150, worst:50,  notes:"Total feet holed" },
  { id:5,  name:"Par 21 Short Game Challenge",        type:"level",      unit:"lvl",  dir:"higher", perfect:10,  worst:1,   notes:"Level 1 pass = 50pts, +5 per level" },
  { id:6,  name:"20min Chipping Hole Out",            type:"count",      unit:"",     dir:"higher", perfect:10,  worst:0,   notes:"10+ = elite" },
  { id:7,  name:"4-10ft Putting Challenge",           type:"level",      unit:"ft",   dir:"higher", perfect:10,  worst:3,   notes:"Last distance holed" },
  { id:8,  name:"Hell Drill Putting",                 type:"completion", unit:"",     dir:null,     perfect:null,worst:null,notes:"Skipped from index" },
  { id:9,  name:"Proximity Challenge Putting",        type:"distance",   unit:"ft",   dir:"lower",  perfect:10,  worst:50,  notes:"Avg proximity in feet" },
  { id:10, name:"12 Putt Completion Drill",           type:"score",      unit:"",     dir:"lower",  perfect:1,   worst:5,   notes:"Attempts to complete" },
  { id:11, name:"No 3 Putts (9 holes)",               type:"score",      unit:"",     dir:"lower",  perfect:0,   worst:2,   notes:"Count of 3-putts" },
  { id:12, name:"5-15ft Putting Comp",                type:"score",      unit:"putts",dir:"lower",  perfect:2,   worst:12,  notes:"Putts to hole 25ft" },
  { id:13, name:"Chipping Comp",                      type:"score",      unit:"holes",dir:"lower",  perfect:2,   worst:10,  notes:"Holes needed to reach 6 points" },
  { id:14, name:"Chipping 10 Ball Basket",            type:"score",      unit:"shots",dir:"lower",  perfect:10,  worst:30,  notes:"Shots to get 10 in basket" },
  { id:15, name:"Chipping 10 Ball Basket - Hole Out", type:"score",      unit:"shots",dir:"lower",  perfect:10,  worst:50,  notes:"Shots to get 10 in basket" },
  { id:16, name:"Project 1 Putt Level 1",             type:"score",      unit:"",     dir:"lower",  perfect:16,  worst:30,  notes:"24 = pass mark" },
  { id:17, name:"Short Game/Pitching 10-100m",        type:"distance",   unit:"ft",   dir:"lower",  perfect:50,  worst:250, notes:"Total proximity, 10 shots" },
  { id:18, name:"Dave Pelz Short Game Challenge",     type:"points",     unit:"pts",  dir:"higher", perfect:155, worst:0,   notes:"Points based on proximity" },
  { id:19, name:"10 Shot Variety Challenge",          type:"distance",   unit:"m",    dir:"lower",  perfect:25,  worst:125, notes:"Total proximity, 10 shots" },
  { id:20, name:"48 Putt Challenge (PK)",             type:"score",      unit:"",     dir:"higher", perfect:48,  worst:0,   notes:"36 = excellent" },
  { id:21, name:"13 Tees Putting",                    type:"score",      unit:"",     dir:"higher", perfect:13,  worst:0,   notes:"Hole 10/12 to reach 13th" },
  { id:22, name:"5-15ft Hole Out Challenge",          type:"score",      unit:"",     dir:"higher", perfect:18,  worst:0,   notes:"18 = all holed" },
  { id:23, name:"Putting Star Ladder (Pro)",          type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:40,  notes:"Fewest putts to complete" },
  { id:24, name:"12ft Eliminator Putting",            type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:36,  notes:"Fewest putts to eliminate all" },
  { id:25, name:"4ft Eliminator Putting",             type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:16,  notes:"Fewest putts to eliminate all" },
  { id:26, name:"8ft Eliminator Putting",             type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:24,  notes:"Fewest putts to eliminate all" },
  { id:27, name:"Pitching 30-70m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:150, notes:"Total feet proximity" },
  { id:28, name:"Pitching 80-120m",                   type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:200, notes:"Total feet proximity" },
  { id:29, name:"Putting Luke Donald 4-8ft",          type:"score",      unit:"/20",  dir:"higher", perfect:20,  worst:0,   notes:"15 = tour average" },
  { id:30, name:"Putting Gate Drill",                 type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:20,  notes:"Putts to get 10 through gate" },
  { id:31, name:"Putting Gate Drill (R-L)",           type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:24,  notes:"Putts through gate into hole" },
  { id:32, name:"Putting Gate Drill (L-R)",           type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:24,  notes:"Putts through gate into hole" },
];
// ─── PERFORMANCE INDEX ────────────────────────────────────────────────────────
function calcIndex(drill, score) {
  if (drill.dir === null) return null;
  const s = parseFloat(score);
  if (isNaN(s)) return null;
  if (drill.id === 5) {
    if (s < 1) return 0;
    if (s === 1) return 50;
    return Math.min(100, 50 + (s - 1) * 5);
  }
  const { perfect, worst } = drill;
  const range = Math.abs(perfect - worst);
  if (range === 0) return 50;
  let raw;
  if (drill.dir === "lower") {
    raw = ((worst - s) / (worst - perfect)) * 100;
  } else {
    raw = ((s - worst) / (perfect - worst)) * 100;
  }
  return Math.max(0, Math.min(100, raw));
}

function ratingColor(idx) {
  if (idx === null) return { bg: "bg-gray-100", text: "text-gray-500", label: "N/A", dot: "bg-gray-400" };
  if (idx >= 80) return { bg: "bg-green-100", text: "text-green-700", label: "Green", dot: "bg-green-500" };
  if (idx >= 50) return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Yellow", dot: "bg-yellow-500" };
  return { bg: "bg-red-100", text: "text-red-700", label: "Red", dot: "bg-red-500" };
}

// ─── SUPABASE HELPERS ─────────────────────────────────────────────────────────


const DB = {
  async getSessions(player) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('player', player)
      .order('date', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
  },
  async addSession(session) {
    const { error } = await supabase.from('sessions').insert([{
      id: session.id,
      player: session.player,
      drill_id: session.drillId,
      drill_name: session.drillName,
      score: session.score,
      unit: session.unit,
      dir: session.dir,
      index_score: session.index,
      notes: session.notes,
      date: session.date,
    }]);
    if (error) console.error(error);
  },
  async deleteSession(id) {
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) console.error(error);
  },
  async getLeaderboard(drillId) {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('drill_id', drillId);
    if (error) { console.error(error); return []; }
    return data;
  },
  async getPIRanking() {
    const { data, error } = await supabase.from('pi_ranking').select('*');
    if (error) { console.error(error); return []; }
    return data;
  }
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("log");
  const [player, setPlayer] = useState(null);
  const [playerInput, setPlayerInput] = useState("");
  const [sessions, setSessions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [piRanking, setPiRanking] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ drillId: "", score: "", notes: "", date: today() });
  const [filterDrill, setFilterDrill] = useState("");
  const [lbDrill, setLbDrill] = useState(DRILLS[0].id);
  const [loading, setLoading] = useState(false);

  function today() { return new Date().toISOString().split("T")[0]; }

  useEffect(() => { if (player) loadAll(); }, [player]);
  useEffect(() => { if (player && tab === "leaderboard") loadLeaderboard(); }, [lbDrill, tab]);

  async function loadAll() {
    setLoading(true);
    const rows = await DB.getSessions(player);
    setSessions(rows.map(r => ({
      id: r.id, player: r.player, drillId: r.drill_id,
      drillName: r.drill_name, score: r.score, unit: r.unit,
      dir: r.dir, index: r.index_score, notes: r.notes, date: r.date
    })));
    setLoading(false);
  }

  async function loadLeaderboard() {
    const entries = await DB.getLeaderboard(lbDrill);
    setLeaderboard(entries);
    const ranking = await DB.getPIRanking();
    setPiRanking(ranking);
  }

  async function saveSession() {
    if (!form.drillId || form.score === "") return;
    const drill = DRILLS.find(d => d.id === +form.drillId);
    const idx = calcIndex(drill, form.score);
    const session = {
      id: Date.now(), player, drillId: +form.drillId,
      drillName: drill.name, score: parseFloat(form.score),
      unit: drill.unit, dir: drill.dir,
      index: idx !== null ? Math.round(idx) : null,
      notes: form.notes, date: form.date,
    };
    await DB.addSession(session);
    setSessions([session, ...sessions]);
    setShowAdd(false);
    setForm({ drillId: "", score: "", notes: "", date: today() });
  }

  async function deleteSession(s) {
    await DB.deleteSession(s.id);
    setSessions(sessions.filter(x => x.id !== s.id));
  }

  if (!player) return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">⛳</div>
        <h1 className="text-2xl font-bold text-green-800 mb-1">Anthony Summers</h1>
        <h2 className="text-lg text-gray-600 mb-6">Short Game Practice Hub</h2>
        <p className="text-sm text-gray-500 mb-4">Enter your name to get started</p>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg mb-4 focus:outline-none focus:border-green-500"
          placeholder="Your name..."
          value={playerInput}
          onChange={e => setPlayerInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && playerInput.trim() && setPlayer(playerInput.trim())}
        />
        <button
          onClick={() => playerInput.trim() && setPlayer(playerInput.trim())}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-lg"
        >
          Enter Hub →
        </button>
      </div>
    </div>
  );

  const filtered = filterDrill ? sessions.filter(s => s.drillId === +filterDrill) : sessions;

  function playerStats() {
    if (!sessions.length) return null;
    const withIndex = sessions.filter(s => s.index !== null);
    const avgIdx = withIndex.length ? Math.round(withIndex.reduce((a, b) => a + b.index, 0) / withIndex.length) : null;
    const best = withIndex.length ? Math.max(...withIndex.map(s => s.index)) : null;
    const thisMonth = sessions.filter(s => s.date.startsWith(new Date().toISOString().slice(0, 7)));
    return { total: sessions.length, avgIdx, best, thisMonth: thisMonth.length };
  }

  const stats = playerStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-800 text-white px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold">⛳ Anthony Summers Short Game Practice Hub</h1>
            <p className="text-green-300 text-sm">Welcome, <strong>{player}</strong></p>
          </div>
          <button onClick={() => setPlayer(null)} className="text-green-300 text-sm hover:text-white underline">
            Switch Player
          </button>
        </div>
      </div>

      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto flex">
          {[["log","📋 Session Log"],["stats","📊 My Stats"],["leaderboard","🏆 Leaderboard"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${tab===k ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}

        {!loading && tab === "log" && (
          <div>
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
              <button onClick={() => setShowAdd(!showAdd)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700">
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
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Drill</label>
                    <select value={form.drillId} onChange={e => setForm({...form, drillId: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="">Select drill...</option>
                      {DRILLS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score {form.drillId && DRILLS.find(d=>d.id===+form.drillId)?.unit ? `(${DRILLS.find(d=>d.id===+form.drillId).unit})` : ""}
                    </label>
                    <input type="number" step="0.1" value={form.score}
                      onChange={e => setForm({...form, score: e.target.value})}
                      placeholder="Enter score..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" />
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
                    <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                      placeholder="Optional notes..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={saveSession} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">Save</button>
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
                      </div>
                      <button onClick={() => deleteSession(s)} className="text-red-400 hover:text-red-600 text-lg shrink-0">✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!loading && tab === "stats" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 {player}'s Progress</h2>
            {sessions.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No sessions logged yet.</p>
            ) : (
              <div className="space-y-3">
                {DRILLS.map(drill => {
                  const ds = sessions.filter(s => s.drillId === drill.id);
                  if (!ds.length) return null;
                  const withIdx = ds.filter(s => s.index !== null);
                  const avgIdx = withIdx.length ? Math.round(withIdx.reduce((a,b)=>a+b.index,0)/withIdx.length) : null;
                  const best = drill.dir === "lower" ? Math.min(...ds.map(s=>s.score)) : Math.max(...ds.map(s=>s.score));
                  const r = ratingColor(avgIdx);
                  return (
                    <div key={drill.id} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-800">{drill.name}</span>
                            {avgIdx !== null && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${r.bg} ${r.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`}></span>
                                Avg Index: {avgIdx}
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
          </div>
        )}

        {!loading && tab === "leaderboard" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Leaderboard</h2>
            <div className="mb-4">
              <select value={lbDrill} onChange={e => { setLbDrill(+e.target.value); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700">
                {DRILLS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                        <span className={`flex-1 font-medium ${e.player===player?"text-green-700":""}`}>{e.player}{e.player===player?" (you)":""}</span>
                        <span className="w-20 text-right font-semibold">{e.score}{drill.unit ? ` ${drill.unit}` : ""}</span>
                        <span className="w-20 text-right">
                          {e.index_score !== null ? (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.bg} ${r.text}`}>{Math.round(e.index_score)}</span>
                          ) : "—"}
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
            {piRanking.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Overall Performance Index Ranking</h3>
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
                    return (
                      <div key={r2.player}
                        className={`flex gap-4 px-4 py-3 items-center border-b border-gray-100 text-sm ${r2.player===player?"bg-green-50":i%2===0?"bg-white":"bg-gray-50"}`}>
                        <span className="w-8 font-bold text-gray-500">{medal||`${i+1}`}</span>
                        <span className={`flex-1 font-medium ${r2.player===player?"text-green-700":""}`}>{r2.player}{r2.player===player?" (you)":""}</span>
                        <span className="w-24 text-right">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>{r2.avg_index}</span>
                        </span>
                        <span className="w-24 text-right text-gray-500">{r2.session_count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}