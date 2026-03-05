import { useState, useEffect } from "react";
import { supabase } from './supabase';

const DRILLS = [
  { id:1,  name:"International Short Game",          type:"score",      unit:"ft",   dir:"lower",  perfect:30,  worst:100, notes:"Hit 3 chip & run shots from 15-19m, 20-25m and 30-35m. 3 bunker shots from 10-14m, 20-25m and 30-35m. 3 pitch shots from 20-25m, 30-35m and 40-45m. 3 lob shots from 10-12m, 15-17m and 20-22m. Record proximity in feet for each shot. Lower is better." },
  { id:2,  name:"Par 72 Short Game",                 type:"score",      unit:"",     dir:"lower",  perfect:64,  worst:84,  notes:"Scorecard needed for full instructions and scoring metrics. Record total proximity in feet. Lower is better." },
  { id:3,  name:"100ft Putting (18 putts)",           type:"score",      unit:"",     dir:"lower",  perfect:18,  worst:9,   notes:"Set up 9x3ft putts around the hole, then 4x6ft, 3x9ft, 1x10ft and 1x12ft changing slope and break on each putt. You only count the putts you hole — it is either in or miss. Higher score = more putts holed." },
  { id:4,  name:"250ft Putting Challenge",            type:"score",      unit:"ft",   dir:"higher", perfect:150, worst:50,  notes:"Set up putts from 5, 10, 15 and 20ft at 5 different holes changing slope and break on each one. Record total feet holed. 100 is average, 130 is excellent, 250 is near impossible." },
  { id:5,  name:"Par 21 Short Game Challenge",        type:"level",      unit:"lvl",  dir:"higher", perfect:10,  worst:1,   notes:"To successfully move up a level you need to get 6/9 up and down. Level 1 is all shots from inside 25m. Level 2 adds 1 shot from 25-50m and each level adds one more shot in the 25-50m zone. Just completing Level 1 is a good achievement. Score is the level reached." },
  { id:6,  name:"20min Chipping Hole Out",            type:"count",      unit:"",     dir:"higher", perfect:10,  worst:0,   notes:"Work around the green hitting different shots for 20 minutes, trying not to hit the same shot multiple times. Count the total number of hole outs. 10+ is elite." },
  { id:7,  name:"4-10ft Putting Challenge",           type:"level",      unit:"ft",   dir:"higher", perfect:10,  worst:3,   notes:"Start with 8 tees around the hole at 4ft. If you hole the putt move the tee back to 5ft. If you miss, remove the tee. Keep working around the hole until all tees are removed. Your score is the last distance you successfully putted from." },
  { id:8,  name:"Hell Drill Putting",                 type:"completion", unit:"",     dir:null,     perfect:null,worst:null,notes:"Multiple levels of difficulty. Pass or fail based on completing the drill. Ask your coach for the specific level instructions." },
  { id:9,  name:"Proximity Challenge Putting",        type:"distance",   unit:"ft",   dir:"lower",  perfect:10,  worst:50,  notes:"Hit putts from 30, 40, 50, 60 and 70ft. Total up the distance from the hole after each putt for your score. Lower is better — closer to the hole = better score." },
  { id:10, name:"12 Putt Completion Drill",           type:"score",      unit:"",     dir:"lower",  perfect:1,   worst:5,   notes:"Putts to be played: 4x3ft around the hole, 20ft uphill into 2ft circle, 20ft downhill into 2ft circle, 3x6ft from around the hole, 2-putt from 40ft, then hole an 8ft putt to finish. Score is the number of attempts needed to complete. Lower is better." },
  { id:11, name:"No 3 Putts (9 holes)",               type:"score",      unit:"",     dir:"lower",  perfect:0,   worst:2,   notes:"Play 9 holes and count the number of 3-putts. 0 = no 3-putts (perfect), 1 = one 3-putt, 2 = two 3-putts. Lower is better." },
  { id:12, name:"5-15ft Putting Comp",                type:"score",      unit:"putts",dir:"lower",  perfect:2,   worst:12,  notes:"Count the number of putts taken to hole a putt from 25ft. If you leave a putt short, your distance score reverts back to 0 and you start again, but keep counting total putts hit. Lower is better." },
  { id:13, name:"Chipping Comp",                      type:"score",      unit:"holes",dir:"lower",  perfect:2,   worst:10,  notes:"First to 6 points wins. Scoring: holed = 3pts, 0-3ft = 2pts, 3-6ft = 1pt. Record the number of holes needed to reach 6 points. Lower is better." },
  { id:14, name:"Chipping 10 Ball Basket",            type:"score",      unit:"shots",dir:"lower",  perfect:10,  worst:30,  notes:"Total number of shots needed to get 10 balls inside the target range (either 3ft or 6ft circles). Lower is better." },
  { id:15, name:"Chipping 10 Ball Basket - Hole Out", type:"score",      unit:"shots",dir:"lower",  perfect:10,  worst:50,  notes:"Total number of shots needed to hole out 10 balls into the basket. Lower is better." },
  { id:16, name:"Project 1 Putt Level 1",             type:"score",      unit:"",     dir:"lower",  perfect:16,  worst:30,  notes:"Complete the Project 1 Putt Level 1 challenge. 24 is the pass mark — anything at or below that score is above average. Lower is better." },
  { id:17, name:"Short Game/Pitching 10-100m",        type:"distance",   unit:"ft",   dir:"lower",  perfect:50,  worst:250, notes:"Hit shots from 10, 20, 30, 40, 50, 60, 70, 80, 90 and 100m. Record total proximity in feet added up after all 10 shots. Lower is better." },
  { id:18, name:"Dave Pelz Short Game Challenge",     type:"points",     unit:"pts",  dir:"higher", perfect:155, worst:0,   notes:"Various scoring based on proximity to hole. Typically: holed = 4pts, 0-3ft = 2pts, 3-6ft = 1pt. Scoring may vary depending on shot type. Higher is better." },
  { id:19, name:"10 Shot Variety Challenge",          type:"distance",   unit:"m",    dir:"lower",  perfect:25,  worst:125, notes:"Hit 3 chip & run shots from 8m, 16m, 24m. 2 bunker shots from 10m and 20m. 3 shots with any wedge from 8m, 23m, 36m. 2 flop/lob shots from 11m and 16m. Total up proximity to hole for all 10 shots. Lower is better." },
  { id:20, name:"48 Putt Challenge (PK)",             type:"score",      unit:"",     dir:"higher", perfect:48,  worst:0,   notes:"Complete the 48 putt challenge and count successful putts. 36 is an excellent score, 48 is perfect. Higher is better." },
  { id:21, name:"13 Tees Putting",                    type:"score",      unit:"",     dir:"higher", perfect:13,  worst:0,   notes:"You need to hole 10/12 putts to reach the 13th tee. The game is complete when you hole the putt from the 13th tee. Score is the number of tees reached. Higher is better." },
  { id:22, name:"5-15ft Hole Out Challenge",          type:"score",      unit:"",     dir:"higher", perfect:18,  worst:0,   notes:"Attempt to hole putts from 5-15ft. Score is the number of putts holed out of 18. Higher is better — 18 = all holed." },
  { id:23, name:"Putting Star Ladder (Pro)",          type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:40,  notes:"Work ladder style through the activity. If you hole the putt you move up to the next distance, if you miss you move back. The game is complete when you hole the 10ft putt. Score is total putts taken. Lower is better." },
  { id:24, name:"12ft Eliminator Putting",            type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:36,  notes:"Set up 8 putts around the hole at 12ft. Hole the putt to eliminate that position. Keep going until all 8 are eliminated. Maximum 36 putts. Score is total putts taken. Lower is better." },
  { id:25, name:"4ft Eliminator Putting",             type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:16,  notes:"Set up 8 putts around the hole at 4ft. Hole the putt to eliminate that position. Keep going until all 8 are eliminated. Maximum 16 putts. Score is total putts taken. Lower is better." },
  { id:26, name:"8ft Eliminator Putting",             type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:24,  notes:"Set up 8 putts around the hole at 8ft. Hole the putt to eliminate that position. Keep going until all 8 are eliminated. Maximum 24 putts. Score is total putts taken. Lower is better." },
  { id:27, name:"Pitching 30-70m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:150, notes:"Hit pitching shots from 30-70m. Add up the total proximity in feet for all shots. Lower is better — closer to the hole = better score." },
  { id:28, name:"Pitching 80-120m",                   type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:200, notes:"Hit pitching shots from 80-120m. Add up the total proximity in feet for all shots. Lower is better — closer to the hole = better score." },
  { id:29, name:"Putting Luke Donald 4-8ft",          type:"score",      unit:"/20",  dir:"higher", perfect:20,  worst:0,   notes:"Hit putts from 4, 5, 6, 7 and 8ft. Add up total number of putts holed out of 20. 15 is tour average, 20 is perfect. Higher is better." },
  { id:30, name:"Putting Gate Drill",                 type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:20,  notes:"Set up a start gate and attempt to roll 10 putts through without hitting any barriers. Count total putts taken. Lower is better." },
  { id:31, name:"Putting Gate Drill (R-L)",           type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:24,  notes:"Roll putts right-to-left through the start gate and into the hole without hitting any barriers. Count total putts taken. Lower is better." },
  { id:32, name:"Putting Gate Drill (L-R)",           type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:24,  notes:"Roll putts left-to-right through the start gate and into the hole without hitting any barriers. Count total putts taken. Lower is better." },
  { id:33, name:"Putting Tour Challenge 3-10ft",      type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:14,  notes:"Hit putts from 3, 4, 5, 6, 7, 8, 9 and 10ft in a spiral or from random locations. Count how many putts it takes to hole all 8. Lower is better." },
  { id:34, name:"Putting Challenge 10-15ft",          type:"score",      unit:"putts",dir:"lower",  perfect:6,   worst:30,  notes:"Hit putts from 10, 11, 12, 13, 14 and 15ft in a spiral or from random locations. Count how many putts it takes to hole all 6. Lower is better." },
  { id:35, name:"Putting Challenge 3-15ft",           type:"score",      unit:"putts",dir:"lower",  perfect:13,  worst:37,  notes:"Hit putts from 3-15ft changing slope and break on each putt in a spiral pattern. Count how many putts it takes to hole all 13. Lower is better." },
  { id:36, name:"Putting Challenge 3-7ft",            type:"score",      unit:"putts",dir:"lower",  perfect:5,   worst:10,  notes:"Hit putts from 3, 4, 5, 6 and 7ft changing line and break on each putt. Count how many putts it takes to hole all 5. Lower is better." },
  { id:37, name:"Putting Challenge 6-10ft",           type:"score",      unit:"putts",dir:"lower",  perfect:5,   worst:15,  notes:"Hit putts from 6, 7, 8, 9 and 10ft in a spiral or random pattern changing slope and break. Count how many putts it takes to hole all 5. Lower is better." },
  { id:38, name:"Putting Challenge 8-12ft",           type:"score",      unit:"putts",dir:"lower",  perfect:5,   worst:20,  notes:"Hit putts from 8, 9, 10, 11 and 12ft changing slope and break on each putt. Count how many putts it takes to hole all 5. Lower is better." },
  { id:39, name:"Putting Challenge 3-8ft",            type:"score",      unit:"putts",dir:"lower",  perfect:6,   worst:10,  notes:"Hit putts from 3, 4, 5, 6, 7 and 8ft changing break and slope on each putt. Count how many putts it takes to hole all 6. Lower is better." },
];

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
  const [guideSearch, setGuideSearch] = useState("");

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

      <div className="bg-white border-b shadow-sm overflow-x-auto">
        <div className="max-w-5xl mx-auto flex">
          {[["log","📋 Session Log"],["stats","📊 My Stats"],["leaderboard","🏆 Leaderboard"],["guide","📖 Drill Guide"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${tab===k ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
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
                {form.drillId && (() => {
                  const d = DRILLS.find(x => x.id === +form.drillId);
                  return (
                    <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                      <strong>📖 How to play:</strong> {d.notes}
                    </div>
                  );
                })()}
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

        {!loading && tab === "guide" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">📖 Drill Guide</h2>
            <p className="text-gray-500 text-sm mb-4">How to play and scoring for all 39 drills.</p>
            <input
              type="text"
              placeholder="Search drills..."
              value={guideSearch}
              onChange={e => setGuideSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
            />
            <div className="space-y-3">
              {DRILLS.filter(d => d.name.toLowerCase().includes(guideSearch.toLowerCase())).map(drill => {
                const perfectLabel = drill.perfect !== null ? `${drill.perfect}${drill.unit ? ` ${drill.unit}` : ""}` : "N/A";
                const worstLabel = drill.worst !== null ? `${drill.worst}${drill.unit ? ` ${drill.unit}` : ""}` : "N/A";
                return (
                  <div key={drill.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-gray-400">#{drill.id}</span>
                      <h3 className="font-semibold text-gray-800">{drill.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{drill.notes}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {drill.dir === "lower" ? "↓ Lower is better" : drill.dir === "higher" ? "↑ Higher is better" : "No index rating"}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">✅ Perfect: {perfectLabel}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">❌ Worst: {worstLabel}</span>
                      {drill.dir !== null && (
                        <>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">🟢 Index 80–100</span>
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">🟡 Index 50–79</span>
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">🔴 Index 0–49</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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