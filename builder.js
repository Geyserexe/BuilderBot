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
    cutoff: 8,
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
    z:false,
    rocks:false,
    defog:false
};

var team = [];

BuildTeam();

function BuildTeam(){
    team[0] = sets[getRandomInt(sets.length-1)];
    updateStats[team[0]]
    for(let i = 1; i < config.teamLength; i++){
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
            if(sets[a].rocks && !stats.rocks){
                pruneArray.push(sets[a]);
            } else if(sets[a].defog && !stats.defog){
                pruneArray.push(sets[a]);
            }else if(sets[a][priority] >= config.cutoff){
                pruneArray.push(sets[a]);
            }
        }
        for(let a = 0; a < pruneArray.length; a++){
                if(isValid(pruneArray[a].set.name)){
                    if(zMegaCheckPassed(pruneArray[a])){
                        if(!stats.rocks){
                            prunedArray.push(pruneArray[a]);
                        }else if(!pruneArray[a].rocks){
                            prunedArray.push(pruneArray[a]);
                        }
                    }
                }
        }
        if(prunedArray.length === 0){
            prunedArray.push(sets[getRandomInt(sets.length-1)])
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
    if(mon.rocks){
        stats.rocks = true;
    }
    if(mon.defog){
        stats.defog = true;
    }
}

function isValid(mon){
    for(let i = 0; i < team.length; i++){
        if(mon.includes(team[i].set.name) || team[i].set.name.includes(mon) ){
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
