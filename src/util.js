const config = require("./config.js");
const sets = require(`./mon-sets/${config.tier}/sets.json`);

class Util {

    bp = `Scolipede @ Mental Herb
Ability: Speed Boost
EVs: 80 HP / 240 Def / 188 Spe
Timid Nature
IVs: 0 Atk
- Baton Pass
- Substitute
- Protect
- Iron Defense

Smeargle @ Focus Sash
Ability: Moody
EVs: 20 HP / 252 Def / 236 Spe
Jolly Nature
- Baton Pass
- Spore
- Ingrain
- Spectral Thief

Drifblim @ Sitrus Berry
Ability: Unburden
EVs: 188 HP / 252 Def / 60 SpD / 8 Spe
Bold Nature
IVs: 0 Atk
- Baton Pass
- Minimize
- Substitute
- Defog   

Mr. Mime @ Wiki Berry
Ability: Soundproof
EVs: 204 HP / 244 Def / 32 SpD / 28 Spe
Bold Nature
IVs: 0 Atk
- Baton Pass
- Calm Mind
- Substitute
- Taunt

Vaporeon @ Normalium Z
Ability: Water Absorb
EVs: 216 HP / 252 Def / 40 Spe
Bold Nature
IVs: 0 Atk
- Baton Pass
- Aqua Ring
- Acid Armor
- Roar

Espeon @ Shell Bell
Ability: Magic Bounce
EVs: 8 HP / 208 Def / 68 SpA / 224 Spe
Modest Nature
IVs: 0 Atk
- Baton Pass
- Stored Power
- Dazzling Gleam
- Substitute`

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

        for (const a of team) {

            if ((mon.mega && a.mega) || (mon.z && a.z) || (a.cleric && mon.cleric)) {
                return false;
            }
            if (mon.set.name.toLowerCase().includes(a.set.name.toLowerCase()) || a.set.name.toLowerCase().includes(mon.set.name.toLowerCase())) {
                return false;
            }
            if ((mon.set.name.includes("Tyranitar") && a.set.name === "Shedinja") || (mon === "Shedinja" && a.set.name.includes("Tyranitar"))) {
                return false;
            }

            let avoidDupMoves = ["whirlpool", "knock off"];

            for (const avoidMove of avoidDupMoves) {
                a.set.moves.forEach(move => {
                    if (move.toLowerCase().includes(avoidMove)) {
                        mon.set.moves.forEach(move2 => {
                            if (move2.toLowerCase().includes(avoidMove)) {
                                return false;
                            }
                        });
                    }
                });
            }
        }

        if (config.mode.toLowerCase() === "offense" && mon.set.item.toLowerCase().includes("choice")) {
            return false;
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