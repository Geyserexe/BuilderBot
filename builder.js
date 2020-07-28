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
const leads = require("./leads.json");

const config = {
    multiMode: {
        on:false,
        teamNumber: 10
    },
    cutoff: 9,
    teamLength: 6,
    offenseMode: true
};

const startMon = {

};

let stats = {
    ints:{
        rayCheck:0,
        zygCheck:0,
        zacCheck:0,
        donCheck:0,
        breaker:0,
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

if(config.multiMode.on){
    for(let i = 0; i < config.Multimode.teamNumber; i++){
        BuildTeam();
        team = [];
        stats = {
            ints:{
                rayCheck:0,
                zygCheck:0,
                zacCheck:0,
                donCheck:0,
                breaker:0,
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
    }
} else {
    BuildTeam();
}


function BuildTeam(){
    if(config.offenseMode){
        team[0] = leads[getRandomInt(leads.length-1)];
    }
    else if(!startMon.set){
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
        let rejected = [];
        if(config.offenseMode){
            stats.defog = true;
        }
        for(let [key, value] of Object.entries(stats.ints)){
            if(config.offenseMode){
                priority = "breaker";
            } else if(value <= currentValue+1){
                currentValue = value;
                priority = key;
            }
        }

        for(let a = 0; a < sets.length; a++){
            if(sets[a][priority] >= config.cutoff){
                pruneArray.push(sets[a]);
            }
        }

        for(let a = 0; a < pruneArray.length; a++){
            if(isValid(pruneArray[a].set.name) && zMegaCheckPassed(pruneArray[a]) && clericTest(pruneArray[a])){
                if(!stats.rocks || !stats.defog){
                    if(!stats.rocks && pruneArray[a].rocks){
                        prunedArray.push(pruneArray[a]);
                    } else if(!stats.defog && pruneArray[a].defog){
                        prunedArray.push(pruneArray[a]);
                    } else {
                        rejected.push(pruneArray[a]);
                    }
                } else{
                    if((!stats.rocks) || (stats.rocks && !pruneArray[a].rocks))
                    prunedArray.push(pruneArray[a]);
                }
            }
        }

        if(prunedArray.length === 0){
            if(!stats.defog && config.cutoff <= 2){
                let mon = getRandomMon();
                let a = 0;
                while(!mon.defog){
                    mon = getRandomMon();
                    a++;
                    if(a > 1000){
                        break;
                    }
                }
                prunedArray.push(mon);
            } else if(rejected){
                for(let i = 0; i < rejected.length; i++){
                    if(rejected[i] && isValid(rejected[i].set.name) && zMegaCheckPassed(rejected[i]) && clericTest(rejected[i])){
                        if((!stats.rocks) || (stats.rocks && !rejected[i].rocks)){
                            prunedArray.push(rejected[i]);
                        }
                    }
                }
                if(prunedArray.length === 0){
                        prunedArray.push(getRandomMon());
                }
            } else {
                prunedArray.push(getRandomMon());
            }
        }
        team.push(prunedArray[getRandomInt(prunedArray.length)])
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
            rayCheck:0,
            zygCheck:0,
            zacCheck:0,
            donCheck:0,
            ygodCheck:0,
            xernCheck:0,
            ogreCheck:0,
            breaker:0,
        },
        mega:false,
        z:false,
        rocks:false,
        defog:false
    };

    if(config.offenseMode){
        stats.defog = true;
    }

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

function getRandomMon(){
    let a = 0;
    let completed = false;
    while(!completed){
        let rand = sets[getRandomInt(sets.length)];
        if(isValid(rand.set.name) && zMegaCheckPassed(rand) && clericTest(rand)){
            if((!stats.rocks) || (stats.rocks && !rand.rocks)){
                return(rand);
            }
        }
        a++;
        if(a > 1000){
            return(sets[getRandomInt(set.length-1)])
        }
    }
}
