const sets = require("./mon-sets/natdexsets.json");
const config = require("../config.json");
const cores = require("./mon-sets/natdexcores.json")

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
    mega: false,
    z: false,
    rocks: false,
    defog: false,
    cleric: false
};

module.exports = tryBuild();

function tryBuild() {
    try {
        return (buildTeam());
    } catch (err) {
        return(`error: ${err}`);
    }
}

function buildTeam() {

    let length = config.teamLength;
    let teamString = "";

    for (var b = 0; b < config.teamNumber; b++) {
        config.teamLength = length;
        let team = [];
        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }

        if (!config.startMon.set && !config.coreMode) {
            team[0] = getRandomMon(team);
        } else if (config.coreMode) {
            let core = cores[getRandomInt(cores.length)];
            for (let i = 0; i < core.length; i++) {
                team.push(core[i]);
            }
            config.teamLength -= core.length - 1;
        } else {
            team[0] = config.startMon;
        }


        updateStats(team);

        for (let i = 1; i < config.teamLength; i++) {

            let pruneArray = [];
            let prunedArray = [];
            let priority = "";
            let currentValue = 11;
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
                if (isValid(pruneArray[a], team) && zMegaCheckPassed(pruneArray[a]) && clericTest(pruneArray[a])) {
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
                    let mon = getRandomMon(team);
                    let a = 0;
                    while (!mon.defog) {
                        mon = getRandomMon(team);
                        a++;
                        if (a > 1000) {
                            break;
                        }
                    }
                    prunedArray.push(mon);
                } else if (rejected) {
                    for (let i = 0; i < rejected.length; i++) {
                        if (rejected[i] && isValid(rejected[i], team) && zMegaCheckPassed(rejected[i]) && clericTest(rejected[i])) {
                            if ((!stats.rocks) || (stats.rocks && !rejected[i].rocks)) {
                                prunedArray.push(rejected[i]);
                            }
                        }
                    }
                    if (prunedArray.length === 0) {
                        prunedArray.push(getRandomMon(team));
                    }
                } else {
                    prunedArray.push(getRandomMon(team));
                }
            }
            while (true) {
                let rand = prunedArray[getRandomInt(prunedArray.length)];
                if (isValid(rand, team) && zMegaCheckPassed(rand) && clericTest(rand)) {
                    team.push(rand);
                    break;
                }
            }
            updateStats(team);

        }

        for (let i = 0; i < team.length; i++) {
            set = team[i].set;
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
        }

        for (let [key, value] of Object.entries(stats.ints)) {
            if (value < config.recurseThreshold) {
                if (recursions > 1000) {
                    throw ("recurseThreshold too high")
                }
                recursions++;
                console.log(`recurse #${recursions}`)
                teamString = buildTeam();
                break;
            }
        }
    }

    return (teamString);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function updateStats(team) {
    stats = {
        ints: {
            rayCheck: 0,
            zygCheck: 0,
            zacCheck: 0,
            donCheck: 0,
            ygodCheck: 0,
            xernCheck: 0,
            ogreCheck: 0,
            breaker: 0,
        },
        mega: false,
        z: false,
        rocks: false,
        defog: false
    };

    for (let i = 0; i < team.length; i++) {
        if (team[i].breaker) { stats.ints.breaker += team[i].breaker; }
        if (team[i].rayCheck) { stats.ints.rayCheck += team[i].rayCheck; }
        if (team[i].zygCheck) { stats.ints.zygCheck += team[i].zygCheck; }
        if (team[i].zacCheck) { stats.ints.zacCheck += team[i].zacCheck; }
        if (team[i].donCheck) { stats.ints.donCheck += team[i].donCheck; }
        if (team[i].ygodCheck) { stats.ints.ygodCheck += team[i].ygodCheck; }
        if (team[i].xernCheck) { stats.ints.xernCheck += team[i].xernCheck; }
        if (team[i].ogreCheck) { stats.ints.ogreCheck += team[i].ogreCheck; }

        if (team[i].mega) {
            stats.mega = true;
        }

        if (team[i].z) {
            stats.z = true;
        }

        if (team[i].rocks) {
            stats.rocks = true;
        }

        if (team[i].defog) {
            stats.defog = true;
        }

        if (team[i].cleric) {
            stats.cleric = true;
        }
    }
}

function isValid(mon, team) {
    for (let i = 0; i < team.length; i++) {
        if (mon.set.name.includes(team[i].set.name) || team[i].set.name.includes(mon.set.name)) {
            return false;
        }

        if ((mon.set.name.includes("Tyranitar") && team[i].set.name === "Shedinja") || (mon === "Shedinja" && team[i].set.name.includes("Tyranitar"))) {
            return false;
        }
    }
    for (let i = 0; i < config.monsToAvoid.length; i++) {
        if (mon.set.name.toLowerCase() === config.monsToAvoid[i].toLowerCase()) {
            return false;
        }
    }
    return true;
}

function zMegaCheckPassed(mon) {
    if (!stats.mega && !stats.z) {
        return true;
    } else if (stats.mega && !mon.mega) {
        return true;
    } else if (stats.z && !mon.z) {
        return true;
    }

    return false;
}

function clericTest(mon) {
    if (stats.cleric && mon.cleric) {
        return false;
    }
    return true;
}

function getRandomMon(team) {
    let a = 0;
    let completed = false;
    while (!completed) {
        let rand = sets[getRandomInt(sets.length - 1)];
        if (config.breakerOverride) {
            if (isValid(rand, team) && zMegaCheckPassed(rand) && clericTest(rand)) {
                if ((!stats.rocks) || (stats.rocks && !rand.rocks)) {
                    return (rand);
                }
            }
        } else {
            if (isValid(rand, team) && zMegaCheckPassed(rand) && clericTest(rand) && rand.breaker <= config.breakerWeight) {
                if ((!stats.rocks) || (stats.rocks && !rand.rocks)) {
                    return (rand);
                }
            }
        }
        a++;
        if (a > 1000) {
            return (sets[getRandomInt(sets.length - 1)])
        }
    }
}