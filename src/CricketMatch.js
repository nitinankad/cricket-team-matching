import React, { useState } from 'react';
import moment from 'moment';

const DEFAULT_TEAMS = "365 Cricket Club\nACE XI\nArkansas Wolfpack's\nArkansas Wolfpacks\nArlington Mavericks\nASG Kings\nBallbusters\nBCA\nBCA Elites\nBIS Lions\nBlack Stallions\nBlue Devils\nBlue Stars CC\nBlue Strikers\nBoomstick Mafia CC\nBuccaneers\nBurraq XI\nBusiness Intelli Solutions Lions\nCenturions\nChallengers CC";
const DEFAULT_UMPIRES = "Dallas Daredevils\nDallas Hellcats\nSunrisers Super Kings\nPlano Super Kings\nDesi Boyz";
const DEFAULT_GROUNDS = "Allen Cricket Ground\nGarland Cricket Ground\nGarland Cricket Ground New\nDodd Park Cricket Ground";

const CricketMatch = () => {
  const [teams, setTeams] = useState(DEFAULT_TEAMS.split("\n"));
  const [umpires, setUmpires] = useState(DEFAULT_UMPIRES.split("\n"));
  const [fields, setFields] = useState(DEFAULT_GROUNDS.split("\n"));
  const [matches, setMatches] = useState([]);

  const generateMatches = () => {
    let tempTeams = [...teams];
    let tempUmpires = [...umpires];
    let matches = [];
    for (let field of fields) {
      let timeRanges = generateTimeRanges("08:00", "21:00");
      for (let timeRange of timeRanges) {
        let matchTeams = getRandomSubarray(tempTeams, 2);
        tempTeams = tempTeams.filter((team) => !matchTeams.includes(team));
        let matchUmpires = getRandomSubarray(tempUmpires, 2);
        tempUmpires = tempUmpires.filter((umpire) => !matchUmpires.includes(umpire));

        matches.push({
          teams: matchTeams,
          umpires: matchUmpires,
          field,
          timeRange
        });

        if (tempTeams.length < 2 || tempUmpires.length < 2) {
          break;
        }
      }
      if (tempTeams.length < 2 || tempUmpires.length < 2) {
        break;
      }
    }
    setMatches(matches);
  };

  const generateTimeRanges = (startTime, endTime) => {
    let timeRanges = [];
    let currentStartTime = moment(startTime, "HH:mm");
    let end = moment(endTime, "HH:mm");
    let duration = moment.duration(3, 'hours').add(45, 'minutes');
    while (currentStartTime.add(duration).isBefore(end)) {
      let endRange = moment(currentStartTime);
      timeRanges.push([moment(currentStartTime).subtract(duration), endRange]);
    }
    return timeRanges;
  };

  const getRandomSubarray = (arr, size) => {
    let shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  };

  const handleInput = (setter) => (e) => {
    setter(e.target.value.split('\n'));
  };

  const downloadCsv = () => {
    let csvContent = "Team1,Team2,Field,StartTime,EndTime,Umpire1,Umpire2\n";
    matches.forEach(match => {
      csvContent += `${match.teams[0]},${match.teams[1]},${match.field},${match.timeRange[0].format('hh:mm A')},${match.timeRange[1].format('hh:mm A')},${match.umpires[0]},${match.umpires[1]}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'matches.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <span>Team names</span>
        <textarea placeholder="Enter team names" onChange={handleInput(setTeams)} defaultValue={DEFAULT_TEAMS.split(",")} />
      </div>
      <div>
        <span>Umpire names</span>
        <textarea placeholder="Enter umpire names" onChange={handleInput(setUmpires)} defaultValue={DEFAULT_UMPIRES} />
      </div>
      <div>
        <span>Field names</span>
        <textarea placeholder="Enter field names" onChange={handleInput(setFields)} defaultValue={DEFAULT_GROUNDS} />
      </div>
      <button onClick={generateMatches}>Generate Matches</button>
      {matches.length > 0 && <button onClick={downloadCsv}>Download to CSV</button>}
      <div>
        {matches.map((match, index) => (
          <p key={index}>
            {match.teams[0]} vs {match.teams[1]} at {match.field} from {match.timeRange[0].format('hh:mm A')} to {match.timeRange[1].format('hh:mm A')} with umpires {match.umpires[0]} and {match.umpires[1]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CricketMatch;
