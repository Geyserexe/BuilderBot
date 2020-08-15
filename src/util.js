const config = require("../config.js");
const sets = require(`./mon-sets/${config.tier}/sets.json`);

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

        for (const a of config.monsToAvoid){
            if(a && mon.set.name.toLowerCase().includes(a.toLowerCase())){
                return false;
            }
        }

        for (const a of team){

            if(mon.mega && a.mega){
                return false;
            }
            if(mon.z && a.z){
                return false;
            }
            if (a.cleric && mon.cleric) {
                return false;
            }
            if (mon.set.name.toLowerCase().includes(a.set.name.toLowerCase()) || a.set.name.toLowerCase().includes(mon.set.name.toLowerCase())) {
                return false;
            }
            if ((mon.set.name.includes("Tyranitar") && a.set.name === "Shedinja") || (mon === "Shedinja" && a.set.name.includes("Tyranitar"))) {
                return false;
            }

            a.set.moves.forEach(move => {
                if (move.toLowerCase().includes("whirlpool")) {
                    mon.set.moves.forEach(move2 => {
                        if(move2.toLowerCase().includes("whirlpool")){
                            return false;
                        }
                    });
                }
            });
        }

        return true;
    }

    getRandomMon(team) {
        let a = 0;
        let completed = false;
        while (!completed) {
            let rand = sets[this.getRandomInt(sets.length)];
            if (config.breakerOverride) {
                if (this.isValid(rand, team)) {
                    if ((!this.stats.rocks) || (this.stats.rocks && !rand.rocks)) {
                        return (rand);
                    }
                }
            } else {
                if (this.isValid(rand, team) && rand.breaker <= config.breakerWeight) {
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

    parseTeam(team) {

        let teamString = "";

        for (let i = 0; i < team.length; i++) {
            if (team[i] == null) {
                throw ("cutoff too high");
            }
            let set = team[i].set;
            let moves = "";
            for (let a = 0; a < set.moves.length; a++) {
                moves += `\n- ${set.moves[a]}`;
            }
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature${moves}\n\n`;
        }

        return (teamString);
    }
}

module.exports = new Util();