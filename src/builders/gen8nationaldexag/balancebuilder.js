const sets = require("../../sets/gen8nationaldexag/sets.json");
const config = require("../../config.js");
const cores = require("../../sets/gen8nationaldexag/cores.json")
const util = require("../../util.js");

let recursions = 0;

let stats = {
    ints: {
        rayCheck: 0,
        zygCheck: 0,
        zacCheck: 0,
        donCheck: 0,
        breaker: 0,
        ygodCheck: 0,
        xernCheck: 0,
        ogreCheck: 0
    },
    rocks: false,
    defog: false,
    cleric: false
};

module.exports = tryBuild();

function tryBuild() {
    try {
        util.init(stats);
        return (buildTeam());
    } catch (e) {
        if (String(e).includes("RangeError")) {
            return ("error: recurseThreshold or breakerThreshold too high - try again or lower them.");
        }
        return (`error: ${e}`);
    }
}

function buildTeam() {

    let length = config.teamLength;
    let teamString = "";

    for (var b = 1; b < config.teamNumber + 1; b++) {

        stats = {
            ints: {
                rayCheck: 0,
                zygCheck: 0,
                zacCheck: 0,
                donCheck: 0,
                breaker: 0,
                ygodCheck: 0,
                xernCheck: 0,
                ogreCheck: 0
            },
            rocks: false,
            defog: false,
            cleric: false
        };

        recursions = 0;

        config.teamLength = length;
        let team = [];
        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }

        if (config.startMon.set) {
            team[0] = config.startMon;
        }
        if (config.coreMode) {
            let core = cores[util.getRandomInt(cores.length)];
            for (let i = 0; i < core.length; i++) {
                team.push(core[i]);
            }
            config.teamLength -= core.length - 1;
            if (config.startMon.set) {
                config.teamLength--;
            }
        } else if (!config.startMon.set) {
            team[0] = util.getRandomMon([]);
        }


        stats = util.updateStats(team);

        for (let i = 1; i < config.teamLength; i++) {

            let pruneArray = [];
            let prunedArray = [];
            let priority = "breaker";
            let currentValue = 100;
            let rejected = [];
            for (let [key, value] of Object.entries(stats.ints)) {
                if (value <= currentValue) {
                    if (config.breakerThreshold >= config.recurseThreshold) {
                        if (value < config.recurseThreshold) {
                            currentValue = value;
                            priority = key;
                        }
                    } else if (key != "breaker" && value < config.recurseThreshold) {
                        currentValue = value;
                        priority = key;
                    }
                }
            }

            for (let a = 0; a < sets.length; a++) {
                let set = sets[a];
                if (set[priority] >= config.cutoff) {
                    pruneArray.push(set);
                }
            }

            for (let a = 0; a < pruneArray.length; a++) {
                let mon = pruneArray[a]
                if (util.isValid(mon, team)) {
                    if (!stats.rocks || !stats.defog) {
                        if (!stats.rocks && mon.rocks) {
                            prunedArray.push(mon);
                        } else if (!stats.defog && mon.defog) {
                            prunedArray.push(mon);
                        } else {
                            rejected.push(mon);
                        }
                    } else {
                        if ((!stats.rocks) || (stats.rocks && !mon.rocks)) {
                            prunedArray.push(mon);
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
                        if (rejected[i] && util.isValid(rejected[i], team)) {
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
            let tests = 0;
            while (true) {
                let rand = prunedArray[util.getRandomInt(prunedArray.length)];
                if (util.isValid(rand, team)) {
                    team.push(rand);
                    break;
                }
                tests++;
                if (tests >= 1000) {
                    throw ("recurseThreshold or breakerThreshold too high - lower one or try again");
                }
            }
            stats = util.updateStats(team);

        }

        teamString += util.parseTeam(team);

        for (let value of Object.values(stats.ints)) {
            if (config.teamNumber === 1 && ((value < config.recurseThreshold || !stats.defog) || stats.ints.breaker < config.breakerThreshold)) {
                if (recursions > 3200 || ((config.coreMode && config.startMon.set) && recursions > 500)) {
                    throw ("recurseThreshold or breakerThreshold too high - lower one or try again");
                }
                recursions++;
                teamString = buildTeam();
                break;
            }
        }
    }
    return (teamString);
}