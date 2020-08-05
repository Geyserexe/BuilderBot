#!/usr/bin/env node


const config = require("./config.json");

let team = "";


if (config.mode.toLowerCase() != "offense") {
    team = require(`./src/${config.gen}${config.mode.toLowerCase()}builder.js`);
} else {
    team = require(`./src/offensebuilder.js`);
}

console.log(team);
