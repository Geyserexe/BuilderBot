const config = require("../config.json");
const sets = require(`./mon-sets/${config.gen}sets.json`);

class Util {

    init(stats) {
        this.statsTemplate = stats;
        this.stats = this.statsTemplate;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    updateStats(team) {
        this.stats = {};
        for (let [key, value] of Object.entries(this.statsTemplate)) {
            this.stats[key] = false;
        }
        this.stats.ints = {};
        for (let [key, value] of Object.entries(this.statsTemplate.ints)) {
            this.stats.ints[key] = 0;
        }

        for (let i = 0; i < team.length; i++) {
            for (let [key, value] of Object.entries(this.statsTemplate.ints)) {
                if (team[i][key]) {
                    this.stats.ints[key] += team[i][key];
                }
            }

            for (let [key, value] of Object.entries(this.statsTemplate)) {
                if (key != "ints" && team[i][key]) {
                    this.stats[key] = true;
                }
            }
        }

        return this.stats;
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

    getRandomMon(team) {
        let a = 0;
        let completed = false;
        while (!completed) {
            let rand = sets[this.getRandomInt(sets.length)];
            if (config.breakerOverride) {
                if (this.isValid(rand, team) && this.zMegaCheckPassed(rand) && this.clericTest(rand)) {
                    if ((!this.stats.rocks) || (this.stats.rocks && !rand.rocks)) {
                        return (rand);
                    }
                }
            } else {
                if (this.isValid(rand, team) && this.zMegaCheckPassed(rand) && this.clericTest(rand) && rand.breaker <= config.breakerWeight) {
                    if ((!this.stats.rocks) || (this.stats.rocks && !rand.rocks)) {
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

    zMegaCheckPassed(mon) {
        if (!this.stats.mega && !this.stats.z) {
            return true;
        } else if (this.stats.mega && !mon.mega) {
            return true;
        } else if (this.stats.z && !mon.z) {
            return true;
        }

        return false;
    }

    clericTest(mon) {
        if (this.stats.cleric && mon.cleric) {
            return false;
        }
        return true;
    }
}

module.exports = new Util();