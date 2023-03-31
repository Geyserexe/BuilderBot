const config = require("../../config.js");
const sets = require("../../sets/gen8anythinggoes/sets.json");
const util = require("../../util.js");

let team = [];

let recursions = 0;

let stats = {
    ints: {
        zacCheck: 0,
        xernCheck: 0,
        ogreCheck: 0,
        calyCheck: 0
    },
    rocks: false,
    defog: false,
};

module.exports = tryBuild();

function tryBuild() {
    try {
        util.init(stats);
        return buildTeam();
    }
    catch (e) {
        if (String(e).includes("RangeError")) {
            return ("error: recurseThreshold too high - try again or lower it.");
        }
        return (`error: ${e}`);
    }
}

function buildTeam() {

    let teamString = "";

    let i = 0;

    while (i < config.teamNumber) {
        i++;
        team = [];

        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${i++} ===\n\n`;
        }

        for (let a = 0; a < config.teamLength; a++) {
            stats = util.updateStats(team, stats);
            let priority = getPriority(team);
            let options = [];
            for (let b = 0; b < sets.length; b++) {
                if (!stats.defog && sets[b].defog && a < config.teamLength - 2 && util.isValid(sets[b], team)) {
                    options.push(sets[b]);
                }
                if (sets[b][priority] >= config.cutoff && util.isValid(sets[b], team)) {
                    if ((!stats.rocks) || (stats.rocks && !sets[b].rocks)) {
                        options.push(sets[b]);
                    }
                }
            }
            if(!options){
                let priority = ["zacCheck","xernCheck","ogreCheck","calyCheck"][util.getRandomInt(4)];
                let options = [];
                for (let b = 0; b < sets.length; b++) {
                    if (!stats.defog && sets[b].defog && a < config.teamLength - 2 && util.isValid(sets[b], team)) {
                        options.push(sets[b]);
                    }
                    if (sets[b][priority] >= config.cutoff && util.isValid(sets[b], team)) {
                        if ((!stats.rocks) || (stats.rocks && !sets[b].rocks)) {
                            options.push(sets[b]);
                        }
                    }
                }
            }
            team.push(options[util.getRandomInt(options.length)]);
        }

        for (let value of Object.values(stats.ints)) {
            if (config.teamNumber === 1 && (value < config.recurseThreshold || !stats.defog)) {
                if (recursions > 3200 || ((config.coreMode && config.startMon.set) && recursions > 500)) {
                    throw ("recurseThreshold too high - lower it or try again");
                }
                recursions++;
                teamString = buildTeam();
                break;
            }
        }

        teamString += util.parseTeam(team);
        if (config.teamNumber == 1) {
            return (teamString);
        }
    }
    return (teamString);
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