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
    cutoff: 5,
    mega:true,
    z:true,
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
    team[1] = sets[getRandomInt(sets.length)];
    for(var i = 0; i < config.teamLength; i++){
        var prunedArray = [];
        for(let [key, value] of Object.entries(stats.ints)){
            if(value < config.ints[key]){
                for(var a = 0; a < sets.length; a++){
                    if(sets[a][key] && sets[a][key] > config.cutoff){
                        if((!stats.mega && !stats.z) || (stats.mega && !sets[a].mega) || (stats.z && !sets[a].z)){
                            if(!speciesTest(sets[a])){
                                prunedArray.push(sets[a]);
                            }
                        }
                    }
                }
            }
            else if(prunedArray.length == 0){
                var set = sets[getRandomInt(sets.length)];
                if((stats.mega && set.mega) || (stats.z && set.z)){
                    while(set.mega || set.z){
                        if(!speciesTest(set)){
                            set = sets[getRandomInt(sets.length)];
                        }
                    }
                }
                prunedArray.push(set);
            }
        }
        var rand = getRandomInt(prunedArray.length);
        updateStats(prunedArray[rand])
        team.push(prunedArray[rand]);
        console.log(team);
        prunedArray = [];
        if(team.length > 6){
            break;
        }
    }
        var teamString = "";
        for(var i = 1; i < team.length; i++){
            set = team[i].set;
            teamString += set.name + " @ " +
                set.item + "\nAbility: " +
                set.ability + "\nEVs: " +
                set.evs + "\n" + set.nature + " Nature\n- " +
                set.moves[0] + "\n- " +
                set.moves[1] + "\n- " + set.moves[2] + "\n- " +
                set.moves[3] + "\n\n"
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

function speciesTest(mon){
    for(var i = 1; i < team.length + 1; i++){
        if(((mon.set.name === "Tyranitar" || mon.set.name === "Tyranitar-Mega") && team[i].set.name != "Shedinja") || (mon.set.name === "Shedinja" && (team[i].set.name === "Tyranitar" || team[i].set.name === "Tyranitar-Mega"))){
            return true;
        }
        if((mon.set.name === "Diancie" && team[i].set.name === "Diancie-Mega") || (mon.set.name === "Diancie-Mega" && team[i].set.name === "Diancie")){
            return true;
        }
        if((mon.set.name === "Tyranitar" && team[i].set.name === "Tyranitar-Mega") || (mon.set.name === "Tyranitar-Mega" && team[i].set.name === "Tyranitar")){
            return true;
        }
        if(mon.set.name == team[i].set.name){
            return true;
        }
        return false;
    }
}
