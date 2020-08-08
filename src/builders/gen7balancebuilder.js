const sets = require("../mon-sets/gen7sets.json");
const config = require("../../config.json");
const util = require("../util.js");

let recursions = 0;

let stats = {
    ints: {
        rayCheck: 0,
        zygCheck: 0,
        marshCheck: 0,
        donCheck: 0,
        breaker: 0,
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
        return (buildTeam());
    } catch (err) {
        return (`error: ${err}`);
    }
}

function buildTeam() {

    let teamString = "";

    for (var b = 1; b < config.teamNumber + 1; b++) {

        recursions = 0;

        let team = [];
        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }

        if (!config.startMon.set) {
            team[0] = util.getRandomMon(team);
        } else {
            team[0] = config.startMon;
        }

        stats = util.updateStats(team);

        for (let i = 1; i < config.teamLength; i++) {

            let pruneArray = [];
            let prunedArray = [];
            let priority = "";
            let currentValue = 100;
            let rejected = [];
            for (let [key, value] of Object.entries(stats.ints)) {
                if (value <= currentValue && !config.breakerOverride) {
                    if (config.breakerWeight > 7 && Math.round(Math.random()) === 1) {
                        currentValue = value;
                        priority = key;
                    } else if (config.breakerWeight > 7) {
                        currentValue = 0;
                        priority = "breaker";
                    } else if (config.breakerWeight > 3 || (config.breakerWeight < 3 && key.toLowerCase() != "breaker")) {
                        currentValue = value;
                        priority = key;
                    }
                } else if (value <= currentValue) {
                    currentValue = value;
                    priority = key;
                }
            }

            for (let a = 0; a < sets.length; a++) {
                if (config.breakerOverride) {
                    if (sets[a][priority] >= config.cutoff) {
                        pruneArray.push(sets[a]);
                    }
                } else {
                    if (config.breakerWeight < 3) {
                        if (sets[a].set.ability.toLowerCase().includes("bounce")) {
                            pruneArray.push(sets[a])
                        } else if ((sets[a][priority] >= config.cutoff) && (sets[a].breaker <= config.breakerWeight)) {
                            pruneArray.push(sets[a])
                        }
                    } else if (sets[a][priority] >= config.cutoff) {
                        pruneArray.push(sets[a]);
                    }
                }
            }

            for (let a = 0; a < pruneArray.length; a++) {
                if (util.isValid(pruneArray[a], team) && util.clericTest(pruneArray[a])) {
                    if (!stats.rocks || !stats.defog) {
                        if (!stats.rocks && pruneArray[a].rocks) {
                            prunedArray.push(pruneArray[a]);
                        } else if (!stats.defog && pruneArray[a].defog) {
                            prunedArray.push(pruneArray[a]);
                        } else {
                            rejected.push(pruneArray[a]);
                        }
                    } else {
                        if ((!stats.rocks) || (stats.rocks && !pruneArray[a].rocks)) {
                            prunedArray.push(pruneArray[a]);
                        }
                    }
                }
            }

            if (prunedArray.length === 0) {
                if (!stats.defog && config.cutoff <= 2) {
                    let mon = util.getRandomMon(team);
                    let a = 0;
                    while (!mon.defog) {
                        mon = util.getRandomMon(team);
                        a++;
                        if (a > 1000) {
                            throw ("Not enough defoggers - try again or add more defoggers.");
                        }
                    }
                    prunedArray.push(mon);
                } else if (rejected) {
                    for (let i = 0; i < rejected.length; i++) {
                        if (rejected[i] && util.isValid(rejected[i], team) && util.clericTest(rejected[i])) {
                            if ((!stats.rocks) || (stats.rocks && !rejected[i].rocks)) {
                                prunedArray.push(rejected[i]);
                            }
                        }
                    }
                    if (prunedArray.length === 0) {
                        prunedArray.push(util.getRandomMon(team));
                    }
                } else {
                    prunedArray.push(util.getRandomMon(team));
                }
            }
            while (true) {
                let rand = prunedArray[util.getRandomInt(prunedArray.length)];
                if (util.isValid(rand, team) && util.clericTest(rand)) {
                    team.push(rand);
                    break;
                }
            }
            stats = util.updateStats(team);

        }

        for (let i = 0; i < team.length; i++) {
            let set = team[i].set;
            let moves = "";
            for (let a = 0; a < set.moves.length; a++) {
                moves += `\n- ${set.moves[a]}`
            }
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature${moves}\n\n`
        }

        for (let [key, value] of Object.entries(stats.ints)) {
            if (value < config.recurseThreshold && config.teamNumber === 1) {
                if (recursions > 1250 || (config.startMon.set && recursions > 1000)) {
                    throw ("recurseThreshold too high")
                }
                recursions++;
                teamString = buildTeam();
                break;
            } else if (key.toLowerCase() === "breaker" && value < config.breakerThreshold && config.teamNumber === 1) {
                if (recursions > 1250 || ((config.coreMode && config.startMon.set) && recursions > 500)) {
                    throw ("breakerThreshold too high")
                }
                recursions++;
                teamString = buildTeam();
                break;
            }
        }
    }
    return (teamString);
}