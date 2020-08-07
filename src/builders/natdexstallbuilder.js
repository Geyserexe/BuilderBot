const config = require("../../config.json");
const sets = require("../mon-sets/natdexsets.json");
const util = require("../util.js");

let team = [];

let stats = {
    ints: {
        rayCheck: 0,
        zygCheck: 0,
        zacCheck: 0,
        donCheck: 0,
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
        util.init(stats);
        return buildTeam();
    }
    catch (err) {
        return (`error: ${err}`);
    }
}

function buildTeam() {

    let teamString = "";

    for (let i = 0; i < config.teamNumber; i++) {

        team = [];

        if (config.teamNumber > 1) {
            teamString += `=== [${config.tier}] team${b} ===\n\n`;
        }

        prepTeam();

        util.updateStats(team, stats);

        for (let a = 0; a < config.teamLength; a++) {

        }

        for (let i = 0; i < team.length; i++) {
            let set = team[i].set;
            teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
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
            if (sets[a].set.ability.toLowerCase() === "magic bounce" && util.isValid(sets[a], team)) {
                bouncers.push(sets[a]);
            }
        }
        if(bouncers){
            team.push(bouncers[util.getRandomInt(bouncers.length)]);
        } else {
            config.teamLength++;
        }
    }

    let clerics = [];
    for (let b = 0; b < sets.length; b++){
        if(sets[b].cleric && util.isValid(sets[b], team)){
            clerics.push(sets[b]);
        }
    }
    if(clerics){
        team.push(clerics[util.getRandomInt(clerics.length)]);
        config.teamLength--;
    }
}