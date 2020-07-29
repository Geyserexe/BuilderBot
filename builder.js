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


const config = require("./config.json");

let teamString = "";

if (config.teamNumber > 1) {
    for (let i = 0; i < config.teamNumber; i++) {

        let teamType = config.mode.toUpperCase()[0];

        teamString += `=== [gen8nationaldexag] team${i} (${teamType}) ===\n\n`
        teamString += require(`./${config.mode}builder.js`)

    }
} else {
    teamString = require(`./${config.mode}builder.js`)
}
console.log(teamString);
