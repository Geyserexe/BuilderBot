#!/usr/bin/env node

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

if (config.mode.toLowerCase() === "optimize") {
    teamString = require("./src/optimizer.js");
} else if (config.mode.toLowerCase() != "offense") {
    teamString = require(`./src/${config.gen}${config.mode.toLowerCase()}builder.js`);
} else {
    teamString = require(`./src/offensebuilder.js`);
}

console.log(teamString);
