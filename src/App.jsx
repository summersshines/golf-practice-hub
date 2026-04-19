import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase';

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
function PlayerDrillBreakdown({ playerName, allEntries, lbCategory }) {
  const entries = allEntries.filter(e => e.player === playerName);
  const catEntries = lbCategory === "All"
    ? entries
    : entries.filter(e => DRILL_CATEGORY[e.drill_id] === lbCategory);
  if (!catEntries.length) return <p className="text-xs text-gray-400 px-4 pb-3">No entries in this category.</p>;
  const sorted = [...catEntries].sort((a,b) => (b.index_score ?? 0) - (a.index_score ?? 0));
  return (
    <div className="px-4 pb-3 pt-1 bg-green-50 border-t border-green-100">
      <p className="text-xs font-semibold text-green-800 mb-2">Drill Breakdown — {lbCategory === "All" ? "All Categories" : lbCategory}</p>
      <div className="space-y-1">
        {sorted.map((e, i) => {
          const drill = DRILLS.find(d => d.id === e.drill_id);
          const r = ratingColor(e.index_score);
          const cat = DRILL_CATEGORY[e.drill_id];
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${CAT_COLOR[cat]}`}>{cat}</span>
              <span className="flex-1 text-gray-700 truncate">{e.drill_name}</span>
              <span className="font-semibold text-gray-700 shrink-0">{e.score}{drill?.unit ? ` ${drill.unit}` : ""}</span>
              {e.index_score !== null && (
                <span className={`px-2 py-0.5 rounded-full font-medium shrink-0 ${r.bg} ${r.text}`}>{Math.round(e.index_score)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

function ProximityScorecardModal({ drillId, onSave, onCancel }) {
  const config = PROXIMITY_SCORECARDS[drillId];
  const drill = DRILLS.find(d => d.id === drillId);
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

function BroadieChaseModal({ drillId, onSave, onCancel }) {
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

function PointsRaceScorecardModal({ onSave, onCancel }) {
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

function BroadieTestModal({ drillId, onSave, onCancel }) {
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

function DrawbackGauntletModal({ drillId, onSave, onCancel }) {
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

function FullRangeTourTestModal({ onSave, onCancel }) {
  const DISTANCES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [puttCounts, setPuttCounts] = useState(Array(13).fill(0));
  const [activeIdx, setActiveIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleMiss() {
    setPuttCounts(prev => prev.map((v, i) => i === activeIdx ? v + 1 : v));
  }

  function handleHole() {
    setPuttCounts(prev => prev.map((v, i) => i === activeIdx ? v + 1 : v));
    if (activeIdx === 12) {
      setFinished(true);
      setActiveIdx(13);
    } else {
      setActiveIdx(activeIdx + 1);
    }
  }

  const totalPutts = puttCounts.reduce((a, b) => a + b, 0);
  const completedCount = activeIdx;
  const zone = totalPutts <= 16 ? { label: "Green Zone", color: "text-green-700 bg-green-50 border-green-200" }
    : totalPutts <= 25 ? { label: "Yellow Zone", color: "text-yellow-700 bg-yellow-50 border-yellow-200" }
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
          <h2 className="text-lg font-bold">🎯 Full Range Tour Test (3–15ft)</h2>
          <p className="text-green-300 text-sm mt-0.5">Hole each distance — miss keeps the putt going</p>
        </div>
        <div className="bg-green-50 border-b border-green-100 px-5 py-2 text-xs font-medium text-green-800">
          Hole It → distance complete · Miss → another putt at same distance · Score = total putts across all 13 distances
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
              <p className="text-xs mt-1 opacity-70">{zone.label} · Green ≤16 · Yellow 17–25 · Red 26+</p>
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
            <p className="text-2xl font-extrabold text-gray-700">{completedCount} / 13</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="text-2xl font-extrabold text-gray-700">{13 - completedCount}</p>
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
  const catAvgs = cats.map(cat => {
    const cs = withIdx.filter(s => DRILL_CATEGORY[s.drillId] === cat);
    const avg = cs.length ? Math.round(cs.reduce((a,b) => a + b.index, 0) / cs.length) : null;
    return { cat, avg, count: cs.length };
  }).filter(c => c.avg !== null);

  const weakCat = catAvgs.length
    ? catAvgs.reduce((a,b) => a.avg < b.avg ? a : b)
    : null;

  // Suggested drills for weak category: played first (sorted by lowest avg index), then unplayed
  const suggestedDrills = (() => {
    if (!weakCat) return [];
    const catDrills = DRILLS.filter(d => DRILL_CATEGORY[d.id] === weakCat.cat && d.dir !== null);

    // Drills played — compute avg index per drill
    const played = [];
    catDrills.forEach(drill => {
      const ds = withIdx.filter(s => s.drillId === drill.id);
      if (!ds.length) return;
      const avg = Math.round(ds.reduce((a,b) => a + b.index, 0) / ds.length);
      played.push({ drill, avgIdx: avg, played: true });
    });
    played.sort((a,b) => a.avgIdx - b.avgIdx); // lowest index first = most needs work

    // Unplayed drills in the category
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
      {weakCat && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎯</span>
            <div>
              <p className="text-sm font-bold text-orange-800">Focus Area: {weakCat.cat}</p>
              <p className="text-xs text-orange-600">Avg index {weakCat.avg} — your lowest category</p>
            </div>
          </div>
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
  const [showFullRangeTourTestScorecard, setShowFullRangeTourTestScorecard] = useState(false);

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
          onClick={() => { if (playerInput.trim()) { localStorage.setItem('player', playerInput.trim()); setPlayer(playerInput.trim()); }}}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-lg"
        >Enter Hub →</button>
      </div>
    </div>
  );

  const isSwedish = +form.drillId === 93;
  const isPar72 = +form.drillId === 2;
  const isPelz = +form.drillId === 9;
  const isProximity = [1, 8, 10, 21, 25, 27, 28].includes(+form.drillId);
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
  const isFullRangeTourTest = +form.drillId === 55;
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
      {showFullRangeTourTestScorecard && (
        <FullRangeTourTestModal
          onSave={total => { setForm(f => ({ ...f, score: String(total) })); setShowFullRangeTourTestScorecard(false); }}
          onCancel={() => setShowFullRangeTourTestScorecard(false)}
        />
      )}
      {/* Header */}
      <div className="bg-green-800 text-white px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold">⛳ Anthony Summers Short Game Practice Hub</h1>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score {form.drillId && !isSwedish && !isPar72 && !isPelz && !isProximity && !isNegative && !isJuniorPutting && !isJuniorShortGame && !isSundayStandard && !isSwedishQuickFire && !isPelzSnapshot && !isBroadieChase && !isPointsRace && !isBroadieTest && !isLukeDonald && !isGauntlet && !is250Challenge && !isSuddenDeathCarousel && !isDrawbackGauntlet && !isJaggedPeaks && !isAscent && !isAnchor && !isCrucible && !isSniperSchool && !isFullRangeTourTest && DRILLS.find(d=>d.id===+form.drillId)?.unit ? `(${DRILLS.find(d=>d.id===+form.drillId).unit})` : ""}
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
                    ) : isFullRangeTourTest ? (
                      <div>
                        <button type="button" onClick={() => setShowFullRangeTourTestScorecard(true)}
                          className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 text-sm">
                          🎯 Open Scorecard
                        </button>
                        {form.score !== "" && (
                          <div className="mt-2 text-sm text-green-700 font-semibold">
                            ✅ Score recorded: {form.score} putts
                            <button type="button" onClick={() => setShowFullRangeTourTestScorecard(true)}
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
                            lbCategory={lbCategory}
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