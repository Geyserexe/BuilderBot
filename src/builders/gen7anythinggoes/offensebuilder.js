const config = require("../../../config.js");
const leads = require("../../mon-sets/gen7anythinggoes/leads.json");
const sets = require("../../mon-sets/gen7anythinggoes/sets.json");
const util = require("../../util.js");

module.exports = tryBuild();

function tryBuild() {
    try {
        return buildTeam();
    }
    catch (err) {
        return (`error: ${err}`);
    }
}

function buildTeam() {

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
        }

        for (let i = 0; i < team.length; i++) {
            if(team[i] == null){
                throw("cutoff too high");
            }
            let set = team[i].set;
            let moves = "";
            for (let a = 0; a < set.moves.length; a++) {
                moves += `\n- ${set.moves[a]}`;
            }
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature${moves}\n\n`;
        }
    }
    return (teamString);
}

function isValid(mon, team) {
    if (!util.isValid(mon, team)) {
        return false;
    }
    for (let i = 0; i < team.length; i++) {
        if (mon.mega && team[i].mega) {
            return false;
        }
        if (mon.z && team[i].z) {
            return false;
        }
    }
    if (mon.set.item.toLowerCase().includes("choice")) {
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