#!/usr/bin/env node


const config = require("./config.json");

let teamString = "";


if (config.mode.toLowerCase() != "offense") {
    teamString = require(`./src/${config.gen}${config.mode.toLowerCase()}builder.js`);
} else {
    teamString = require(`./src/offensebuilder.js`);
}

console.log(teamString);
