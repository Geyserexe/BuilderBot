const sets = require("./mon-sets/natdexsets.json");
const leads = require("./mon-sets/natdexleads.json");
const config = require("../config.json");

let rawTeam = config.teamToOptimize;
let team = [];
let mode = "";
let leadList = [];
let monList = [];
let roles = {};
let filledRoles = {};
let needsFixes = false;
let teamString = "";

module.exports = optimizeTeam();


function optimizeTeam() {
    initialize();
    console.log(roles);
    for(let i = 0; i < team.length; i++){
        for(let [key, value] of Object.entries(roles)){
            for(let a = 0; a < value.length; a++){
                if(value[a].toLowerCase() === team[i].set.name.toLowerCase()){
                    if(key != "rocks" || key != "defog"){
                        team[i][key] = true;
                        filledRoles[key] = true;
                    } else {
                        for(let b = 0; b < team[i].set.moves.length; b++){
                            if(team[i].set.moves[b].includes("stealth")){
                                team[i].rocks = true;
                            }
                            if(team[i].set.moves[b].includes["defog"]){
                                team[i].defog = true;
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(team);

    for(let [key,value] of Object.entries(filledRoles)){
        if(!value){
            needsFixes = true;
            console.log(`Team lacks: ${key}`);
        }
    }

    if(needsFixes){
        for (let i = 0; i < team.length; i++){
            for(let keys of Object.entries(team[i])){
                if(keys.length < 2){
                    team[i].canBeRemoved = true;
                }
            }
        }
    }

    for (let i = 0; i < team.length; i++) {
        set = team[i].set;
        teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
    }
    return(teamString);
}

function initialize() {
    console.log("loading sets...");
    parseTeam();
    for (let i = 0; i < leads.length; i++) {
        leadList.push(leads[i].name);
    }
    for (let i = 0; i < sets.length; i++) {
        monList.push(sets[i].name);
    }
    mode = "balance"
    for (let i = 0; i < team.length; i++) {
        for (let a = 0; a < leadList.length; a++) {
            if (team[i].set.name === leadList[a]) {
                mode = "offense";
            }
        }
    }
    console.log("loading roles...");
    loadRoles();
}

function parseTeam() {
    let rawArray = rawTeam.split("||||]");
    for (let i = 0; i < rawArray.length; i++) {
        let set = rawArray[i].split("||");
        let mon = {
            set: {
                name: "",
                item: "",
                ability: "",
                evs: "",

                nature: "",
                moves: ["", "", "", ""]
            }
        }
        mon.set.name = set[0]
        let parsedSet = set[1].split("|");
        mon.set.item = parsedSet[0];
        mon.set.ability = parsedSet[1];
        mon.set.moves = parsedSet[2].split(",");
        mon.set.nature = parsedSet[3]
        let evs = parsedSet[4].split(",")
        let preEvs = { HP: "", Atk: "", Def: "", SpA: "", SpD: "", Spe: "" };
        preEvs.HP = evs[0];
        preEvs.Atk = evs[1];
        preEvs.Def = evs[2];
        preEvs.SpA = evs[3];
        preEvs.SpD = evs[4];
        preEvs.Spe = evs[5];
        if (preEvs.HP) {
            mon.set.evs += `${preEvs.HP} HP`;
        }
        if (preEvs.Atk) {
            if (mon.set.evs) {
                mon.set.evs += " / "
            }
            mon.set.evs += `${preEvs.Atk} Atk`;
        }
        if (preEvs.Def) {
            if (mon.set.evs) {
                mon.set.evs += " / "
            }
            mon.set.evs += `${preEvs.Def} Def`;
        }
        if (preEvs.SpA) {
            if (mon.set.evs) {
                mon.set.evs += " / "
            }
            mon.set.evs += `${preEvs.SpA} SpA`;
        }
        if (preEvs.SpD) {
            if (mon.set.evs) {
                mon.set.evs += " / "
            }
            mon.set.evs += `${preEvs.SpD} SpD`;
        }
        if (preEvs.Spe) {
            if (mon.set.evs) {
                mon.set.evs += " / "
            }
            mon.set.evs += `${preEvs.Spe} Spe`
        }

        team.push(mon);
    }
}

function loadRoles() {
    for (let [key, value] of Object.entries(sets[1])) {
        if (key === "mega" || key === "z" || key === "set") {} else {
            filledRoles[key] = false;
            roles[key] = [];
        }
    }
    for (let i = 0; i < sets.length; i++) {
        for (let [key, value] of Object.entries(sets[i])) {
            if (sets[i][key] >= config.cutoff) {
                roles[key].push(sets[i].set.name)
            }
        }
    }
    for (let i = 0; i < sets.length; i++) {
        if (sets[i].defog) {
            roles.defog.push(sets[i].set.name);
        }
        if (sets[i].rocks) {
            roles.rocks.push(sets[i].set.name);
        }
    }
}