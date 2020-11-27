const config = require("../../config.js");
const leads = require("../../sets/gen7anythinggoes/leads.json");
const sets = require("../../sets/gen7anythinggoes/sets.json");
const util = require("../../util.js");

let recursions = 0;

module.exports = tryBuild();

function tryBuild() {
    try {
        return buildTeam();
    }
    catch (e) {
        return (`error: ${e}`);
    }
}

function buildTeam() {

    let breakerTotal = 0;

    let teamString = "";
    for (var b = 1; b < config.teamNumber + 1; b++) {
        let team = [];

        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }

        if (config.startMon.set) {
            team[0] = config.startMon;
        } else {
            team[0] = leads[util.getRandomInt(leads.length)];
        }

        for (let i = 1; i < config.teamLength; i++) {
            let prunedArray = getMons(0, team);
            if (prunedArray.length > 0) {
                team.push(prunedArray[util.getRandomInt(prunedArray.length)]);
            } else {
                let reps = 1;
                while (true) {
                    let newList = getMons(reps, team);
                    if (newList.length > 1) {
                        team.push(newList[util.getRandomInt(length)]);
                        break;
                    }
                    reps++;
                    if (reps > 10) {
                        throw ("Error finding breakers.  Add more or try again.");
                    }
                }
            }
            breakerTotal += team[i].breaker;
        }

        teamString += util.parseTeam(team);
        if (breakerTotal < config.breakerThreshold && config.teamNumber === 1) {
            if (recursions > 6000) {
                throw ("breakerThreshold too high.");
            }
            recursions++;
            teamString = buildTeam();
        }
    }
    return (teamString);
}

function isValid(mon, team) {
    if (!util.isValid(mon, team)) {
        return false;
    }
    return true;
}

function getMons(num, team) {
    let prunedArray = [];
    for (var a = 0; a < sets.length; a++) {
        let mon = sets[a];
        if (sets[a].breaker >= config.cutoff - num && isValid(sets[a], team)) {
            prunedArray.push(mon);
        }
    }
    if (prunedArray.length > 0) {
        return (prunedArray);
    } else {
        return ([]);
    }
}