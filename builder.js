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
//     "z":,
//     "rocks":,
//     "defog":
// },


const sets = require("./sets.json");

const config = {
    cutoff: 8,
    teamLength: 6
};

const startMon = {

};

let stats = {
    ints:{
        breaker:0,
        rayCheck:0,
        zygCheck:0,
        zacCheck:0,
        donCheck:0,
        ygodCheck:0,
        xernCheck:0,
        ogreCheck:0
    },
    mega:false,
    z:false,
    rocks:false,
    defog:false,
    cleric:false
};

let team = [];

BuildTeam();

function BuildTeam(){

    if(!startMon.set){
        team[0] = sets[getRandomInt(sets.length-1)];
    } else {
        team[0] = startMon;
    }
    
    updateStats();

    for(let i = 1; i < config.teamLength; i++){

        let pruneArray = [];
        let prunedArray = [];
        let priority = "";
        let currentValue = 11;

        for(let [key, value] of Object.entries(stats.ints)){
            if(value <= currentValue+1){
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
                            if(clericTest(pruneArray[a])){
                                prunedArray.push(pruneArray[a]);
                            }
                        } else if(!pruneArray[a].rocks){
                            if(clericTest(pruneArray[a])){
                                prunedArray.push(pruneArray[a]);
                            }
                        }
                    }
                }
        }

        if(prunedArray.length === 0){
            let completed = false;
            while(!completed){
                let rand = sets[getRandomInt(sets.length-1)];
                if(isValid(rand.set.name) && zMegaCheckPassed(rand) && clericTest(rand)){
                    if(!(stats.rocks && rand.rocks)){
                        prunedArray.push(rand);
                        completed = true;
                    }
                }
            }
        }

        team.push(prunedArray[getRandomInt(prunedArray.length-1)])
        updateStats();

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

function updateStats(){
    stats = {
        ints:{
            breaker:0,
            rayCheck:0,
            zygCheck:0,
            zacCheck:0,
            donCheck:0,
            ygodCheck:0,
            xernCheck:0,
            ogreCheck:0
        },
        mega:false,
        z:false,
        rocks:false,
        defog:false
    };

    for(let i = 0; i < team.length; i++){
        if(team[i].breaker){stats.ints.breaker += team[i].breaker;}
        if(team[i].rayCheck){stats.ints.rayCheck += team[i].rayCheck;}
        if(team[i].zygCheck){stats.ints.zygCheck += team[i].zygCheck;}
        if(team[i].zacCheck){stats.ints.zacCheck += team[i].zacCheck;}
        if(team[i].donCheck){stats.ints.donCheck += team[i].donCheck;}
        if(team[i].ygodCheck){stats.ints.ygodCheck += team[i].ygodCheck;}
        if(team[i].xernCheck){stats.ints.xernCheck += team[i].xernCheck;}
        if(team[i].ogreCheck){stats.ints.ogreCheck += team[i].ogreCheck;}

        if(team[i].mega){
            stats.mega = true;
        }

        if(team[i].z){
            stats.z = true;
        }

        if(team[i].rocks){
            stats.rocks = true;
        }

        if(team[i].defog){
            stats.defog = true;
        }

        if(team[i].cleric){
            stats.cleric = true;
        }
    }
}

function isValid(mon){
    for(let i = 0; i < team.length; i++){
        if(mon.includes(team[i].set.name) || team[i].set.name.includes(mon) ){
            return false;
        }

        if((mon.includes("Tyranitar") && team[i].set.name === "Shedinja") || (mon === "Shedinja" && team[i].set.name.includes("Tyranitar"))){
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

function clericTest(mon){
    if(stats.cleric && mon.cleric){
        return false;
    }
    return true;
}
