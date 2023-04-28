const config = require("./config.js");
const sets = require(`./sets/${config.tier}/sets.json`);

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
        for (let key of Object.keys(this.statsTemplate)) {
            this.stats[key] = false;
        }
        this.stats.ints = {};
        for (let key of Object.keys(this.statsTemplate.ints)) {
            this.stats.ints[key] = 0;
        }

        for (let i = 0; i < team.length; i++) {
            for (let key of Object.keys(this.statsTemplate.ints)) {
                if (team[i][key]) {
                    this.stats.ints[key] += team[i][key];
                }
            }

            for (let key of Object.keys(this.statsTemplate)) {
                if (key != "ints" && team[i][key]) {
                    this.stats[key] = true;
                }
            }
        }

        return this.stats;
    }

    isValid(mon, team) {

        for (const a of config.monsToAvoid) {
            if (a && mon.set.name.toLowerCase().includes(a.toLowerCase())) {
                return false;
            }
        }

        if (config.mode.toLowerCase() === "offense" && mon.set.item.toLowerCase().includes("choice")) {
            return false;
        }

        for (const a of team) {
            if (config.tier.toLowerCase() != "gen8anythinggoes") {
                if ((mon.mega && a.mega) || (mon.z && a.z) || (a.cleric && mon.cleric)) {
                    return false;
                }
            }
            if (config.speciesClause) {
                if (mon.set.name.toLowerCase().includes(a.set.name.toLowerCase()) || a.set.name.toLowerCase().includes(mon.set.name.toLowerCase())) {
                    return false;
                }
            }
            if ((mon.set.name.includes("Tyranitar") && a.set.name === "Shedinja") || (mon === "Shedinja" && a.set.name.includes("Tyranitar"))) {
                return false;
            }
            if ((mon.set.name.includes("Dracovish") && a.set.name === "Groudon") || (mon.set.name.includes("Groudon") && a.set.name === "Dracovish")){
                return false;
            }
            if (!config.speciesClause) {
                if ((mon.set.name.toLowerCase() == "necrozma-dusk-mane" && a.set.name.toLowerCase() == "necrozma-dusk-mane")
                    || (mon.set.name.toLowerCase() == "calyrex-shadow" && a.set.name.toLowerCase() == "calyrex-shadow")) {
                    return false;
                }
                let moves = a.set.moves;
                if (a.set.name.toLowerCase().includes(mon.set.name.toLowerCase())) {
                    let matches = 0;
                    for (let i = 0; i < moves.length; i++) {
                        if (moves[i].toLowerCase().includes(mon.set.moves[i].toLowerCase())) {
                            matches++;
                        }
                    }
                    if (matches == moves.length) {
                        return false;
                    }
                }
            }
        }

        if(config.tier == "gen7anythinggoes"){
            let avoidDupMoves = ["whirlpool"];
            for (const avoidMove of avoidDupMoves) {
                for (const a of team) {
                    for (const move of a.set.moves) {
                        if (move.toLowerCase().includes(avoidMove)) {
                            for (const b of mon.set.moves) {
                                if (b.toLowerCase().includes(avoidMove)) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    getRandomMon(team) {
        let a = 0;
        let completed = false;
        while (!completed) {
            let rand = sets[this.getRandomInt(sets.length)];
            if (this.isValid(rand, team)) {
                if ((!this.stats.rocks) || (this.stats.rocks && !rand.rocks)) {
                    return (rand);
                }
            }
            a++;
            if (a > 1000) {
                return (sets[this.getRandomInt(sets.length)]);
            }
        }
    }

    parseTeam(team) {

        let teamString = "";

        team.forEach(mon => {
            if (mon == null) {
                throw ("Error while building. Please try again.");
            }
            let moves = "";
            mon.set.moves.forEach(move => {
                moves += `\n- ${move}`;
            });
            teamString += `${mon.set.name} @ ${mon.set.item}\nAbility: ${mon.set.ability}\nEVs: ${mon.set.evs}\n${mon.set.nature} Nature${moves}\n\n`;
        });

        return (teamString);
    }
}

module.exports = new Util();