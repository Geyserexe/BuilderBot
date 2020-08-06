const config = require("../config.json");
const sets = require(`./mon-sets/${config.gen}sets.json`);

class Util {

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    updateStats(team, stats) {
        if (config.gen = "gen7") {
            let stats = {
                ints: { rayCheck: 0, zygCheck: 0, marshCheck: 0, donCheck: 0, breaker: 0, ultraCheck: 0, xernCheck: 0, ogreCheck: 0 },
                mega: false,
                z: false,
                rocks: false,
                defog: false,
                cleric: false
            };
        } else {
            stats = {
                ints: { rayCheck: 0, zygCheck: 0, zacCheck: 0, donCheck: 0, ygodCheck: 0, xernCheck: 0, ogreCheck: 0, breaker: 0 },
                mega: false,
                z: false,
                rocks: false,
                defog: false
            };
        }

        for (let i = 0; i < team.length; i++) {
            for (let [key, value] of Object.entries(stats.ints)) {
                if (team[i][key]) {
                    stats.ints[key] += team[i][key];
                }
            }

            for (let [key, value] of Object.entries(stats)) {
                if (key != "ints" && team[i][key]) {
                    stats[key] = true;
                }
            }
        }

        return stats;
    }

    isValid(mon, team) {
        for (let i = 0; i < team.length; i++) {
            if (mon.set.name.includes(team[i].set.name) || team[i].set.name.includes(mon.set.name)) {
                return false;
            }

            if ((mon.set.name.includes("Tyranitar") && team[i].set.name === "Shedinja") || (mon === "Shedinja" && team[i].set.name.includes("Tyranitar"))) {
                return false;
            }

            for (let a = 0; a < team[i].set.moves.length; a++) {
                if (team[i].set.moves[a].toLowerCase().includes("whirlpool")) {
                    for (let b = 0; b < mon.set.moves.length; b++) {
                        if (mon.set.moves[b].toLowerCase().includes("whirlpool")) {
                            return false;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < config.monsToAvoid.length; i++) {
            if (mon.set.name.toLowerCase() === config.monsToAvoid[i].toLowerCase()) {
                return false;
            }
        }

        return true;
    }

    getRandomMon(team, stats) {
        let a = 0;
        let completed = false;
        while (!completed) {
            let rand = sets[this.getRandomInt(sets.length)];
            if (config.breakerOverride) {
                if (this.isValid(rand, team) && this.zMegaCheckPassed(rand, stats) && this.clericTest(rand, stats)) {
                    if ((!stats.rocks) || (stats.rocks && !rand.rocks)) {
                        return (rand);
                    }
                }
            } else {
                if (this.isValid(rand, team) && this.zMegaCheckPassed(rand, stats) && this.clericTest(rand, stats) && rand.breaker <= config.breakerWeight) {
                    if ((!stats.rocks) || (stats.rocks && !rand.rocks)) {
                        return (rand);
                    }
                }
            }
            a++;
            if (a > 1000) {
                return (sets[this.getRandomInt(sets.length)])
            }
        }
    }

    zMegaCheckPassed(mon, stats) {
        if (!stats.mega && !stats.z) {
            return true;
        } else if (stats.mega && !mon.mega) {
            return true;
        } else if (stats.z && !mon.z) {
            return true;
        }

        return false;
    }

    clericTest(mon, stats) {
        if (stats.cleric && mon.cleric) {
            return false;
        }
        return true;
    }
}

module.exports = new Util();