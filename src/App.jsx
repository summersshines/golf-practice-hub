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
} from './scorecards';

// ─── DRILL CATEGORIES ────────────────────────────────────────────────────────
const DRILL_CATEGORY = {
  1:"Mixed",    2:"Mixed",    3:"Mixed",    4:"Chipping", 5:"Chipping",
  6:"Chipping", 7:"Chipping", 8:"Pitching", 9:"Mixed",    10:"Mixed",
  11:"Pitching",12:"Mixed",   13:"Mixed",   14:"Mixed",   15:"Chipping",
  16:"Bunker",  17:"Chipping",18:"Chipping",19:"Bunker",  20:"Chipping",
  21:"Mixed",   22:"Mixed",   23:"Mixed",   24:"Chipping",25:"Mixed",
  26:"Pitching",27:"Mixed",   28:"Mixed",   29:"Chipping",30:"Pitching",
  31:"Pitching",32:"Pitching",33:"Putting", 34:"Putting", 35:"Putting",
  36:"Putting", 37:"Putting", 38:"Putting", 39:"Putting", 40:"Putting",
  41:"Putting", 42:"Putting", 43:"Putting", 44:"Putting", 45:"Putting",
  46:"Putting", 47:"Putting", 48:"Putting", 49:"Putting", 50:"Putting",
  51:"Putting", 52:"Putting", 53:"Putting", 54:"Putting", 55:"Putting",
  56:"Putting", 57:"Putting", 58:"Putting", 59:"Putting", 60:"Putting",
  61:"Putting", 62:"Putting", 63:"Putting", 64:"Putting", 65:"Putting",
  66:"Putting", 67:"Putting", 68:"Putting", 69:"Putting", 70:"Putting",
  71:"Putting", 72:"Putting", 73:"Putting", 74:"Putting", 75:"Putting",
  76:"Putting", 77:"Putting", 78:"Putting", 79:"Mixed",   80:"Bunker",
  81:"Bunker",  82:"Bunker",  83:"Chipping",84:"Pitching",85:"Pitching",
  86:"Pitching",87:"Pitching",88:"Pitching",89:"Pitching",90:"Pitching",
  91:"Pitching",92:"Pitching",93:"Mixed",   94:"Mixed",   95:"Mixed",
  96:"Pitching",97:"Pitching",98:"Putting",99:"Putting",100:"Putting",
};
const CATEGORIES = ["All", "Putting", "Chipping", "Pitching", "Bunker", "Mixed"];
const CAT_COLOR = {
  Putting:"bg-blue-100 text-blue-700", Chipping:"bg-green-100 text-green-700",
  Pitching:"bg-purple-100 text-purple-700", Bunker:"bg-yellow-100 text-yellow-700",
  Mixed:"bg-gray-100 text-gray-600",
};

