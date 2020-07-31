#!usr/bin/env node

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

console.log('building.....');

require('child_process').execSync('tsc');

const config = require("./config.json");

let teamString = "";

teamString = require(`./dist/src/${config.builder.toLowerCase()}builder.js`);

console.log(teamString);
