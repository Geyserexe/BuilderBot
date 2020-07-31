import leads from "./mon-sets/leads.json"
import sets from "./mon-sets/sets.json";
import config from "../config.json";


module.exports = buildTeam();

function buildTeam() {

    let teamString = "";
    for (var b = 0; b < config.teamNumber; b++) {
        let team = [];

        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }

        if (config.startMon.set) {
            team[0] = config.startMon;
        } else {
            team[0] = leads[getRandomInt(leads.length)]
        }
        for (let i = 1; i < config.teamLength; i++) {
            let prunedArray = getMons(0, team);
            if (prunedArray.length > 0) {
                team.push(prunedArray[getRandomInt(prunedArray.length)]);
            } else {
                let reps = 1;
                while (true) {
                    let newList = getMons(reps, team);
                    if (newList.length > 1) {
                        team.push(newList[getRandomInt(newList.length)]);
                        break;
                    }
                    reps++;
                }
            }
        }

        for (let TEAM of team) {
            let set: any = TEAM.set;
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
        }
    }
    return (teamString);
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function isValid(mon: any, team: any) {
    for (let i = 0; i < config.monsToAvoid.length; i++) {
        if (mon.set.name.toLowerCase() === config.monsToAvoid[i].toLowerCase()) {
            return false;
        }
    }
    for (let i = 0; i < team.length; i++) {
        if (mon.set.name.includes(team[i].set.name) || team[i].set.name.includes(mon.set.name)) {
            return false;
        }
        if ((mon.z && team[i].z) || (mon.mega && team[i].mega)) {
            return false;
        }
    }
    return true;
}

function getMons(num: any, team: any) {
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