const DRILLS = [
  { id:1,  name:"Global Combine",                          type:"score",      unit:"ft",   dir:"lower",  perfect:48,  worst:180, notes:"Proximity in feet to hole for each shot is recorded, the lower the better. Hit 3 chip & run shots from 15-19m, 20-25m and 30-35m. 3 bunker shots from 10-14m, 20-25m and 30-35m. 3 pitch shots from 20-25m, 30-35m and 40-45m. 3 lob shots from 10-12m, 15-17m and 20-22m. Scorecard included. Best recorded score: Tommy Fleetwood 37ft." },
  { id:2,  name:"Par 72 Scoring Challenge",                type:"score",      unit:"",     dir:"lower",  perfect:68,  worst:88,  notes:"Proximity in feet to hole for each shot is recorded, the lower the better. Scorecard included." },
  { id:3,  name:"Level Up Challenge - Par 21",             type:"level",      unit:"lvl",  dir:"higher", perfect:10,  worst:1,   notes:"To successfully move up a level you need to get 6/9 up and down. Level 1 is all shots from inside 25m. Level 2 adds 1 shot from 25-50m and as you progress up each level you add one more shot in the 25-50m zone. Just getting through Level 1 is a good achievement and should be considered a pass." },
  { id:4,  name:"Hole Out Blitz",                          type:"count",      unit:"",     dir:"higher", perfect:10,  worst:0,   notes:"Count of hole outs. Work around the green hitting different shots, trying not to hit the same shot multiple times. 20 min max to complete this challenge." },
  { id:5,  name:"First to 6 Shootout",                     type:"points",     unit:"holes",dir:"lower",  perfect:2,   worst:10,  notes:"First to 6 points wins. Scoring: holed = 3pts, 0-3ft = 2pts, 3-6ft = 1pt. Count number of holes needed to be played to win and/or reach 6 points." },
  { id:6,  name:"Basket Gauntlet - 3ft Zone",              type:"completion", unit:"shots",dir:"lower",  perfect:10,  worst:30,  notes:"Total number of shots to get 10 balls inside the target range (either 3ft or 6ft circles)." },
  { id:7,  name:"Hole Out Gauntlet",                       type:"completion", unit:"shots",dir:"lower",  perfect:10,  worst:50,  notes:"Total number of shots to get 10 balls inside the basket." },
  { id:8,  name:"The Full Range Combine 10-100m",          type:"distance",   unit:"ft",   dir:"lower",  perfect:50,  worst:250, notes:"Proximity to target, total feet added up after the 10 shots, closer is better. Hit shots from 10, 20, 30, 40, 50, 60, 70, 80, 90 and 100m. Scorecard included." },
  { id:9,  name:"Pelz Gauntlet",                           type:"score",      unit:"pts",  dir:"higher", perfect:136, worst:0,   notes:"Hit 10 shots from each of the following — 3/4 Wedge 70m, 1/2 Wedge 40m, Long Sand 20-35m, Short Sand 7-15m, Long Chip 15-30m, Short Chip 7-15m, Pitch Fairway 10-20m, Pitch Rough 10-20m, Cut Lob 10-20m. Scoring: holed = 4pts, 0-3ft = 2pts, 3-6ft = 1pt. Scorecard included." },
  { id:10, name:"Variety Combine",                         type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:150, notes:"Total proximity to hole for all 10 shots. Hit 3 chip & run shots from 8m, 16m, 24m. 2 bunker shots from 10m and 20m. 3 shots with any wedge from 8m, 23m, 36m. 2 flop/lob shots from 11m and 16m. Scorecard included." },
  { id:11, name:"Wedge Combine 30-70m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:150, notes:"Hit shots from 30, 40, 50, 60 and 70m. Score is the total number of feet for the shots added up. Proximity to hole." },
  { id:12, name:"3 Shot Close Range Combine (10-14m)",     type:"distance",   unit:"ft",   dir:"lower",  perfect:6,   worst:60,  notes:"Hit shots from 10m fairway, 12m bunker and 14m rough. Total up the distance from the hole for each shot for your score." },
  { id:13, name:"3 Shot Mid Range Combine (20-25m)",       type:"distance",   unit:"ft",   dir:"lower",  perfect:10,  worst:75,  notes:"Hit shots from 20m rough, 23m bunker and 25m fairway. Total up the distance from the hole for each shot for your score." },
  { id:14, name:"3 Shot Long Range Combine (30-40m)",      type:"distance",   unit:"ft",   dir:"lower",  perfect:10,  worst:80,  notes:"Hit shots from 30m bunker, 35m fairway and 40m rough. Total up the distance from the hole for each shot for your score." },
  { id:15, name:"Fairway 3 - 10-30m",                      type:"distance",   unit:"ft",   dir:"lower",  perfect:6,   worst:60,  notes:"Hit shots from the fairway from 10, 20 and 30m. Total up the distance from the hole for each shot for your score." },
  { id:16, name:"Bunker 3 - 10-30m",                       type:"distance",   unit:"ft",   dir:"lower",  perfect:9,   worst:75,  notes:"Hit bunker shots from 10, 20 and 30m. Total up your distance from the hole for each shot for your score." },
  { id:17, name:"Rough 3 - 10-30m",                        type:"distance",   unit:"ft",   dir:"lower",  perfect:9,   worst:75,  notes:"Hit shots from the rough from 10, 20 and 30m. Total up your distance from the hole for each shot for your score." },
  { id:18, name:"Fairway 6 - 10-35m",                      type:"distance",   unit:"ft",   dir:"lower",  perfect:20,  worst:100, notes:"Hit shots from the fairway from 10, 15, 20, 25, 30 and 35m. Total up your distance from the hole for your score." },
  { id:19, name:"Bunker 6 - 10-35m",                       type:"distance",   unit:"ft",   dir:"lower",  perfect:30,  worst:150, notes:"Hit shots from the bunker from 10, 15, 20, 25, 30 and 35m. Total up your distance from the hole for your score." },
  { id:20, name:"Rough 6 - 10-35m",                        type:"distance",   unit:"ft",   dir:"lower",  perfect:20,  worst:120, notes:"Hit shots from the rough from 10, 15, 20, 25, 30 and 35m. Total up your distance from the hole for your score." },
  { id:21, name:"10 Shot Circuit - 8-35m",                 type:"distance",   unit:"ft",   dir:"lower",  perfect:30,  worst:200, notes:"Hit shots from: 8m bunker, 9m fairway, 11m rough, 12m fairway, 16m bunker, 20m fairway, 22m rough, 25m bunker, 33m rough and 45m fairway. Total up distance from the hole for each shot for your score. Best on record is 32ft. Scorecard included." },
  { id:22, name:"Texas Tech Challenge",                    type:"score",      unit:"",     dir:"lower",  perfect:-4,  worst:16,  notes:"Hit shots from: 10m fringe chip, 15m flop shot (short sided), 20m fairway with 50% green available, 20m fairway bump & run, 15m bunker (short sided), bunker 20m (open side), rough 15m with 50% green available, rough 25m open sided downhill, rough 10m short side. Scoring: holed = -2, 0-3ft = -1, 3-6ft = 0, 6-12ft = +1, 12+ft = +2. Scorecard included." },
  { id:23, name:"Recovery Mission - 9 Hole Challenge",     type:"score",      unit:"",     dir:"lower",  perfect:-4,  worst:16,  notes:"Hit shots from: 8m fringe (downslope), 12m chip & run (upslope), bunker 12m (upslope), bunker 15m (downslope), pitch 25m (ball above feet), pitch 30m (ball below feet), lob 10m (upslope), chip & run 20m (uphill), chip & run 25m (downhill). Scoring: holed = -2, 0-3ft = -1, 3-6ft = 0, 6-12ft = +1, 12+ft = +2. Scorecard included." },
  { id:24, name:"Lob Master - 6 Shot Challenge (10-35m)",  type:"distance",   unit:"ft",   dir:"lower",  perfect:12,  worst:90,  notes:"Hit shots with your LW 58° or 60° from 10, 15, 20, 25, 30 and 35m. Total up the distance from the hole for each shot and record your score." },
  { id:25, name:"The 9 Station Circuit (10-35m)",          type:"distance",   unit:"ft",   dir:"lower",  perfect:20,  worst:180, notes:"Hit shots from: fairway 15, 25 and 35m. Rough 10, 20 and 30m. Bunker 11, 22 and 33m. Total up the distance from the hole for each shot and record your score. Best on record is 22.5ft. Scorecard included." },
  { id:26, name:"Wedge Combine 80-120m",                   type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:200, notes:"Hit shots from 80, 90, 100, 110 and 120m. Proximity to target, add up total feet for each shot for your score." },
  { id:27, name:"All the Shots Combine (18) 20-70m",       type:"distance",   unit:"ft",   dir:"lower",  perfect:80,  worst:540, notes:"Hit shots from the fairway, bunker and rough from 20, 30, 40, 50, 60 and 70m. Total up the distance from the hole for each shot and record your score. Scorecard included." },
  { id:28, name:"15 Shot Grinder Combine (7-35m)",         type:"distance",   unit:"ft",   dir:"lower",  perfect:50,  worst:450, notes:"Hit shots from the fairway, bunker and rough from 7, 14, 21, 28 and 35m. Total up the distance from the hole for each shot and record your score. Scorecard included." },
  { id:29, name:"Bump and Run - No Wedges Allowed",        type:"distance",   unit:"ft",   dir:"lower",  perfect:20,  worst:100, notes:"Hit shots from 10, 15, 20, 25, 30 and 35m. No wedges allowed! Total up the distance from the hole for each shot and record your score." },
  { id:30, name:"Wedge Combine 50-75m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:12,  worst:75,  notes:"Hit shots from 50, 65 and 75m. Total up the distance from the hole for each shot and record your score." },
  { id:31, name:"Wedge Combine 80-100m",                   type:"distance",   unit:"ft",   dir:"lower",  perfect:15,  worst:90,  notes:"Hit shots from 80, 90 and 100m. Total up the distance from the hole for each shot and record your score." },
  { id:32, name:"Wedge Circuit 50-100m",                   type:"distance",   unit:"ft",   dir:"lower",  perfect:46,  worst:196, notes:"Hit shots from 50, 90, 75, 83, 63 and 99m. Total up the distance from the hole for each shot and record your score." },
  { id:33, name:"100ft Gauntlet (18 Putts)",               type:"score",      unit:"",     dir:"lower",  perfect:18,  worst:0,   notes:"It is either in or miss — you only count the putts you hole towards your score. Set up 9x3ft putts around the hole, then 4x6ft, 3x9ft, 1x10ft and 1x12ft, changing slope and break on each putt. Scorecard included." },
  { id:34, name:"250ft Challenge",                         type:"score",      unit:"ft",   dir:"higher", perfect:150, worst:0,   notes:"Total feet holed. 100 is average, 130 is excellent, 250 is near impossible. Set up putts from 5, 10, 15, 20ft at 5 different holes changing slope and break on each one. Scorecard included." },
  { id:35, name:"Sudden Death Carousel (4-10ft)",           type:"level",      unit:"putts",dir:"higher", perfect:32,  worst:0,   notes:"Start with 8 tees around the hole at 4ft. Hole the putt and move the tee back to 5ft. Miss and remove the tee. Keep working around the hole until all tees are removed. Record your score as the total number of putts holed. Scorecard included." },
  { id:36, name:"Drawback Gauntlet 5-15ft",                type:"score",      unit:"putts",dir:"lower",  perfect:9,   worst:27,  notes:"Play 9 holes on the putting green with each first putt starting from between 5 and 15ft. Change slope and break on each putt. If your first putt misses draw the ball back 1 putter length and continue until holed. No tap ins! Goal is 13 putts or less. Scorecard included." },
  { id:37, name:"Long Distance Proximity Test",            type:"distance",   unit:"ft",   dir:"lower",  perfect:10,  worst:50,  notes:"Closer is better. Hit putts from 30, 40, 50, 60 and 70ft. Total up distance from the hole after each putt for your score." },
  { id:38, name:"The Closer (12 Putt Completion)",         type:"completion", unit:"",     dir:"lower",  perfect:1,   worst:10,  notes:"Putts to play: (1) 4x3ft around the hole. (2) 20ft uphill into 2ft circle. (3) 20ft downhill into 2ft circle. (4) 3x5ft from around the hole. (5) 2-putt from 40ft. (6) Hole an 8ft putt to finish. If you miss at any step, start again. Record the number of attempts it took to complete." },
  { id:39, name:"3 Putt Eliminator Challenge",             type:"completion", unit:"",     dir:"lower",  perfect:0,   worst:3,   notes:"Play 9 holes on the putting green with each first putt from 30ft+. Count up the number of 3-putts. 0 = no 3-putts, 1 = one 3-putt, 2 = two 3-putts." },
  { id:40, name:"Race to 25ft Challenge",                  type:"distance",   unit:"putts",dir:"lower",  perfect:2,   worst:12,  notes:"Race to hole 25ft. You can choose your start distance — your opponent chooses any distance they like. If you leave a putt short, your total footage resets to 0 but keep counting putts. Count total putts taken to hole 25ft of putts." },
  { id:41, name:"Project 1 Putt Circuit (Level 1)",        type:"score",      unit:"",     dir:"lower",  perfect:16,  worst:40,  notes:"Set up putts from 2, 3, 4, 5, 6, 7, 8 and 9ft on a breaking R-L and same on a L-R putt. Count how many putts it takes to hole all 16 putts. 24 is the pass mark — anything at or below is above average." },
  { id:42, name:"Sunday Showcase - 48 Putt PK",           type:"score",      unit:"",     dir:"higher", perfect:42,  worst:12,  notes:"3 sections: (1) Gate drill putting through a start gate from 6-10ft. (2) Breaking putts to a ghost hole from 6, 9, 12, 15ft finishing in a speed zone 1-2ft behind the hole — uphill/downhill R-L and L-R. (3) Hole out putts from 4, 5, 6, 7ft from all 4 breaks and slopes. Total up the number of successful putts. 36 is an excellent score. Scorecard included." },
  { id:43, name:"13 Tee Gauntlet",                         type:"score",      unit:"",     dir:"higher", perfect:13,  worst:0,   notes:"Set up putts at N, E, S, W from 5-7ft (12 in total). The 13th tee is placed randomly at 7ft. You need to hole 10/12 to reach the 13th tee. The game is complete when you hole the putt from the 13th tee." },
  { id:44, name:"Spiral Hole Out Test (5-15ft)",           type:"score",      unit:"/18",  dir:"higher", perfect:14,  worst:0,   notes:"Set up putts from 5, 7, 9, 11, 13 and 15ft around the hole in a spiral. Do this at 3 different holes. Score is how many you hole out of 18." },
  { id:45, name:"Jagged Peaks",                            type:"count",      unit:"putts",dir:"lower",  perfect:12,  worst:60,  notes:"Work through the following distances in order: 3, 7, 4, 8, 5, 9, 6, 10ft. Hole the putt and advance to the next distance. Miss and go back one step — 3ft is the floor. Complete the drill by holing the 10ft putt. 60 putts maximum. Record your score as the total number of putts taken. Scorecard included." },
  { id:46, name:"Momentum Keeper 12ft Eliminator",         type:"count",      unit:"putts",dir:"lower",  perfect:12,  worst:36,  notes:"Hole the putt to eliminate that position. Keep going around the hole until all 8 putts are eliminated. 36 putts maximum to finish." },
  { id:47, name:"The Surgeon 4ft Eliminator",              type:"count",      unit:"putts",dir:"lower",  perfect:8,   worst:14,  notes:"Hole the putt to eliminate that position. Keep going around the hole until all 8 putts are eliminated. 14 putts maximum to finish." },
  { id:48, name:"The Payday 8ft Eliminator",               type:"count",      unit:"putts",dir:"lower",  perfect:10,  worst:24,  notes:"Hole the putt to eliminate that position. Keep going around the hole until all 8 putts are eliminated. 24 putts maximum to complete." },
  { id:49, name:"Luke Donald Make Zone Test (4-8ft)",      type:"score",      unit:"/20",  dir:"higher", perfect:20,  worst:0,   notes:"Set up putts from 4, 5, 6, 7 and 8ft around the hole at 4 different holes, changing slope and break on each. Score = total putts holed out of 20. 15 is tour average. Scorecard included." },
  { id:50, name:"Iron Gates",                              type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:20,  notes:"Count how many putts it takes to get 10 putts through the start gate and into the hole without hitting any barriers. Gate setup options — Hard: 5cm wide 30cm in front of hole, or 6cm wide 50cm in front. Medium: 6cm wide 30cm in front, or 7cm wide 50cm in front. Easy: 6.5cm wide 30cm in front, or 8cm wide 50cm in front." },
  { id:51, name:"Iron Gates (R-L)",                        type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:24,  notes:"Count how many putts it takes to get 10 putts right-to-left through the start gate and into the hole without hitting any barriers. Gate setup options — Hard: 5cm wide 30cm in front of hole, or 6cm wide 50cm in front. Medium: 6cm wide 30cm in front, or 7cm wide 50cm in front. Easy: 6.5cm wide 30cm in front, or 8cm wide 50cm in front." },
  { id:52, name:"Iron Gates (L-R)",                        type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:24,  notes:"Count how many putts it takes to get 10 putts left-to-right through the start gate and into the hole without hitting any barriers. Gate setup options — Hard: 5cm wide 30cm in front of hole, or 6cm wide 50cm in front. Medium: 6cm wide 30cm in front, or 7cm wide 50cm in front. Easy: 6.5cm wide 30cm in front, or 8cm wide 50cm in front." },
  { id:53, name:"Tour Test 3-10ft",                        type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:14,  notes:"Hit putts from 3, 4, 5, 6, 7, 8, 9 and 10ft in a spiral or from random locations. Count how many putts to hole all 8." },
  { id:54, name:"Tour Test 10-15ft",                       type:"score",      unit:"putts",dir:"lower",  perfect:6,   worst:30,  notes:"Hit putts from 10, 11, 12, 13, 14 and 15ft in a spiral or from random locations. Count how many putts to hole all 6." },
  { id:55, name:"Full Range Tour Test 3-15ft",             type:"score",      unit:"putts",dir:"lower",  perfect:13,  worst:37,  notes:"Hit putts from 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 and 15ft changing slope and break in a spiral or random pattern. Count how many putts to hole all 13. Scorecard included." },
  { id:56, name:"Make Zone Test 3-7ft",                    type:"score",      unit:"putts",dir:"lower",  perfect:5,   worst:10,  notes:"Hit putts from 3, 4, 5, 6 and 7ft changing line and break on each putt. Count how many putts to hole all 5." },
  { id:57, name:"Make Zone Test 6-10ft",                   type:"score",      unit:"putts",dir:"lower",  perfect:5,   worst:15,  notes:"Hit putts from 6, 7, 8, 9 and 10ft in a spiral or random pattern changing slope and break. Count how many putts to hole all 5." },
  { id:58, name:"Make Zone Test 8-12ft",                   type:"score",      unit:"putts",dir:"lower",  perfect:5,   worst:20,  notes:"Hit putts from 8, 9, 10, 11 and 12ft changing slope and break. Count how many putts to hole all 5." },
  { id:59, name:"Make Zone Test 3-8ft",                    type:"score",      unit:"putts",dir:"lower",  perfect:6,   worst:10,  notes:"Hit putts from 3, 4, 5, 6, 7 and 8ft changing break and slope. Count how many putts to hole all 6." },
  { id:60, name:"Peter Hanson Test (4-5ft)",               type:"score",      unit:"/8",   dir:"higher", perfect:8,   worst:0,   notes:"Set up 4x4ft putts (N, E, S, W) and 4x5ft putts in between (NE, NW, SE, SW). Score is how many putts you make out of 8." },
  { id:61, name:"4-5-6 Circuit 6 Putts",                   type:"score",      unit:"/6",   dir:"higher", perfect:6,   worst:0,   notes:"Hit putts from around the hole at 4, 5, 6, 4, 5 and 6ft. Record your total score for each holed putt out of 6." },
  { id:62, name:"4-5-6 Circuit 9 Putts",                   type:"score",      unit:"/9",   dir:"higher", perfect:9,   worst:0,   notes:"Hit putts from 4, 5, 6, 4, 5, 6, 4, 5 and 6ft around the hole. Record your total score for holed putts out of 9." },
  { id:63, name:"Crucible 'The Anchor' 3-5ft",             type:"completion", unit:"putts",dir:"lower",  perfect:10,  worst:40,  notes:"Set up 5 tees around the hole at 3ft. Hole the putt and move the tee back 1ft. Miss and move the tee 1ft closer. Keep going until all tees are at 5ft. Scorecard included." },
  { id:64, name:"Crucible 'The Gridlock' 4-6ft",           type:"completion", unit:"putts",dir:"lower",  perfect:10,  worst:50,  notes:"Set up 5 tees around the hole at 4ft. Hole the putt and move the tee back 1ft. Miss and move the tee 1ft closer. Keep going until all tees are at 6ft. Scorecard included." },
  { id:65, name:"Crucible 'No Fly Zone' 5-7ft",            type:"completion", unit:"putts",dir:"lower",  perfect:10,  worst:70,  notes:"Set up 5 tees around the hole at 5ft. Hole the putt and move the tee back 1ft. Miss and move the tee 1ft closer. Keep going until all tees are at 7ft. Scorecard included." },
  { id:66, name:"Crucible 'The Trenches' 6-8ft",           type:"completion", unit:"putts",dir:"lower",  perfect:20,  worst:100, notes:"Set up 5 tees around the hole at 6ft. Hole the putt and move the tee back 1ft. Miss and move the tee 1ft closer. Keep going until all tees are at 8ft. Scorecard included." },
  { id:67, name:"Crucible 'Sniper School' 7-10ft",         type:"completion", unit:"putts",dir:"lower",  perfect:30,  worst:130, notes:"Set up 5 tees around the hole at 7ft. Hole the putt and move the tee back 1ft. Miss and move the tee 1ft closer. Keep going until all tees are at 10ft. Scorecard included." },
  { id:68, name:"Drawback Gauntlet 15-30ft",               type:"score",      unit:"putts",dir:"lower",  perfect:16,  worst:36,  notes:"Play 9 holes on the putting green with each first putt from 15-30ft. Change slope and break on each putt. If your first putt misses draw the ball back 1 putter length and continue until holed. No tap ins! Goal is 18 putts or less. Scorecard included." },
  { id:69, name:"4-5-6m Points Race (12,15,18ft)",         type:"score",      unit:"putts",dir:"lower",  perfect:12,  worst:40,  notes:"Hit alternating random putts from 4, 5, 6, 4, 5, 6m changing slope and break. Objective is to get to 15 points in as few putts as possible. Scoring: holed = 3pts, 0-3ft past = 0pts, short or 3-putt = -3pts. Total up the number of putts to reach 15 points. Scorecard included." },
  { id:70, name:"Broadie Chase 5ft",                       type:"score",      unit:"putts",dir:"lower",  perfect:8,   worst:16,  notes:"Hit putts from 5ft around the hole. Count how many putts to reach 15pts. Scoring: holed = 2pts, 2-putt = 0pts, short but 2-putt = -1pt, 3-putt = -3pts. Scorecard included." },
  { id:71, name:"Broadie Chase 10ft",                      type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:26,  notes:"Hit putts from 10ft around the hole. Count how many putts to reach 10pts. Scoring: holed = 2pts, 2-putt = 0pts, short but 2-putt = -1pt, 3-putt = -3pts. Scorecard included." },
  { id:72, name:"Broadie Chase 15ft",                      type:"score",      unit:"putts",dir:"lower",  perfect:10,  worst:26,  notes:"Hit putts from 15ft around the hole. Count how many putts to reach 5pts. Scoring: holed = 2pts, 2-putt = 0pts, short but 2-putt = -1pt, 3-putt = -3pts. Scorecard included." },
  { id:73, name:"Broadie Test 5ft",                        type:"score",      unit:"",     dir:"higher", perfect:20,  worst:0,   notes:"Hit 10 putts from 5ft around the hole. Scoring: holed = 2pts, 2-putt = 0pts, short but 2-putt = -1pt, 3-putt = -3pts. Total up your score for the 10 putts. Scorecard included." },
  { id:74, name:"Broadie Test 10ft",                       type:"score",      unit:"",     dir:"higher", perfect:10,  worst:0,   notes:"Hit 10 putts from 10ft around the hole. Scoring: holed = 2pts, 2-putt = 0pts, short but 2-putt = -1pt, 3-putt = -3pts. Total up your score for the 10 putts. Scorecard included." },
  { id:75, name:"Broadie Test 15ft",                       type:"score",      unit:"",     dir:"higher", perfect:6,   worst:0,   notes:"Hit 10 putts from 15ft around the hole. Scoring: holed = 2pts, 2-putt = 0pts, short but 2-putt = -1pt, 3-putt = -3pts. Total up your score for the 10 putts. Scorecard included." },
  { id:76, name:"Washington Speed Control - 20ft",         type:"distance",   unit:"ft",   dir:"lower",  perfect:8,   worst:40,  notes:"Hit 10 putts from 20ft around the hole. Measure total distance from the hole for each putt in inches (2.5cm) and total them up. Record your score in feet (12 inches or 30cm = 1 foot)." },
  { id:77, name:"Washington Speed Control - 30ft",         type:"distance",   unit:"ft",   dir:"lower",  perfect:12,  worst:40,  notes:"Hit 10 putts from 30ft around the hole. Measure total distance from the hole for each putt in inches (2.5cm) and total them up. Record your score in feet (12 inches or 30cm = 1 foot)." },
  { id:78, name:"Junior Putting Circuit",                  type:"score",      unit:"putts",dir:"lower",  perfect:12,  worst:24,  notes:"Hit putts from 3, 4, 5, 6, 8, 12, 15, 20 and 30ft. Putt each ball out until it is in the hole. Add up your total for the 9 holes for your score. Scorecard included." },
  { id:79, name:"Junior Short Game Circuit",               type:"score",      unit:"pts",  dir:"higher", perfect:24,  worst:0,   notes:"Play 9 holes around the chipping green: (1) Fringe <10m. (2) Fringe 10-20m. (3) Chip & run 10m. (4) Chip & run 10-20m. (5) Pitch 20m. (6) Pitch 30m. (7) Lob 10m. (8) Bunker 10m. (9) Bunker 20m. Scoring: holed = 4pts, 0-3ft = 3pts, 3-6ft = 2pts, 6-12ft = 1pt, 12ft+ = 0pts. Scorecard included." },
  { id:80, name:"6 Lie Bunker Challenge",                  type:"score",      unit:"pts",  dir:"higher", perfect:15,  worst:0,   notes:"Hit 6 shots from the bunker from: (1) flat, (2) ball above feet, (3) ball below feet, (4) upslope, (5) downslope, (6) plugged lie. Scoring: holed = 4pts, 0-3ft = 3pts, 3-6ft = 2pts, 6-12ft = 1pt, 12ft+ = 0pts." },
  { id:81, name:"Close Range Lie Mix",                     type:"score",      unit:"pts",  dir:"higher", perfect:15,  worst:0,   notes:"Hit 5 shots from the bunker from 0-10m from the hole from: (1) flat, (2) ball above feet, (3) ball below feet, (4) upslope, (5) downslope. Scoring: holed = 4pts, 0-3ft = 3pts, 3-6ft = 2pts, 6-12ft = 1pt, 12ft+ = 0pts." },
  { id:82, name:"Mid Range Lie Mix",                       type:"score",      unit:"pts",  dir:"higher", perfect:15,  worst:0,   notes:"Hit 5 shots from the bunker 10-20m from the hole from: (1) flat, (2) ball above feet, (3) ball below feet, (4) upslope, (5) downslope. Scoring: holed = 4pts, 0-3ft = 3pts, 3-6ft = 2pts, 6-12ft = 1pt, 12ft+ = 0pts." },
  { id:83, name:"3 Distance Test (10,15,20m)",             type:"distance",   unit:"ft",   dir:"lower",  perfect:9,   worst:60,  notes:"Hit 3 shots, one each from 10, 15 and 20m from the hole. Use any club and any shot choice you like. Measure proximity to the hole for each shot and add them up for your total. Lower is better." },
  { id:84, name:"Wedge Combine 50-80m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:18,  worst:90,  notes:"Hit 3 shots in total, one from 50, 65 and 80m. Total up your distance from the hole for each shot. Lower is better." },
  { id:85, name:"Wedge Combine 55-95m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:40,  worst:150, notes:"Hit 5 shots in total, one from 55, 65, 75, 85 and 95m. Total up your distance from the hole for each shot. Lower is better." },
  { id:86, name:"Wedge Combine 60-80m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:35,  worst:150, notes:"Hit 5 shots in total, one from 60, 65, 70, 75 and 80m. Total up your distance from the hole for each shot. Lower is better." },
  { id:87, name:"Wedge Combine 80-100m",                   type:"distance",   unit:"ft",   dir:"lower",  perfect:45,  worst:195, notes:"Hit 5 shots in total, one from 80, 85, 90, 95 and 100m. Total up your distance from the hole for each shot. Lower is better." },
  { id:88, name:"Wedge Combine 70-90m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:40,  worst:180, notes:"Hit 5 shots in total, one from 70, 75, 80, 85 and 90m. Total up your distance from the hole for each shot. Lower is better." },
  { id:89, name:"Wedge Combine 40-80m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:18,  worst:90,  notes:"Hit 3 shots in total, one from 40, 60 and 80m. Total up your distance from the hole for each shot. Lower is better." },
  { id:90, name:"Wedge Combine 50-90m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:20,  worst:90,  notes:"Hit 3 shots in total, one from 50, 70 and 90m. Total up your distance from the hole for each shot. Lower is better." },
  { id:91, name:"Wedge Combine 30-50m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:20,  worst:120, notes:"Hit 5 shots in total, one from 30, 35, 40, 45 and 50m. Total up your distance from the hole for each shot. Lower is better." },
  { id:92, name:"Wedge Combine 40-60m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:25,  worst:150, notes:"Hit 5 shots in total, one from 40, 45, 50, 55 and 60m. Total up your distance from the hole for each shot. Lower is better." },
  { id:93, name:"Swedish National 40 Shot Combine",        type:"score",      unit:"pts",  dir:"higher", perfect:80,  worst:0,   notes:"Hit 5 shots from each of the following: chip 10m, chip 20m, pitch 20m, pitch 40m, lob 15m, lob 25m, bunker 10m, bunker 20m. Scoring: holed = 4pts, 0-3ft = 3pts, 3-6ft = 2pts, 6-9ft = 1pt, 9ft+ = 0pts. You can use an alignment stick as the hole and change shots for each round/attempt. Scorecard included." },
  { id:94, name:"Swedish National Quick Fire",             type:"score",      unit:"pts",  dir:"higher", perfect:16,  worst:0,   notes:"Hit 1 shot from each of the following: chip 10m, chip 20m, pitch 20m, pitch 40m, lob 15m, lob 25m, bunker 10m, bunker 20m. Scoring: holed = 4pts, 0-3ft = 3pts, 3-6ft = 2pts, 6-9ft = 1pt, 9ft+ = 0pts. Scorecard included." },
  { id:95, name:"Pelz Snapshot",                           type:"score",      unit:"pts",  dir:"higher", perfect:15,  worst:0,   notes:"Hit 1 shot from each of the following: 3/4 wedge 70m, 1/2 wedge 40m, long sand 20-35m, short sand 7-15m, long chip 15-30m, short chip 7-15m, pitch fairway 10-20m, pitch rough 10-20m, cut lob 10-20m. Scoring: holed = 4pts, 0-3ft = 2pts, 3-6ft = 1pt. Scorecard included." },
  { id:96, name:"Wedge Combine 40-100m",                   type:"distance",   unit:"ft",   dir:"lower",  perfect:35,  worst:185, notes:"Hit 5 shots in total, one from 40, 55, 70, 85 and 100m. Total up your distance from the hole for each shot. Lower is better." },
  { id:97, name:"Wedge Combine 30-90m",                    type:"distance",   unit:"ft",   dir:"lower",  perfect:18,  worst:108, notes:"Hit 3 shots in total, one from 30, 60 and 90m. Total up your distance from the hole for each shot. Lower is better." },
  { id:98,  name:"Team Ripper Challenge (4,6,8ft)",        type:"score",      unit:"/10",  dir:"higher", perfect:10,  worst:0,   notes:"Set up 4x4ft, 4x6ft and 2x8ft putts around the hole in a spiral or random pattern. Count how many putts you make out of 10. Higher is better." },
  { id:99,  name:"The Ascent",                            type:"distance",   unit:"ft",   dir:"higher", perfect:15,  worst:0,   notes:"Find a straight putt 3ft from the hole. Hole the putt and move back 1ft on each successful putt. Stay on the same line keeping the putt straight. Record your score as the distance of your last successful putt — not the one you missed. Scorecard included." },
  { id:100, name:"The Retreat",                           type:"distance",   unit:"ft",   dir:"higher", perfect:60,  worst:0,   notes:"Start 3ft from the hole. With each successful 1 or 2 putt move back 3ft. Change slope, line and break on each putt and continue until you have a 3 putt. Record your score as the distance where you had your last successful putt — not where you 3 putted from." },
];

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
  async getSessions(player) {
    const { data, error } = await supabase.from('sessions').select('*').eq('player', player).order('date', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
  },
  async addSession(session) {
    const { error } = await supabase.from('sessions').insert([{
      id: session.id, player: session.player, drill_id: session.drillId,
      drill_name: session.drillName, score: session.score, unit: session.unit,
      dir: session.dir, index_score: session.index, notes: session.notes, date: session.date,
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
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-50">
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
        {trendSummary && (
          <div className="shrink-0 text-right">
            <p className="text-xs text-gray-500 mb-0.5">Trend</p>
            <p className={`text-xs font-semibold ${trendColor}`}>{trendSummary.label}</p>
          </div>
        )}
        {sparkPoints && (
          <svg width="60" height="20" viewBox="0 0 60 20" className="shrink-0">
            <polyline points={sparkPoints} fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {history.length > 1 && (
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="shrink-0 text-xs text-green-700 underline hover:text-green-800"
          >
            {expanded ? "Hide" : "Show history"}
          </button>
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [player, setPlayer] = useState(() => localStorage.getItem('player') || null);
  const [playerInput, setPlayerInput] = useState("");
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

  useEffect(() => { if (player) loadAll(); }, [player]);
  useEffect(() => { if (player && tab === "leaderboard") loadLeaderboard(); }, [lbDrill, tab]);

  async function loadAll() {
    setLoading(true);
    const rows = await DB.getSessions(player);
    setSessions(rows.map(r => ({
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

  async function deleteSession(s) {
    if (!window.confirm(`Delete "${s.drillName}" on ${new Date(s.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}? This cannot be undone.`)) return;
    await DB.deleteSession(s.id);
    setSessions(sessions.filter(x => x.id !== s.id));
  }

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!player) return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">⛳</div>
        <h1 className="text-2xl font-bold text-green-800 mb-1">Anthony Summers</h1>
        <h2 className="text-lg text-gray-600 mb-6">AS Performance Centre</h2>
        <p className="text-sm text-gray-500 mb-4">Enter your name to get started</p>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg mb-4 focus:outline-none focus:border-green-500"
          placeholder="Your name..."
          value={playerInput}
          onChange={e => setPlayerInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && playerInput.trim() && setPlayer(playerInput.trim())}
        />
        <button
          onClick={() => { if (playerInput.trim()) { localStorage.setItem('player', playerInput.trim()); setPlayer(playerInput.trim()); }}}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-lg"
        >Enter Hub →</button>
      </div>
    </div>
  );

  const isSwedish = +form.drillId === 93;
  const isPar72 = +form.drillId === 2;
  const isPelz = +form.drillId === 9;
  const isProximity = [1, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29, 30, 31, 32, 37, 76, 77, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 96, 97].includes(+form.drillId);
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
  const isGateCompletion = [50, 51, 52].includes(+form.drillId);
  const CRUCIBLE_CONFIGS = {
    64: { drillId: 64, title: "Crucible — The Gridlock (4–6ft)",  icon: "🔒", startDist: 4, finishDist: 6, cap: 50 },
    65: { drillId: 65, title: "Crucible — No Fly Zone (5–7ft)",   icon: "🚫", startDist: 5, finishDist: 7, cap: 70 },
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
          }}
          onCancel={() => setShowSwedishScorecard(false)}
        />
      )}
      {showPar72Scorecard && (
        <Par72ScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPar72Scorecard(false);
          }}
          onCancel={() => setShowPar72Scorecard(false)}
        />
      )}
      {showPelzScorecard && (
        <PelzScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPelzScorecard(false);
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
          }}
          onCancel={() => setShowNegativeScorecard(false)}
        />
      )}
      {showJuniorPuttingScorecard && (
        <JuniorPuttingScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowJuniorPuttingScorecard(false);
          }}
          onCancel={() => setShowJuniorPuttingScorecard(false)}
        />
      )}
      {showJuniorShortGameScorecard && (
        <JuniorShortGameScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowJuniorShortGameScorecard(false);
          }}
          onCancel={() => setShowJuniorShortGameScorecard(false)}
        />
      )}
      {showSundayStandardScorecard && (
        <SundayStandardScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowSundayStandardScorecard(false);
          }}
          onCancel={() => setShowSundayStandardScorecard(false)}
        />
      )}
      {showSwedishQuickFireScorecard && (
        <SwedishQuickFireScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowSwedishQuickFireScorecard(false);
          }}
          onCancel={() => setShowSwedishQuickFireScorecard(false)}
        />
      )}
      {showPelzSnapshotScorecard && (
        <PelzSnapshotScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPelzSnapshotScorecard(false);
          }}
          onCancel={() => setShowPelzSnapshotScorecard(false)}
        />
      )}
      {showBroadieChaseScorecard && isBroadieChase && (
        <BroadieChaseModal
          drillId={+form.drillId}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowBroadieChaseScorecard(false);
          }}
          onCancel={() => setShowBroadieChaseScorecard(false)}
        />
      )}
      {showPointsRaceScorecard && (
        <PointsRaceScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowPointsRaceScorecard(false);
          }}
          onCancel={() => setShowPointsRaceScorecard(false)}
        />
      )}
      {showBroadieTestScorecard && isBroadieTest && (
        <BroadieTestModal
          drillId={+form.drillId}
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowBroadieTestScorecard(false);
          }}
          onCancel={() => setShowBroadieTestScorecard(false)}
        />
      )}
      {showLukeDonaldScorecard && (
        <LukeDonaldScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowLukeDonaldScorecard(false);
          }}
          onCancel={() => setShowLukeDonaldScorecard(false)}
        />
      )}
      {showGauntletScorecard && (
        <GauntletScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShowGauntletScorecard(false);
          }}
          onCancel={() => setShowGauntletScorecard(false)}
        />
      )}
      {show250ChallengeScorecard && (
        <Challenge250ScorecardModal
          onSave={total => {
            setForm(f => ({ ...f, score: String(total) }));
            setShow250ChallengeScorecard(false);
          }}
          onCancel={() => setShow250ChallengeScorecard(false)}
        />
      )}
      {showSuddenDeathCarouselScorecard && (
        <SuddenDeathCarouselModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowSuddenDeathCarouselScorecard(false); }}
          onCancel={() => setShowSuddenDeathCarouselScorecard(false)}
        />
      )}
      {showDrawbackGauntletScorecard && isDrawbackGauntlet && (
        <DrawbackGauntletModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowDrawbackGauntletScorecard(false); }}
          onCancel={() => setShowDrawbackGauntletScorecard(false)}
        />
      )}
      {showJaggedPeaksScorecard && (
        <JaggedPeaksModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowJaggedPeaksScorecard(false); }}
          onCancel={() => setShowJaggedPeaksScorecard(false)}
        />
      )}
      {showAscentScorecard && (
        <AscentModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowAscentScorecard(false); }}
          onCancel={() => setShowAscentScorecard(false)}
        />
      )}
      {showAnchorScorecard && (
        <AnchorModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowAnchorScorecard(false); }}
          onCancel={() => setShowAnchorScorecard(false)}
        />
      )}
      {showCrucibleScorecard && isCrucible && (
        <CrucibleModal
          config={CRUCIBLE_CONFIGS[+form.drillId]}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowCrucibleScorecard(false); }}
          onCancel={() => setShowCrucibleScorecard(false)}
        />
      )}
      {showSniperSchoolScorecard && (
        <SniperSchoolModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowSniperSchoolScorecard(false); }}
          onCancel={() => setShowSniperSchoolScorecard(false)}
        />
      )}
      {showHoleAllDistancesScorecard && isHoleAllDistances && (
        <HoleAllDistancesModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowHoleAllDistancesScorecard(false); }}
          onCancel={() => setShowHoleAllDistancesScorecard(false)}
        />
      )}
      {showLieMixScorecard && isLieMix && (
        <LieMixScorecardModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowLieMixScorecard(false); }}
          onCancel={() => setShowLieMixScorecard(false)}
        />
      )}
      {showTapToToggleScorecard && isTapToToggle && (
        <TapToToggleModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowTapToToggleScorecard(false); }}
          onCancel={() => setShowTapToToggleScorecard(false)}
        />
      )}
      {showSpiralHoleOutScorecard && (
        <SpiralHoleOutModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowSpiralHoleOutScorecard(false); }}
          onCancel={() => setShowSpiralHoleOutScorecard(false)}
        />
      )}
      {showEliminatorScorecard && isEliminator && (
        <EliminatorModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowEliminatorScorecard(false); }}
          onCancel={() => setShowEliminatorScorecard(false)}
        />
      )}
      {showGateCompletionScorecard && isGateCompletion && (
        <GateCompletionModal
          drillId={+form.drillId}
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowGateCompletionScorecard(false); }}
          onCancel={() => setShowGateCompletionScorecard(false)}
        />
      )}
      {/* Header */}
      <div className="bg-green-800 text-white px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold">⛳ AS Performance Centre</h1>
            <p className="text-green-300 text-sm">Welcome, <strong>{player}</strong></p>
          </div>
          <button onClick={() => { localStorage.removeItem('player'); setPlayer(null); }} className="text-green-300 text-sm hover:text-white underline">
            Switch Player
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
      </div>
    </div>
  );
}