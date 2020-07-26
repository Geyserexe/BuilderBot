// {
//     "set": {
//         "name":"",
//         "item":"",
//         "ability":"",
//         "evs":"",
//         "nature":"",
//         "moves":["", "", "", ""]
//     },
//     "breaker":,
//     "ogreCheck":,
//     "donCheck":,
//     "ygodCheck":,
//     "xernCheck":,
//     "rayCheck":,
//     "zygCheck":,
//     "zacCheck":,
//     "mega":,
//     "z":
// },


const sets = require("./sets.json");

const config = {
    ints:{  
        ygodCheck:10,
        xernCheck:7,
        breaker:15,
        ogreCheck:15,
        donCheck:15,
        rayCheck:7,
        zygCheck:7,
        zacCheck:7,
    },
    cutoff: 6,
    mega:true,
    z:true,
    teamLength: 6
};

var stats = {
    ints:{
        breaker:0,
        ogreCheck:0,// {
//     "set": {
//         "name":"",
//         "item":"",
//         "ability":"",
//         "evs":"",
//         "nature":"",
//         "moves":["", "", "", ""]
//     },
//     "breaker":,
//     "ogreCheck":,
//     "donCheck":,
//     "ygodCheck":,
//     "xernCheck":,
//     "rayCheck":,
//     "zygCheck":,
//     "zacCheck":,
//     "mega":,
//     "z":
// },


const sets = require("./sets.json");

const config = {
    cutoff: 6,
    teamLength: 6
};

var stats = {
    ints:{
        breaker:0,
        ogreCheck:0,
        donCheck:0,
        ygodCheck:0,
        xernCheck:0,
        rayCheck:0,
        zygCheck:0,
        zacCheck:0,
    },
    mega:false,
    z:false
};

var team = [];

BuildTeam();

function BuildTeam(){
    team[0] = sets[getRandomInt(sets.length-1)];
    updateStats[team[0]]
    for(let i = 0; i < config.teamLength-1; i++){
        let pruneArray = [];
        let prunedArray = [];
        let priority = "";
        let currentValue = 11;
        for(let [key, value] of Object.entries(stats.ints)){
            if(value < currentValue){
                currentValue = value;
                priority = key;
            }
        }
        for(let a = 0; a < sets.length; a++){
            if(sets[a][priority] > config.cutoff){
                pruneArray.push(sets[a]);
            }
        }
        for(let a = 0; a < pruneArray.length; a++){
            if(isValid(pruneArray[a].set.name)){
                if(zMegaCheckPassed(pruneArray[a])){
                    prunedArray.push(pruneArray[a])
                }
            }
        }
        team.push(prunedArray[getRandomInt(prunedArray.length-1)])
        updateStats(team[i])
    }
    let teamString = "";
    for(let i = 0; i < team.length; i++){
        set = team[i].set;
        teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
    }
    console.log(teamString);
    for(let [key, value] of Object.entries(stats.ints)){
        console.log(key,value);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function updateStats(mon){
    stats.ints.breaker += mon.breaker;
    stats.ints.ogreCheck += mon.ogreCheck;
    stats.ints.donCheck += mon.donCheck;
    stats.ints.ygodCheck += mon.ygodCheck;
    stats.ints.xernCheck += mon.xernCheck;
    stats.ints.rayCheck += mon.rayCheck;
    stats.ints.zygCheck += mon.zygCheck
    stats.ints.zacCheck += mon.zacCheck
    if(mon.mega){
        stats.mega = true;
    }
    if(mon.z){
        stats.z = true;
    }
}

function isValid(mon){
    for(let i = 0; i < team.length; i++){
        if(mon.includes(team[i].set.name)){
            return false;
        }
        if((mon.includes("Tyranitar") && team[i].set.name=== "Shedinja") || (mon === "Shedinja" && team[i].set.name.includes("Tyranitar"))){
            return false;
        }
    }
    return true;
}

function zMegaCheckPassed(mon){
    if(!stats.mega && !stats.z){
        return true;
    } else if(stats.mega && !mon.mega){
        return true;
    } else if(stats.z && !mon.z){
        return true;
    }
    return false;
}

        donCheck:0,
        ygodCheck:0,
        xernCheck:0,
        rayCheck:0,
        zygCheck:0,
        zacCheck:0,
    },
    mega:false,
    z:false
};

var team = [];

BuildTeam();

function BuildTeam(){
    team[0] = sets[getRandomInt(sets.length-1)];
    updateStats[team[0]]
    for(let i = 0; i < config.teamLength-1; i++){
        let pruneArray = [];
        let prunedArray = [];
        let priority = "";
        let currentValue = 11;
        for(let [key, value] of Object.entries(stats.ints)){
            if(value < currentValue){
                currentValue = value;
                priority = key;
            }
        }
        for(let a = 0; a < sets.length; a++){
            if(sets[a][priority] > config.cutoff){
                pruneArray.push(sets[a]);
            }
        }
        for(let a = 0; a < pruneArray.length; a++){
            if(isValid(pruneArray[a].set.name)){
                prunedArray.push(pruneArray[a])
            }
        }
        team.push(prunedArray[getRandomInt(prunedArray.length-1)])
        updateStats(team[i])
    }
    let teamString = "";
    for(let i = 0; i < team.length; i++){
        set = team[i].set;
        teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
    }
    console.log(teamString);
    for(let [key, value] of Object.entries(stats.ints)){
        console.log(key,value);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function updateStats(mon){
    stats.ints.breaker += mon.breaker;
    stats.ints.ogreCheck += mon.ogreCheck;
    stats.ints.donCheck += mon.donCheck;
    stats.ints.ygodCheck += mon.ygodCheck;
    stats.ints.xernCheck += mon.xernCheck;
    stats.ints.rayCheck += mon.rayCheck;
    stats.ints.zygCheck += mon.zygCheck
    stats.ints.zacCheck += mon.zacCheck
    if(mon.mega){
        stats.mega = true;
    }
    if(mon.z){
        stats.z = true;
    }
}
function isValid(mon){
    for(let i = 0; i < team.length; i++){
        if(mon.includes(team[i].set.name)){
            return false;
        }
        if((mon.includes("Tyranitar") && team[i].set.name=== "Shedinja") || (mon === "Shedinja" && team[i].set.name.includes("Tyranitar"))){
            return false;
        }
    }
    return true;
}
