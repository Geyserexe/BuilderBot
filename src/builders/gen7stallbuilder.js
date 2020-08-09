const config = require("../../config.json");
const sets = require("../mon-sets/gen7sets.json");
const util = require("../util.js");

let team = [];

let recursions = 0;

let stats = {
    ints: {
        rayCheck: 0,
        zygCheck: 0,
        marshCheck: 0,
        donCheck: 0,
        ultraCheck: 0,
        xernCheck: 0,
        ogreCheck: 0
    },
    mega: false,
    z: false,
    rocks: false,
    defog: false,
    cleric: false
};

module.exports = tryBuild();

function tryBuild() {
    try {
        util.init(stats);
        return buildTeam();
    }
    catch (err) {
        return (`error: ${err}`);
    }
}

function buildTeam() {

    let teamString = "";

    for (let i = 1; i < config.teamNumber + 1; i++) {

        team = [];

        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }

        prepTeam();

        for (let a = 0; a < config.teamLength; a++) {
            stats = util.updateStats(team, stats);
            let priority = getPriority(team);
            let options = [];
            for (let b = 0; b < sets.length; b++) {
                if (!stats.defog && sets[b].defog && a < config.teamLength - 2 && util.isValid(sets[b], team)) { 
                    options.push(sets[b])
                }
                if (sets[b][priority] >= config.cutoff && util.isValid(sets[b], team) && sets[b].breaker < 5) {
                    if ((!stats.rocks) || (stats.rocks && !sets[b].rocks)) {
                        options.push(sets[b]);
                    }
                }
            }
            team.push(options[util.getRandomInt(options.length)]);
        }

        for (let [key, value] of Object.entries(stats.ints)) {
            if (value < config.recurseThreshold && config.teamNumber === 1) {
                if (recursions > 3200 || ((config.coreMode && config.startMon.set) && recursions > 500)) {
                    throw ("recurseThreshold too high - lower it or try again")
                }
                recursions++;
                teamString = buildTeam();
                break;
            }
        }

        for (let a = 0; a < team.length; a++) {
            let set = team[a].set;
            let moves = "";
            for(let b = 0; b < set.moves.length; b++){
                moves += `\n- ${set.moves[b]}`
            }
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature${moves}\n\n`
        }
    }

    return (teamString);
}

function prepTeam() {
    if (config.startMon.set) {
        team.push(startMon);
    } else {
        let bouncers = [];
        for (let a = 0; a < sets.length; a++) {
            if (sets[a].set.ability.toLowerCase() === "magic bounce" && util.isValid(sets[a], [])) {
                bouncers.push(sets[a]);
            }
        }
        if (bouncers) {
            team.push(bouncers[util.getRandomInt(bouncers.length)]);
            config.teamLength--;
        }
    }

    stats = util.updateStats(team, stats);

    for (let i = 0; i < sets.length; i++) {
        if (sets[i].set.name.toLowerCase().includes("chansey")) {
            team.push(sets[i]);
            config.teamLength--;
        }
    }
}

function getPriority() {
    let currentValue = 100;
    for (let [key, value] of Object.entries(stats.ints)) {
        if (value < currentValue) {
            currentValue = value;
            priority = key;
        }
    }
    return (priority);
}