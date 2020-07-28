const leads = require("./mon-sets/leads.json");
const sets = require("./mon-sets/sets.json");
const config = require("./config.json")


module.exports = buildTeam(); 

function buildTeam(){

    let teamString = "";

    let team = [];

    if(config.startMon.set){
        team[0] = config.startMon;
    } else {
        team[0] = leads[getRandomInt(leads.length)]
    }
    for(let i = 1; i < config.teamLength; i++){
        let prunedArray = getMons(0, team);
        if(prunedArray.length > 0){
            team.push(prunedArray[getRandomInt(prunedArray.length)]);
        }else {
            let foundMon = false;
            let reps = 1;
            while(!foundMon){
                let newList = getMons(reps, team);
                if(newList.length > 1){
                    team.push(newList[getRandomInt(length)]);
                    foundMon = true;
                }
                reps++;
            }
        }
    }
    
    for(let i = 0; i < team.length; i++){
        set = team[i].set;
        teamString += `${set.name} @ ${set.item}\nAbility: ${set.ability}\nEVs: ${set.evs}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\n\n`
    }

    return(teamString);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function isValid(mon, team){
    if(mon.set.name.toLowerCase() === config.monToAvoid.toLowerCase()){
        return false;
    }
    for(let i = 0; i < team.length; i++){
        if(mon.set.name.includes(team[i].set.name) || team[i].set.name.includes(mon.set.name) ){
            return false;
        }
        if((mon.z && team[i].z) || (mon.mega && team[i].mega)){
            return false;
        }
    }
    return true;
}

function getMons(num, team){
    let prunedArray = [];
    for(var a = 0; a < sets.length; a++){
        let mon = sets[a];
        if(sets[a].breaker >= config.cutoff-num && isValid(sets[a], team)){
            prunedArray.push(mon);
        }
    }
    if(prunedArray.length > 0){
        return(prunedArray);
    } else {
        return([]);
    }
}